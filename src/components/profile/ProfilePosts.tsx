import React from 'react';
import type { Post } from '../../types/social';
import PostComponent from '../feed/Post';

interface ProfilePostsProps {
  posts: Post[];
}

const ProfilePosts: React.FC<ProfilePostsProps> = ({ posts }) => {
  return (
    <div className="space-y-6">
      {/* Posts Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-2xl font-bold text-gray-900">Posts</h2>
          <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
            <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-md shadow-sm">
              All
            </button>
            <button className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 rounded-md transition-colors">
              Photos
            </button>
            <button className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 rounded-md transition-colors">
              Videos
            </button>
          </div>
        </div>
      </div>

      {/* Posts Content */}
      {posts.length > 0 ? (
        <div className="space-y-4">
          {posts.map((post) => (
            <PostComponent key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No posts yet</h3>
          <p className="text-gray-500 max-w-sm mx-auto">
            When you share posts, they'll appear here. Start connecting with others by creating your first post!
          </p>
          <button className="mt-6 bg-blue-500 hover:bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium transition-colors">
            Create Your First Post
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfilePosts;