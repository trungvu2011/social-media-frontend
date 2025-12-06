import React, { useState } from "react";
import type { Profile, Story } from "../../types/social";

interface ProfileInfoProps {
  profile: Profile;
  stories: Story[];
}

// Tooltip Component
const Tooltip: React.FC<{ text: string; children: React.ReactNode }> = ({ text, children }) => {
  if (!text) return <>{children}</>;
  
  return (
    <div className="relative group inline-block w-full">
      {children}
      <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block z-10 min-w-max">
        <div className="bg-gray-900 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
          {text}
        </div>
        <div className="absolute top-full left-3 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
      </div>
    </div>
  );
};

const ProfileInfo: React.FC<ProfileInfoProps> = ({ profile, stories }) => {
  const [showFullBio, setShowFullBio] = useState(false);
  const bioPreview =
    profile.bio.slice(0, 120) + (profile.bio.length > 120 ? "..." : "");

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      {/* Bio */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Bio</h2>
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-gray-700 leading-relaxed">
            {showFullBio ? profile.bio : bioPreview}
          </p>
          {profile.bio.length > 120 && (
            <button
              onClick={() => setShowFullBio(!showFullBio)}
              className="text-blue-500 hover:text-blue-600 text-sm font-medium mt-3 flex items-center"
            >
              {showFullBio ? "Show Less" : "Read More"}
              <svg
                className={`w-4 h-4 ml-1 transform ${
                  showFullBio ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Story Highlights */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          My Story Highlights
        </h2>
        <div className="flex space-x-4 overflow-x-auto pb-4">
          {stories.length > 0 ? (
            stories.map((story) => (
              <div
                key={story.id}
                className="flex-shrink-0 text-center hover:opacity-80 transition-opacity"
              >
                <div
                  className={`w-16 h-16 mx-auto rounded-full border-2 ${
                    story.isViewed ? "border-gray-300" : "border-blue-500"
                  } bg-gray-200 mb-2`}
                ></div>
                <p className="text-xs text-gray-600 font-medium truncate w-16">
                  {story.user.displayName}
                </p>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-sm">No stories yet</p>
          )}
        </div>
      </div>

      {/* Contact Information */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Contact Information
        </h2>
        <div className="space-y-4 bg-gray-50 rounded-lg p-4">
          {profile.phone && (
            <div className="flex items-center p-3 bg-white rounded-lg border border-gray-200">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                <svg
                  className="w-5 h-5 text-blue-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs text-gray-500 mb-1">Phone Number</div>
                <Tooltip text={profile.phone}>
                  <div className="font-medium text-gray-900 text-sm break-all">
                    {profile.phone}
                  </div>
                </Tooltip>
              </div>
            </div>
          )}

          {profile.email && (
            <div className="flex items-center p-3 bg-white rounded-lg border border-gray-200">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                <svg
                  className="w-5 h-5 text-green-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs text-gray-500 mb-1">Email Address</div>
                <Tooltip text={profile.email}>
                  <div className="font-medium text-gray-900 text-sm break-all">
                    {profile.email}
                  </div>
                </Tooltip>
              </div>
            </div>
          )}

          {profile.website && (
            <div className="flex items-center p-3 bg-white rounded-lg border border-gray-200">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                <svg
                  className="w-5 h-5 text-purple-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.083 9h1.946c.089-1.546.383-2.97.837-4.118A6.004 6.004 0 004.083 9zM10 2a8 8 0 100 16 8 8 0 000-16zm0 2c-.076 0-.232.032-.465.262-.238.234-.497.623-.737 1.182-.389.907-.673 2.142-.766 3.556h3.936c-.093-1.414-.377-2.649-.766-3.556-.24-.56-.5-.948-.737-1.182C10.232 4.032 10.076 4 10 4zm3.971 5c-.089-1.546-.383-2.97-.837-4.118A6.004 6.004 0 0115.917 9h-1.946zm-2.003 2H8.032c.093 1.414.377 2.649.766 3.556.24.56.5.948.737 1.182.233.23.389.262.465.262.076 0 .232-.032.465-.262.238-.234.498-.623.737-1.182.389-.907.673-2.142.766-3.556zm1.166 4.118c.454-1.147.748-2.572.837-4.118h1.946a6.004 6.004 0 01-2.783 4.118zm-6.268 0C6.412 13.97 6.118 12.546 6.03 11H4.083a6.004 6.004 0 002.783 4.118z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs text-gray-500 mb-1">Website</div>
                <Tooltip text={profile.website}>
                  <a
                    href={`https://${profile.website}`}
                    className="font-medium text-blue-600 hover:text-blue-700 hover:underline text-sm break-all block"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {profile.website}
                  </a>
                </Tooltip>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileInfo;