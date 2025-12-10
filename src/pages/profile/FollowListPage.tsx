import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link, useLocation } from "react-router-dom";
import Layout from "../../components/layout/Layout";
import UserCard from "../../components/UserCard";
import type { FollowUser } from "../../types/social";
import { getFollowers, getFollowing, followUser, unfollowUser, getProfileById } from "../../utils";

const FollowListPage: React.FC = () => {
  const { username, type } = useParams<{ username: string; type: "followers" | "following" }>();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [activeTab, setActiveTab] = useState<"followers" | "following">(type || "followers");
  const [users, setUsers] = useState<FollowUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [profileName, setProfileName] = useState(location.state?.fullName || username);
  const [myFollowingIds, setMyFollowingIds] = useState<Set<string>>(new Set());
  
  // Try to get userId from state, otherwise we might need to fetch it (not implemented fully here for simplicity, assuming state or cached profile)
  // But strictly speaking, if user refreshes page, state is lost. 
  // Ideally we should fetch profile by username if userId is missing.
  const [targetUserId, setTargetUserId] = useState<string | null>(location.state?.userId || null);

  useEffect(() => {
     if (type) setActiveTab(type);
  }, [type]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        let currentUserId = targetUserId;

        // If no userId (e.g. direct link or refresh), fetch profile first
        if (!currentUserId && username) {
             // We need a way to find ID by username. 
             // We can use getAllPosts to find user or a specific API if available using existing utils.
             // But existing utils has getProfileById only.
             // Actually ProfilePage uses a hack to find ID from Posts or local auth.
             // Let's assume for now we might fail or user came from ProfilePage.
             // A better backend API would be getProfileByUsername.
             // For now, let's try to recover if it's the auth user
             const stored = localStorage.getItem("auth_user") || sessionStorage.getItem("auth_user");
             if (stored) {
                 const authUser = JSON.parse(stored);
                 if (authUser.userName === username) {
                     currentUserId = authUser.id || authUser._id;
                     setTargetUserId(currentUserId);
                     setProfileName(authUser.fullName);
                 }
             }
        }
        
        if (!currentUserId) {
            // Fallback: If we really can't find ID, we can't fetch follows.
            // Maybe redirect to profile?
            // For now, just stop loading.
            setLoading(false);
            return;
        }

        // Fetch profile details if name is not available (only if we didn't just set it from authUser)
        if (!location.state?.fullName && profileName === username) {
             try {
                 const userProfile = await getProfileById(currentUserId);
                 if (userProfile && userProfile.fullName) {
                     setProfileName(userProfile.fullName);
                 }
             } catch (err) {
                 console.error("Failed to fetch profile details:", err);
             }
        }

        const data = activeTab === "followers" 
          ? await getFollowers(currentUserId) 
          : await getFollowing(currentUserId);

        // Fetch my own relationships to determine buttons/tags
        let myFollowing: any[] = [];
        let myFollowers: any[] = [];
        const storedAuth = localStorage.getItem("auth_user") || sessionStorage.getItem("auth_user");
        if (storedAuth) {
            const authUser = JSON.parse(storedAuth);
            const myId = authUser.id || authUser._id;
            try {
                // Parallel fetch for efficiency
                const [followingRes, followersRes] = await Promise.all([
                    getFollowing(myId),
                    getFollowers(myId)
                ]);
                myFollowing = followingRes;
                myFollowers = followersRes;
            } catch (e) {
                console.error("Failed to fetch my relationships", e);
            }
        }

        const myFollowingSet = new Set(myFollowing.map((u: any) => u._id));
        setMyFollowingIds(myFollowingSet);
        const myFollowersSet = new Set(myFollowers.map((u: any) => u._id));

        // Map backend data to frontend FollowUser
        const mappedUsers: FollowUser[] = (data as any[]).map((u: any) => ({
          id: u._id,
          username: u.userName,
          displayName: u.fullName || u.userName,
          avatar: u.avatar,
          isVerified: false, 
          // Tag: "Follows you" / "Not following you" -> Check if they follow ME
          isFollowingBack: myFollowersSet.has(u._id)
        }));

        setUsers(mappedUsers);
      } catch (error) {
        console.error("Failed to fetch follow list:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeTab, targetUserId, username]);

  const handleFollowToggle = async (userId: string, newState: boolean) => {
    // If I follow/unfollow, I should update my local set of following IDs
    setMyFollowingIds(prev => {
        const next = new Set(prev);
        if (newState) next.add(userId);
        else next.delete(userId);
        return next;
    });
    
    try {
        if (newState) {
            await followUser(userId);
        } else {
            await unfollowUser(userId);
        }
    } catch (error) {
        console.error("Failed to toggle follow:", error);
        // Revert set on failure
        setMyFollowingIds(prev => {
            const next = new Set(prev);
            if (!newState) next.add(userId);
            else next.delete(userId);
            return next;
        });
    }
  };

  const handleTabChange = (tab: "followers" | "following") => {
    setActiveTab(tab);
    navigate(`/profile/${username}/${tab}`, { state: { userId: targetUserId } });
  };
  
  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm border-b border-gray-200">
          <div className="flex items-center p-4">
            <Link 
              to={`/profile/${username}`}
              className="mr-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Link>
            <div>
              <h1 className="text-xl font-bold text-gray-900">{profileName}</h1>
              <p className="text-gray-500 text-sm">@{username}</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => handleTabChange("followers")}
              className={`flex-1 py-4 text-center font-medium transition-colors relative ${
                activeTab === "followers" 
                  ? "text-gray-900" 
                  : "text-gray-500 hover:bg-gray-50"
              }`}
            >
              Followers
              {activeTab === "followers" && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-500 rounded-full"></div>
              )}
            </button>
            
            <button
              onClick={() => handleTabChange("following")}
              className={`flex-1 py-4 text-center font-medium transition-colors relative ${
                activeTab === "following" 
                  ? "text-gray-900" 
                  : "text-gray-500 hover:bg-gray-50"
              }`}
            >
              Following
              {activeTab === "following" && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-500 rounded-full"></div>
              )}
            </button>
          </div>
        </div>

        {/* Users List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mt-4">
          {loading ? (
            <div className="py-12 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-4 text-gray-500">Loading {activeTab}...</p>
            </div>
          ) : users.length > 0 ? (
            users.map((user) => (
              <UserCard
                key={user.id}
                user={user}
                onFollowToggle={handleFollowToggle}
                showFollowButton={true}
                // Button state: Am I following them?
                initialIsFollowing={myFollowingIds.has(user.id)}
              />
            ))
          ) : (
            <div className="py-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No {activeTab} yet
              </h3>
              <p className="text-gray-500 max-w-sm mx-auto">
                {activeTab === "followers" 
                  ? "When someone follows this account, they'll appear here." 
                  : "When this account follows someone, they'll appear here."
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default FollowListPage;