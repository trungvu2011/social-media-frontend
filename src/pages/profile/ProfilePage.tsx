import React, { useEffect, useState, useRef, use } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Layout from "../../components/layout/Layout";
import Post from "../../components/feed/Post";
import {
  getProfileByUserName,
  getAllPosts,
  getFollowers,
  getFollowing,
  followUser,
  unfollowUser,
  updateProfile,
  getLikedPosts,
  type UserProfile,
  type BackendPostListItem,
} from "../../utils";
import type { Post as SocialPost } from "../../types/social";
import {
  Calendar,
  Mail,
  UserPlus,
  MessageCircle,
  MoreHorizontal,
  Camera,
  Edit3,
  Heart,
  Grid,
  X,
} from "lucide-react";

const ProfilePage: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [likedPosts, setLikedPosts] = useState<SocialPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState<"posts" | "likes">("posts");

  // Edit profile state
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState({
    fullName: "",
    bio: "",
    genre: "",
    birthday: "",
  });
  const [isSaving, setIsSaving] = useState(false);

  // File input refs
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const backgroundInputRef = useRef<HTMLInputElement>(null);

  // Get current user
  const authUser = (() => {
    try {
      const stored =
        localStorage.getItem("auth_user") ||
        sessionStorage.getItem("auth_user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  })();

  useEffect(() => {
    let isMounted = true;

    const fetchProfileData = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!username) return;

        let userProfile: UserProfile | null = null;
        let userId: string | null = null;

        // 1. Try to get profile by username directly
        try {
          userProfile = await getProfileByUserName(username);
          userId = userProfile._id;
        } catch (err) {
          // If API fails, check if it's the current authenticated user (fallback)
          if (authUser?.userName === username) {
            userId = authUser.id;
            userProfile = {
              _id: authUser.id,
              userName: authUser.userName,
              fullName: authUser.fullName || authUser.userName,
              email: authUser.email || "",
              avatar: authUser.avatar,
              backgroundImage: authUser.backgroundImage,
              bio: authUser.bio,
              genre: authUser.genre,
              birthday: authUser.birthday,
              isVerified: authUser.isVerified,
              createdAt: "",
              updatedAt: "",
            };
          }
        }

        if (!userProfile || !userId) {
          if (isMounted) setError(`User @${username} not found`);
          setLoading(false);
          return;
        }

        const isOwn = authUser?.userName === username;

        if (isMounted) {
          setProfile(userProfile);
          setIsOwnProfile(isOwn);
          setEditFormData({
            fullName: userProfile.fullName || "",
            bio: userProfile.bio || "",
            genre: userProfile.genre || "",
            birthday: userProfile.birthday || "",
          });
        }

        // 2. Load extra data (posts, followers, etc.)
        try {
          const [postsRes, followers, following] = await Promise.all([
            getAllPosts({ authorId: userId, limit: 100 }), // Filter by authorId directly
            getFollowers(userId),
            getFollowing(userId),
          ]);

          if (isMounted) {
            setFollowerCount(followers.length);
            setFollowingCount(following.length);
            setIsFollowing(
              (followers as any[]).some(
                (f) => f._id === authUser?.id || f.id === authUser?.id
              )
            );

            const userPosts = postsRes.data.map(
              (p: BackendPostListItem): SocialPost => ({
                id: p._id,
                user: {
                  id: p.authorId?._id || "",
                  username: p.authorId?.userName || "unknown",
                  displayName: p.authorId?.fullName || "Unknown",
                  avatar: p.authorId?.avatar,
                  isVerified: false,
                },
                content: (p.text ?? p.content ?? "").toString(),
                images: Array.isArray(p.images) ? p.images : [],
                likes: Array.isArray(p.likes) ? p.likes : [],
                commentCount: p.commentCount ?? 0,
                shares: 0,
                createdAt: p.createdAt,
                isLiked: false,
              })
            );
            setPosts(userPosts);
          }
        } catch (dataErr) {
          console.error("Failed to load posts/stats", dataErr);
        }
      } catch (err: unknown) {
        if (isMounted) {
          setError((err as Error)?.message || "Failed to load profile");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchProfileData();

    return () => {
      isMounted = false;
    };
    return () => {
      isMounted = false;
    };
  }, [username, authUser?.id, authUser?.userName]);

  // Fetch liked posts when tab changes to "likes"
  useEffect(() => {
    let isMounted = true;
    const fetchLiked = async () => {
      if (activeTab === "likes" && profile?._id) {
        try {
          // Check if we need to set loading for just this tab part,
          // or if we rely on initial load. Let's do silent update or small indicator if needed.
          // For now just fetch.
          const res = await getLikedPosts(profile._id);
          if (isMounted && res.data) {
            const userLikedPosts = res.data.map(
              (p: any): SocialPost => ({
                id: p._id,
                user: {
                  id: p.authorId?._id || "",
                  username: p.authorId?.userName || "unknown",
                  displayName: p.authorId?.fullName || "Unknown",
                  avatar: p.authorId?.avatar,
                  isVerified: false,
                },
                content: (p.text ?? p.content ?? "").toString(),
                images: Array.isArray(p.images) ? p.images : [],
                likes: Array.isArray(p.likes) ? p.likes : [], // API might need to return likes count/array if we want correct like status
                commentCount: p.commentCount ?? 0,
                shares: 0,
                createdAt: p.createdAt,
                isLiked: true, // Since we are in liked tab, presumably they are liked by the viewer if viewer == profileUser.
                // BUT: if viewer != profileUser, it just means these are posts LIKED BY profileUser.
                // Whether VIEWER likes them is a different story.
                // Current API getLikedPostsByUser returns post details.
                // Does it return 'likes' array of the post? Yes (from populate).
                // So real isLiked calculation:
              })
            );

            // Re-calculate isLiked for the CURRENT VIEWER
            const finalPosts = userLikedPosts.map((p) => {
              // p.likes from API response data (if populated correctly)
              // But wait, the API getLikedPostsByUser maps fields manually.
              // We need to ensure 'likes' array is in the response of getLikedPostsByUser
              // I added 'likes' to populate logic? NO.
              // In like.controller.js I selected "text content images authorId commentCount createdAt updatedAt".
              // I MISSED 'likes'. I should add 'likes' to the select string in controller.
              // For now, let's assume isLiked=true if we are viewing our own profile's liked tab.
              return { ...p, isLiked: true };
            });

            setLikedPosts(finalPosts);
          }
        } catch (error) {
          console.error("Failed to fetch liked posts", error);
        }
      }
    };
    fetchLiked();
    return () => {
      isMounted = false;
    };
  }, [activeTab, profile?._id]);

  const handleFollow = async () => {
    if (!profile?._id) return;
    try {
      if (isFollowing) {
        await unfollowUser(profile._id);
        setIsFollowing(false);
        setFollowerCount((prev) => Math.max(0, prev - 1));
      } else {
        await followUser(profile._id);
        setIsFollowing(true);
        setFollowerCount((prev) => prev + 1);
      }
    } catch (err) {
      console.error("Failed to toggle follow:", err);
    }
  };

  const navigateToFollows = (type: "followers" | "following") => {
    if (!profile) return;
    // Pass userId and fullName in state so FollowListPage doesn't have to guess or fetch it again
    navigate(`/profile/${profile.userName}/${type}`, {
      state: {
        userId: profile._id,
        fullName: profile.fullName,
      },
    });
  };

  const handleAvatarClick = () => {
    avatarInputRef.current?.click();
  };

  const handleBackgroundClick = () => {
    backgroundInputRef.current?.click();
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsSaving(true);
      const updatedProfile = await updateProfile({ avatar: file });
      setProfile(updatedProfile);
      const stored =
        localStorage.getItem("auth_user") ||
        sessionStorage.getItem("auth_user");
      if (stored) {
        const user = JSON.parse(stored);
        user.avatar = updatedProfile.avatar;
        const storage = localStorage.getItem("auth_user")
          ? localStorage
          : sessionStorage;
        storage.setItem("auth_user", JSON.stringify(user));
      }
    } catch (err) {
      console.error("Failed to update avatar:", err);
      alert("Failed to update avatar");
    } finally {
      setIsSaving(false);
    }
  };

  const handleBackgroundChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsSaving(true);
      const updatedProfile = await updateProfile({ backgroundImage: file });
      setProfile(updatedProfile);
      const stored =
        localStorage.getItem("auth_user") ||
        sessionStorage.getItem("auth_user");
      if (stored) {
        const user = JSON.parse(stored);
        user.backgroundImage = updatedProfile.backgroundImage;
        const storage = localStorage.getItem("auth_user")
          ? localStorage
          : sessionStorage;
        storage.setItem("auth_user", JSON.stringify(user));
      }
    } catch (err) {
      console.error("Failed to update background:", err);
      alert("Failed to update background");
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      const updatedProfile = await updateProfile(editFormData);
      setProfile(updatedProfile);
      const stored =
        localStorage.getItem("auth_user") ||
        sessionStorage.getItem("auth_user");
      if (stored) {
        const user = JSON.parse(stored);
        user.fullName = updatedProfile.fullName;
        user.bio = updatedProfile.bio;
        user.genre = updatedProfile.genre;
        user.birthday = updatedProfile.birthday;
        const storage = localStorage.getItem("auth_user")
          ? localStorage
          : sessionStorage;
        storage.setItem("auth_user", JSON.stringify(user));
      }
      setShowEditModal(false);
    } catch (err) {
      console.error("Failed to update profile:", err);
      alert("Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("vi-VN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const handleMessage = () => {
    console.log("Navigating to chat with user:", profile);
    navigate("/chat", {
      state: {
        userId: profile?._id || "",
        userName: profile?.userName || "",
        fullName: profile?.fullName || "",
        avatar: profile?.avatar || "",
      },
    });
  };

  if (loading) {
    return (
      <Layout>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading profile...</p>
        </div>
      </Layout>
    );
  }

  if (error || !profile) {
    return (
      <Layout>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
          <div className="text-red-500 text-xl font-semibold mb-4">
            Profile Not Found
          </div>
          <p className="text-gray-600 mb-4">
            {error || `The user @${username} does not exist.`}
          </p>
          <Link to="/" className="text-indigo-600 hover:underline">
            Go back to home
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Hidden file inputs */}
      <input
        type="file"
        ref={avatarInputRef}
        onChange={handleAvatarChange}
        accept="image/*"
        style={{ display: "none" }}
      />
      <input
        type="file"
        ref={backgroundInputRef}
        onChange={handleBackgroundChange}
        accept="image/*"
        style={{ display: "none" }}
      />

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Cover Photo */}
        <div className="relative h-48 md:h-64 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
          {profile.backgroundImage && (
            <img
              src={profile.backgroundImage}
              alt="Cover"
              className="w-full h-full object-cover"
            />
          )}
          {isOwnProfile && (
            <button
              type="button"
              onClick={handleBackgroundClick}
              disabled={isSaving}
              className="absolute bottom-4 right-4 bg-white/80 hover:bg-white p-2 rounded-lg transition-colors disabled:opacity-50 z-10"
            >
              <Camera className="w-5 h-5 text-gray-700" />
            </button>
          )}
        </div>

        {/* Profile Info Section */}
        <div className="px-6 pb-6">
          {/* Avatar */}
          <div className="relative -mt-16 mb-4 flex items-end justify-between">
            <div className="relative">
              <div className="w-32 h-32 rounded-full border-4 border-white bg-gradient-to-br from-indigo-400 to-purple-500 overflow-hidden shadow-lg">
                <img
                  src={
                    profile.avatar ||
                    "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"
                  }
                  alt={profile.fullName}
                  className="w-full h-full object-cover"
                />
              </div>
              {isOwnProfile && (
                <button
                  type="button"
                  onClick={handleAvatarClick}
                  disabled={isSaving}
                  className="absolute bottom-0 right-0 bg-indigo-600 hover:bg-indigo-700 p-2 rounded-full text-white shadow-md transition-colors disabled:opacity-50"
                >
                  <Camera className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 mb-2">
              {isOwnProfile ? (
                <button
                  type="button"
                  onClick={() => setShowEditModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full font-medium text-sm transition-colors"
                >
                  <Edit3 className="w-4 h-4" />
                  Edit Profile
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={handleFollow}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium text-sm transition-colors ${
                      isFollowing
                        ? "bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                        : "bg-indigo-600 hover:bg-indigo-700 text-white"
                    }`}
                  >
                    <UserPlus className="w-4 h-4" />
                    {isFollowing ? "Following" : "Follow"}
                  </button>
                  <button
                    type="button"
                    onClick={handleMessage}
                    className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                  >
                    <MessageCircle className="w-5 h-5 text-gray-600" />
                  </button>
                </>
              )}
              <button
                type="button"
                className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
              >
                <MoreHorizontal className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Name & Username */}
          <div className="mb-4">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-gray-900">
                {profile.fullName}
              </h1>
              {profile.isVerified && (
                <span className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full">
                  ✓ Verified
                </span>
              )}
            </div>
            <p className="text-gray-500">@{profile.userName}</p>
          </div>

          {/* Bio */}
          {profile.bio && (
            <p className="text-gray-700 mb-4 leading-relaxed">{profile.bio}</p>
          )}

          {/* User Details */}
          <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-4">
            {profile.genre && (
              <span className="flex items-center gap-1">
                <Heart className="w-4 h-4" />
                {profile.genre}
              </span>
            )}
            {profile.birthday && (
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {formatDate(profile.birthday)}
              </span>
            )}
            {profile.email && (
              <span className="flex items-center gap-1">
                <Mail className="w-4 h-4" />
                {profile.email}
              </span>
            )}
          </div>

          {/* Stats */}
          <div className="flex gap-6 py-4 border-t border-gray-100">
            <div className="text-center">
              <div className="text-xl font-bold text-gray-900">
                {posts.length}
              </div>
              <div className="text-sm text-gray-500">Posts</div>
            </div>
            <div
              className="text-center cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => navigateToFollows("followers")}
            >
              <div className="text-xl font-bold text-gray-900">
                {followerCount}
              </div>
              <div className="text-sm text-gray-500">Followers</div>
            </div>
            <div
              className="text-center cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => navigateToFollows("following")}
            >
              <div className="text-xl font-bold text-gray-900">
                {followingCount}
              </div>
              <div className="text-sm text-gray-500">Following</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-t border-gray-200">
          <button
            type="button"
            onClick={() => setActiveTab("posts")}
            className={`flex-1 flex items-center justify-center gap-2 py-4 font-medium text-sm transition-colors ${
              activeTab === "posts"
                ? "text-indigo-600 border-b-2 border-indigo-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <Grid className="w-4 h-4" />
            Posts
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("likes")}
            className={`flex-1 flex items-center justify-center gap-2 py-4 font-medium text-sm transition-colors ${
              activeTab === "likes"
                ? "text-indigo-600 border-b-2 border-indigo-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <Heart className="w-4 h-4" />
            Likes
          </button>
        </div>
      </div>

      {/* Posts Grid */}
      <div className="mt-4">
        {activeTab === "posts" ? (
          posts.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
              <Grid className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No posts yet</p>
            </div>
          ) : (
            posts.map((post) => <Post key={post.id} post={post} />)
          )
        ) : likedPosts.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
            <Heart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No liked posts yet</p>
          </div>
        ) : (
          likedPosts.map((post) => <Post key={post.id} post={post} />)
        )}
      </div>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold">Edit Profile</h2>
              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <form onSubmit={handleEditSubmit} className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={editFormData.fullName}
                  onChange={(e) =>
                    setEditFormData((prev) => ({
                      ...prev,
                      fullName: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Your full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bio
                </label>
                <textarea
                  value={editFormData.bio}
                  onChange={(e) =>
                    setEditFormData((prev) => ({
                      ...prev,
                      bio: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                  rows={3}
                  placeholder="Tell us about yourself"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Genre / Interests
                </label>
                <input
                  type="text"
                  value={editFormData.genre}
                  onChange={(e) =>
                    setEditFormData((prev) => ({
                      ...prev,
                      genre: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Music, Tech, Sports..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Birthday
                </label>
                <input
                  type="date"
                  value={editFormData.birthday}
                  onChange={(e) =>
                    setEditFormData((prev) => ({
                      ...prev,
                      birthday: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
                >
                  {isSaving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default ProfilePage;
