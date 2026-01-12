import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { getFriendSuggestions, followUser, type UserProfile } from "../../utils";
import { useTranslation } from "react-i18next";

const FriendSuggestions = () => {
  const { t } = useTranslation();
  const [suggestions, setSuggestions] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const res = await getFriendSuggestions();
        if (res.success) {
          setSuggestions(res.data);
        }
      } catch (error) {
        console.error("Failed to fetch suggestions", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSuggestions();
  }, []);

  const handleFollow = async (userId: string) => {
    try {
      await followUser(userId);
      // Remove from suggestions list when followed
      setSuggestions(prev => prev.filter(u => u._id !== userId));
    } catch (error) {
      console.error("Failed to follow user", error);
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

  if (suggestions.length === 0 && !loading) return null;

  return (
    <div className="p-4 border-b border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">{t("Feed.FriendSuggestions")}</h3>
        {/* <button className="flex items-center gap-1 text-indigo-600 hover:text-indigo-700 text-sm font-medium">
          {t("Feed.SeeAll")}
          <ArrowRight className="w-4 h-4" />
        </button> */}
      </div>

      {loading ? (
        <div className="text-center text-gray-500 text-sm py-4">{t("Feed.LoadingSuggestions")}</div>
      ) : (
        <div className="space-y-3">
          {suggestions.map((user) => (
            <div key={user._id} className="flex items-center gap-3">
              <Link
                to={`/profile/${user.userName}`}
                className={`w-10 h-10 rounded-full bg-gradient-to-br ${getAvatarGradient(user._id)} flex-shrink-0 overflow-hidden hover:opacity-80 transition-opacity`}
              >
                <img src={user.avatar || "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"} alt="" className="w-full h-full object-cover" />
              </Link>
              <Link to={`/profile/${user.userName}`} className="flex-1 min-w-0 hover:opacity-80 transition-opacity">
                <div className="font-medium text-sm text-gray-900 truncate">
                  {user.fullName || user.userName}
                </div>
                <div className="text-xs text-gray-500 truncate">
                  @{user.userName}
                </div>
              </Link>
              <button
                onClick={() => handleFollow(user._id)}
                className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                title={t("Follow")}
              >
                <Plus className="w-5 h-5 text-gray-400 hover:text-indigo-600" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FriendSuggestions;
