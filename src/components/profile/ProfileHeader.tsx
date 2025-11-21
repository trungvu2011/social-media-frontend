import React from 'react';
import type { Profile } from '../../types/social';

interface ProfileHeaderProps {
  profile: Profile;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ profile }) => {
  const formatNumber = (num: number): string => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Cover Photo */}
      <div className="h-48 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-t-xl"></div>
      
      {/* Profile Info */}
      <div className="px-8 pb-6">
        {/* Avatar and Basic Info */}
        <div className="flex items-end justify-between -mt-20 mb-6">
          <div className="flex items-end space-x-6">
            {/* Avatar */}
            <div className="w-40 h-40 bg-gradient-to-br from-gray-700 to-gray-900 rounded-full border-4 border-white shadow-lg"></div>
            
            {/* User Info */}
            <div className="pb-6">
              <div className="flex items-center space-x-3 mb-2">
                <h1 className="text-3xl font-bold text-gray-900">{profile.user.displayName}</h1>
                {profile.user.isVerified && (
                  <div className="bg-blue-500 rounded-full p-1">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
              <p className="text-gray-600 text-lg mb-2">@{profile.user.username}</p>
              <p className="text-gray-500 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                {profile.location}
              </p>
            </div>
          </div>
          
          {/* Edit Profile Button */}
          <button className="bg-white hover:bg-gray-50 text-gray-900 border border-gray-300 px-6 py-2.5 rounded-lg font-medium shadow-sm hover:shadow-md transition-all mb-6">
            Edit Profile
          </button>
        </div>

        {/* Stats */}
        <div className="flex space-x-12 border-t border-gray-100 pt-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{formatNumber(profile.stats.posts)}</div>
            <div className="text-sm text-gray-500 font-medium">Posts</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{formatNumber(profile.stats.followers)}</div>
            <div className="text-sm text-gray-500 font-medium">Followers</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{profile.stats.following}</div>
            <div className="text-sm text-gray-500 font-medium">Following</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;