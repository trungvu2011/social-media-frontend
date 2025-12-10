import { Bell, MessageCircle, Settings, Plus, ArrowRight, Gift, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAllPosts, getFollowing, followUser, type BackendAuthor } from "../../utils";

interface SuggestionUser {
  id: string;
  userName: string;
  fullName: string;
  avatar?: string;
}

const RightSidebar = () => {
  const [suggestions, setSuggestions] = useState<SuggestionUser[]>([]);
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [loading, setLoading] = useState(true);

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
    const fetchSuggestions = async () => {
      if (!authUser?.id) return;
      
      try {
        setLoading(true);
        // Get posts to find users
        const postsRes = await getAllPosts({ limit: 50 });
        
        // Get who current user follows
        let followingIds: Set<string> = new Set();
        try {
          const following = await getFollowing(authUser.id);
          followingIds = new Set(following.map(f => f.followingId._id));
          setFollowingCount(following.length);
        } catch {
          // API might return error if no following
        }

        // Filter unique authors not followed by current user
        const authorMap = new Map<string, BackendAuthor>();
        postsRes.data.forEach(post => {
          const author = post.authorId;
          if (author && author._id !== authUser.id && !followingIds.has(author._id)) {
            authorMap.set(author._id, author);
          }
        });

        const suggestionsData: SuggestionUser[] = Array.from(authorMap.values())
          .slice(0, 5)
          .map(a => ({
            id: a._id,
            userName: a.userName,
            fullName: a.fullName || a.userName,
            avatar: a.avatar,
          }));

        setSuggestions(suggestionsData);
      } catch (err) {
        console.error("Failed to load suggestions:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSuggestions();
  }, [authUser?.id]);

  const handleFollow = async (userId: string) => {
    try {
      await followUser(userId);
      setSuggestions(prev => prev.filter(s => s.id !== userId));
    } catch (err) {
      console.error("Failed to follow:", err);
    }
  };

  const getAvatarGradient = (id: string) => {
    const gradients = [
      "from-pink-400 to-rose-500",
      "from-indigo-400 to-purple-500",
      "from-blue-400 to-cyan-500",
      "from-green-400 to-teal-500",
      "from-orange-400 to-red-500",
      "from-yellow-400 to-amber-500",
    ];
    const index = id.charCodeAt(0) % gradients.length;
    return gradients[index];
  };

  return (
    <div className="w-[300px] bg-white border-l border-gray-200 h-screen overflow-y-auto">
      {/* Top Icons */}
      <div className="h-14 border-b border-gray-200 flex items-center justify-end gap-2 px-4">
        <button className="p-2 hover:bg-gray-100 rounded-full border border-gray-200 transition-colors">
          <MessageCircle className="w-5 h-5 text-gray-600" />
        </button>
        <button className="p-2 hover:bg-gray-100 rounded-full border border-gray-200 transition-colors">
          <Bell className="w-5 h-5 text-gray-600" />
        </button>
        <button className="p-2 hover:bg-gray-100 rounded-full border border-gray-200 transition-colors">
          <Settings className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Friend Suggestions */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">Friend Suggestions</h3>
          <button className="flex items-center gap-1 text-indigo-600 hover:text-indigo-700 text-sm font-medium">
            See All
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {loading ? (
          <div className="text-center text-gray-500 text-sm py-4">Loading...</div>
        ) : suggestions.length === 0 ? (
          <div className="text-center text-gray-500 text-sm py-4">No suggestions</div>
        ) : (
          <div className="space-y-3">
            {suggestions.map((user) => (
              <div key={user.id} className="flex items-center gap-3">
                <Link
                  to={`/profile/${user.userName}`}
                  className={`w-10 h-10 rounded-full bg-gradient-to-br ${getAvatarGradient(user.id)} flex-shrink-0 overflow-hidden hover:opacity-80 transition-opacity`}
                >
                  {user.avatar && (
                    <img src={user.avatar} alt="" className="w-full h-full object-cover" />
                  )}
                </Link>
                <Link to={`/profile/${user.userName}`} className="flex-1 min-w-0 hover:opacity-80 transition-opacity">
                  <div className="font-medium text-sm text-gray-900 truncate">
                    {user.fullName}
                  </div>
                  <div className="text-xs text-gray-500 truncate">
                    @{user.userName}
                  </div>
                </Link>
                <button
                  onClick={() => handleFollow(user.id)}
                  className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Plus className="w-5 h-5 text-gray-400 hover:text-indigo-600" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Profile Activity */}
      <div className="p-4 border-b border-gray-200">
        <h3 className="font-semibold text-gray-900 mb-4">Profile Activity</h3>
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <TrendingUp className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-indigo-600">+{followerCount}</div>
              <div className="text-xs text-gray-500">Followers</div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span className="text-green-500 font-medium">↑ 23%</span>
            <span>vs last month • {followingCount} following</span>
          </div>
        </div>
      </div>

      {/* Upcoming Events */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-4">Upcoming Events</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
            <div className="p-2 bg-pink-100 rounded-lg">
              <Gift className="w-5 h-5 text-pink-500" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-900">Friend's Birthday</div>
              <div className="text-xs text-gray-500">Jun 25, 2024</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RightSidebar;
