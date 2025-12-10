import React, { useState } from "react";
import type { Profile } from "../../types/social";
import { Link } from "react-router-dom";

interface ProfileHeaderProps {
  profile: Profile;
  isCurrentUser?: boolean;
  onFollowToggle?: () => void;
  initialIsFollowing?: boolean;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ 
  profile, 
  isCurrentUser = false,
  onFollowToggle,
  initialIsFollowing = false 
}) => {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [isHovering, setIsHovering] = useState(false);

  const formatNumber = (num: number): string => {
    if (num >= 10000) {
      return (num / 1000).toFixed(0) + "K";
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toString();
  };

  const handleFollowToggle = () => {
    if (!isCurrentUser) {
      const newFollowState = !isFollowing;
      setIsFollowing(newFollowState);
      
      if (onFollowToggle) {
        onFollowToggle();
      }
      
      console.log(`${newFollowState ? 'Following' : 'Unfollowing'} user: ${profile.user.username}`);
    }
  };

  const getFollowButtonText = () => {
    if (isFollowing) {
      return isHovering ? "Unfollow" : "Following";
    }
    return "Follow";
  };

  const getFollowButtonClass = () => {
    if (isCurrentUser) {
      return "bg-white hover:bg-gray-50 text-gray-900 border border-gray-300";
    }
    
    if (isFollowing) {
      return isHovering 
        ? "bg-red-50 hover:bg-red-100 text-red-600 border border-red-200"
        : "bg-blue-500 hover:bg-blue-600 text-white border border-blue-500";
    }
    
    return "bg-blue-500 hover:bg-blue-600 text-white border border-blue-500";
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Cover Photo */}
      <div className="h-48 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>

      {/* Profile Info */}
      <div className="px-8 pb-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between -mt-20 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-end gap-6">
            {/* Avatar */}
            <div className="w-40 h-40 bg-gradient-to-br from-gray-700 to-gray-900 rounded-full border-4 border-white shadow-lg"></div>

            {/* User Info */}
            <div className="pb-6">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  {profile.user.displayName}
                </h1>
                {profile.user.isVerified && (
                  <div className="bg-blue-500 rounded-full p-1">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}
              </div>
              <p className="text-gray-600 text-lg mb-1">
                @{profile.user.username}
              </p>
              <p className="text-gray-500 flex items-center">
                <svg
                  className="w-4 h-4 mr-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                    clipRule="evenodd"
                  />
                </svg>
                {profile.location}
              </p>
            </div>
          </div>

          {/* Button */}
          <button
            onClick={isCurrentUser ? undefined : handleFollowToggle}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            className={`
              px-6 py-2.5 rounded-lg font-medium shadow-sm hover:shadow-md transition-all 
              mb-6 self-start sm:self-end
              ${getFollowButtonClass()}
              ${isCurrentUser ? 'cursor-default' : 'cursor-pointer'}
            `}
          >
            {isCurrentUser ? "Edit Profile" : getFollowButtonText()}
          </button>
        </div>

        {/* Stats */}
        <div className="flex justify-around sm:justify-start sm:gap-12 border-t border-gray-100 pt-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">
              {formatNumber(profile.stats.posts)}
            </div>
            <div className="text-sm text-gray-500 font-medium">Posts</div>
          </div>
          
          <Link 
            to={`/profile/${profile.user.username}/followers`}
            className="text-center hover:underline"
          >
            <div className="text-2xl font-bold text-gray-900 hover:text-blue-600">
              {formatNumber(profile.stats.followers)}
            </div>
            <div className="text-sm text-gray-500 font-medium">Followers</div>
          </Link>
          
          <Link 
            to={`/profile/${profile.user.username}/following`}
            className="text-center hover:underline"
          >
            <div className="text-2xl font-bold text-gray-900 hover:text-blue-600">
              {profile.stats.following}
            </div>
            <div className="text-sm text-gray-500 font-medium">Following</div>
          </Link>
        </div>

      </div>
    </div>
  );
};

export default ProfileHeader;