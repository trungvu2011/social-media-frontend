import React, { useState, useMemo } from "react";
import type { Post as PostType } from "../../types/social";
import Post from "../feed/Post";
import { useTranslation } from "react-i18next";

interface ProfilePostsProps {
  posts: PostType[];
  username: string;
}

type FilterType = "all" | "photos" | "videos";

const ProfilePosts: React.FC<ProfilePostsProps> = ({ posts, username }) => {
  const { t } = useTranslation();
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");

  const filteredPosts = useMemo(() => {
    if (activeFilter === "all") {
      return posts;
    } else if (activeFilter === "photos") {
      return posts.filter(post => post.images && post.images.length > 0);
    } else if (activeFilter === "videos") {

      return posts.filter(post => 
        post.content.toLowerCase().includes("youtube") || 
        post.content.toLowerCase().includes("video") ||
        (post.images && post.images.some(img => img.includes("video")))
      );
    }
    return posts;
  }, [posts, activeFilter]);

  const getFilterButtonClass = (filter: FilterType) => {
    const baseClass = "px-4 py-2 text-sm font-medium rounded-md transition-colors";
    return activeFilter === filter
      ? `${baseClass} bg-blue-500 text-white shadow-sm`
      : `${baseClass} text-gray-500 hover:text-gray-700 hover:bg-gray-100`;
  };

  return (
    <div className="space-y-6">
      {/* Posts Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-2xl font-bold text-gray-900">{t("Profile.Stats.Posts")}</h2>
          <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setActiveFilter("all")}
              className={getFilterButtonClass("all")}
            >
              {t("Profile.Filter.All")}
            </button>
            <button
              onClick={() => setActiveFilter("photos")}
              className={getFilterButtonClass("photos")}
            >
              {t("Profile.Filter.Photos")}
            </button>
            <button
              onClick={() => setActiveFilter("videos")}
              className={getFilterButtonClass("videos")}
            >
              {t("Profile.Filter.Videos")}
            </button>
          </div>
        </div>
        
        {/* Filter info */}
        <div className="text-sm text-gray-500 mt-2">
          {activeFilter === "all" && t("Profile.Filter.ShowingAll", { count: posts.length })}
          {activeFilter === "photos" && t("Profile.Filter.ShowingPhotos", { count: filteredPosts.length })}
          {activeFilter === "videos" && t("Profile.Filter.ShowingVideos", { count: filteredPosts.length })}
        </div>
      </div>

      {/* Posts Content */}
      {filteredPosts.length > 0 ? (
        <div className="space-y-4">
          {filteredPosts.map((post) => (
            <Post key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            {activeFilter === "all" ? (
              <svg
                className="w-10 h-10 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            ) : activeFilter === "photos" ? (
              <svg
                className="w-10 h-10 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            ) : (
              <svg
                className="w-10 h-10 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
            )}
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {activeFilter === "all" 
              ? t("Profile.Empty.UserNoPosts", { username })
              : t("Profile.Empty." + (activeFilter === "photos" ? "Photos" : "Videos"))
            }
          </h3>
          <p className="text-gray-500 max-w-sm mx-auto">
            {activeFilter === "all" 
              ? t("Profile.Empty.UserNoPostsDesc")
              : t("Profile.Empty.TryAll")
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default ProfilePosts;