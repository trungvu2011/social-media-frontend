import {
  Bell,
  MessageCircle,
  Settings,
  Gift,
  TrendingUp,
  Search,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  getFollowing,
  getFollowers,
  type FollowUser,
  type BackendPostListItem,
  type UserProfile,
} from "../../utils";
import FriendSuggestions from "../feed/FriendSuggestions";

type RightSidebarProps = {
  searchFilter: "people" | "post";
  onFilterChange: (filter: "people" | "post") => void;
  searchTerm: string;
  onSearchTermChange: (value: string) => void;
  onSearchSubmit: () => void;
  searchLoading: boolean;
  searchError: string | null;
  peopleResults: UserProfile[];
  postResults: BackendPostListItem[];
  hasSubmittedSearch: boolean;
  onClearSearch: () => void;
};

const RightSidebar = ({
  searchFilter,
  onFilterChange,
  searchTerm,
  onSearchTermChange,
  onSearchSubmit,
  searchLoading,
  searchError,
  peopleResults,
  postResults,
  hasSubmittedSearch,
  onClearSearch,
}: RightSidebarProps) => {
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

  const showSearchResults = hasSubmittedSearch && searchTerm.trim().length > 0;

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onSearchSubmit();
    }
  };

  const renderPeopleResults = () => {
    if (!peopleResults.length) {
      return (
        <div className="text-sm text-gray-500">
          No people found for this keyword.
        </div>
      );
    }

    return peopleResults.map((user) => (
      <div
        key={user._id}
        className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl"
      >
        <div className="w-10 h-10 rounded-full overflow-hidden bg-indigo-100 flex items-center justify-center text-indigo-700 font-semibold">
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={user.fullName || user.userName}
              className="w-full h-full object-cover"
            />
          ) : (
            (user.fullName || user.userName || "").slice(0, 1).toUpperCase()
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold text-gray-900 truncate">
            {user.fullName || user.userName}
          </div>
          <div className="text-xs text-gray-500 truncate">@{user.userName}</div>
        </div>
        <Link
          to={`/profile/${user.userName}`}
          className="text-indigo-600 text-sm font-semibold hover:text-indigo-700"
        >
          View
        </Link>
      </div>
    ));
  };

  const renderPostResults = () => {
    if (!postResults.length) {
      return (
        <div className="text-sm text-gray-500">
          No posts found for this keyword.
        </div>
      );
    }

    return postResults.map((post) => {
      const previewText = (post.text ?? post.content ?? "").toString();
      const authorName =
        post.authorId?.fullName || post.authorId?.userName || "Unknown";

      return (
        <Link
          key={post._id}
          to={`/post/${post._id}`}
          className="block p-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors"
        >
          <div className="text-xs text-gray-500 mb-1">{authorName}</div>
          <div className="text-sm font-medium text-gray-900 line-clamp-2 mb-2">
            {previewText || "(No content)"}
          </div>
          {post.images?.length ? (
            <div className="w-full h-32 overflow-hidden rounded-lg">
              <img
                src={post.images[0]}
                alt={previewText.slice(0, 40)}
                className="w-full h-full object-cover"
              />
            </div>
          ) : null}
        </Link>
      );
    });
  };

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

      {showSearchResults ? (
        <div className="h-[calc(100%-56px)] overflow-y-auto">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <div className="min-w-0">
              <div className="text-[11px] uppercase text-gray-400 font-semibold tracking-wide">
                Search results
              </div>
              <div className="text-sm font-semibold text-gray-900 truncate">
                "{searchTerm}"
              </div>
            </div>
            <button
              onClick={onClearSearch}
              className="text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-100 px-3 py-1.5 rounded-lg"
            >
              Clear
            </button>
          </div>

          <div className="px-4 pt-3 pb-2 flex gap-2">
            <button
              onClick={() => onFilterChange("people")}
              className={`flex-1 px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                searchFilter === "people"
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              People
            </button>
            <button
              onClick={() => onFilterChange("post")}
              className={`flex-1 px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                searchFilter === "post"
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Posts
            </button>
          </div>

          <div className="px-4 pb-6 space-y-3">
            {searchLoading ? (
              <div className="text-sm text-gray-500">Searching...</div>
            ) : searchError ? (
              <div className="bg-red-50 text-red-700 text-sm rounded-lg p-3">
                {searchError}
              </div>
            ) : searchFilter === "people" ? (
              renderPeopleResults()
            ) : (
              renderPostResults()
            )}
          </div>
        </div>
      ) : (
        <>
          {/* Search */}
          <div className="p-4 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search people or posts..."
                value={searchTerm}
                onChange={(e) => onSearchTermChange(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Friend Suggestions */}
          <FriendSuggestions />

          {/* Profile Activity */}
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-4">
              Profile Activity
            </h3>
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
            <h3 className="font-semibold text-gray-900 mb-4">
              Upcoming Birthdays
            </h3>
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
        </>
      )}
    </div>
  );
};

export default RightSidebar;
