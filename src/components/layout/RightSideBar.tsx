import { Bell, MessageCircle, Settings, Gift, TrendingUp } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getFollowing, getFollowers, type FollowUser } from "../../utils";
import FriendSuggestions from "../feed/FriendSuggestions";

const RightSidebar = () => {
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [upcomingBirthdays, setUpcomingBirthdays] = useState<FollowUser[]>([]);

  const navigate = useNavigate();

  const goToChat = () => {
    navigate(`/chat`);
  };

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
    const fetchStats = async () => {
      if (!authUser?.id) return;

      try {
        const [followers, following] = await Promise.all([
          getFollowers(authUser.id),
          getFollowing(authUser.id),
        ]);

        setFollowerCount(followers.length);
        setFollowingCount(following.length);

        // Filter upcoming birthdays (next 30 days)
        const today = new Date();
        const next30Days = new Date();
        next30Days.setDate(today.getDate() + 30);

        const birthdays = following.filter((user) => {
          if (!user.birthday) return false;
          const birthDate = new Date(user.birthday);
          const birthdayThisYear = new Date(
            today.getFullYear(),
            birthDate.getMonth(),
            birthDate.getDate()
          );

          // If birthday has passed this year, check next year (though usually "upcoming" means soon)
          // For simplicity, we'll check if it falls within the next 30 days range

          // Handle end of year wrap-around logic if needed, but simple comparison for now:
          // Check if birthdayThisYear is between today and next30Days
          return birthdayThisYear >= today && birthdayThisYear <= next30Days;
        });

        setUpcomingBirthdays(birthdays.slice(0, 3)); // Limit to 3
      } catch (err) {
        console.error("Failed to load right sidebar data:", err);
      }
    };

    fetchStats();
  }, [authUser?.id]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  return (
    <div className="w-[300px] bg-white border-l border-gray-200 h-screen overflow-y-auto">
      {/* Top Icons */}
      <div className="h-14 border-b border-gray-200 flex items-center justify-end gap-2 px-4">
        <button
          onClick={goToChat}
          className="p-2 hover:bg-gray-100 rounded-full border border-gray-200 transition-colors"
        >
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
      <FriendSuggestions />

      {/* Profile Activity */}
      <div className="p-4 border-b border-gray-200">
        <h3 className="font-semibold text-gray-900 mb-4">Profile Activity</h3>
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4">
          {/* Followers */}
          <Link
            to={`/profile/${authUser?.userName}/followers`}
            className="flex items-center gap-3 mb-3 cursor-pointer hover:opacity-80 transition-opacity"
          >
            <div className="p-2 bg-indigo-100 rounded-lg">
              <TrendingUp className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-indigo-600">
                {followerCount}
              </div>
              <div className="text-xs text-gray-500">Followers</div>
            </div>
          </Link>

          {/* Following */}
          <Link
            to={`/profile/${authUser?.userName}/following`}
            className="flex items-center gap-2 text-xs text-gray-500 cursor-pointer hover:text-indigo-600 transition-colors"
          >
            <div className="font-medium">{followingCount} Following</div>
          </Link>
        </div>
      </div>

      {/* Upcoming Events */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-4">Upcoming Birthdays</h3>
        <div className="space-y-3">
          {upcomingBirthdays.length > 0 ? (
            upcomingBirthdays.map((user) => (
              <div
                key={user._id}
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl"
              >
                <div className="p-2 bg-pink-100 rounded-lg">
                  <Gift className="w-5 h-5 text-pink-500" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900">
                    {user.fullName || user.userName}
                  </div>
                  <div className="text-xs text-gray-500">
                    {formatDate(user.birthday)}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-400 text-sm py-2">
              No upcoming birthdays
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RightSidebar;
