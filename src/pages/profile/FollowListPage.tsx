import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Layout from "../../components/layout/Layout";
import UserCard from "../../components/UserCard";
import { mockFollowers, mockFollowing, mockFriendSuggestions, mockEvents } from "../../data/mockData";
import type { FollowUser } from "../../types/social";

const FollowListPage: React.FC = () => {
  const { username, type } = useParams<{ username: string; type: "followers" | "following" }>();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState<"followers" | "following">(type || "followers");
  const [users, setUsers] = useState<FollowUser[]>([]);
  const [loading, setLoading] = useState(true);
  
  const mockProfile = {
    username: username || "xtheobliterator",
    displayName: "X AE C-921",
    stats: {
      followers: mockFollowers.length,
      following: mockFollowing.length,
    }
  };

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setUsers(activeTab === "followers" ? mockFollowers : mockFollowing);
      setLoading(false);
    }, 300);
  }, [activeTab]);

  const handleFollowToggle = (userId: string, newState: boolean) => {
    setUsers(prevUsers => 
      prevUsers.map(user => 
        user.id === userId 
          ? { ...user, isFollowingBack: newState } 
          : user
      )
    );
    console.log(`Follow toggle: ${userId} -> ${newState}`);
  };

  const handleTabChange = (tab: "followers" | "following") => {
    setActiveTab(tab);
    navigate(`/profile/${username}/${tab}`);
  };

  return (
    <Layout 
      friendSuggestions={mockFriendSuggestions}
      events={mockEvents}
    >
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
              <h1 className="text-xl font-bold text-gray-900">{mockProfile.displayName}</h1>
              <p className="text-gray-500 text-sm">@{mockProfile.username}</p>
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
              <div className="text-sm text-gray-500 mt-1">
                {mockProfile.stats.followers}
              </div>
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
              <div className="text-sm text-gray-500 mt-1">
                {mockProfile.stats.following}
              </div>
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
                showFollowButton={activeTab === "followers"}
                initialIsFollowing={user.isFollowingBack || false}
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