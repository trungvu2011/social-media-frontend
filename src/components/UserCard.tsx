import React, { useState } from "react";
import type { FollowUser } from "../types/social";
import { Link } from "react-router-dom";

interface UserCardProps {
  user: FollowUser;
  onFollowToggle?: (userId: string, newState: boolean) => void;
  showFollowButton?: boolean;
  initialIsFollowing?: boolean;
}

const UserCard: React.FC<UserCardProps> = ({ 
  user, 
  onFollowToggle,
  showFollowButton = true,
  initialIsFollowing = false 
}) => {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [isHovering, setIsHovering] = useState(false);

  const handleFollowToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const newFollowState = !isFollowing;
    setIsFollowing(newFollowState);
    
    if (onFollowToggle) {
      onFollowToggle(user.id, newFollowState);
    }
    
    console.log(`${newFollowState ? 'Following' : 'Unfollowing'} user: ${user.username}`);
  };

  const getFollowButtonText = () => {
    if (isFollowing) {
      return isHovering ? "Unfollow" : "Following";
    }
    return "Follow";
  };

  const getFollowButtonClass = () => {
    if (isFollowing) {
      return isHovering 
        ? "bg-transparent hover:bg-red-50 text-red-500 border border-red-200"
        : "bg-black hover:bg-gray-800 text-white border border-gray-800";
    }
    
    return "bg-black hover:bg-gray-800 text-white border border-gray-800";
  };

  return (
    <Link 
      to={`/profile/${user.username}`}
      className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors border-b border-gray-200"
    >
      <div className="flex items-start space-x-3 flex-1">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 border border-gray-200">
            <img 
              src={user.avatar || "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"} 
              alt={user.username} 
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* User Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1">
            <span className="font-bold text-gray-900 truncate">{user.displayName}</span>
            {user.isVerified && (
              <svg className="w-4 h-4 text-blue-500 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.9-.81-3.91s-2.52-1.27-3.91-.81c-.66-1.31-1.91-2.19-3.34-2.19s-2.67.88-3.34 2.19c-1.39-.46-2.9-.2-3.91.81s-1.27 2.52-.81 3.91c-1.31.66-2.19 1.91-2.19 3.34s.88 2.67 2.19 3.34c-.46 1.39-.2 2.9.81 3.91s2.52 1.27 3.91.81c.66 1.31 1.91 2.19 3.34 2.19s2.67-.88 3.34-2.19c1.39.46 2.9.2 3.91-.81s1.27-2.52.81-3.91c1.31-.66 2.19-1.91 2.19-3.34zm-11.71 4.2L6.8 12.46l1.41-1.42 2.26 2.26 4.8-5.14 1.47 1.36-6.2 6.78z"/>
              </svg>
            )}
          </div>
          <div className="text-gray-500 text-sm truncate">@{user.username}</div>
          
          {user.bio && (
            <div className="mt-1 text-gray-700 text-sm line-clamp-2">
              {user.bio}
            </div>
          )}
          
          {user.isFollowingBack !== undefined && (
            <div className="mt-2">
              {user.isFollowingBack ? (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Follows you
                </span>
              ) : (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  Not following you
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Follow Button */}
      {showFollowButton && (
        <button
          onClick={handleFollowToggle}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          className={`
            px-4 py-1.5 text-sm font-semibold rounded-full transition-colors flex-shrink-0
            ${getFollowButtonClass()}
          `}
        >
          {getFollowButtonText()}
        </button>
      )}
    </Link>
  );
};

export default UserCard;