import React from 'react';
import type { Post as PostType } from '../../types/social';

interface PostProps {
  post: PostType;
}

const Post: React.FC<PostProps> = ({ post }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-4">
      {/* Post Header */}
      <div className="flex items-center p-4">
        <div className="w-10 h-10 bg-gray-300 rounded-full flex-shrink-0"></div>
        <div className="ml-3">
          <div className="flex items-center">
            <h3 className="font-semibold text-gray-900">{post.user.displayName}</h3>
            {post.user.isVerified && (
              <span className="ml-1 text-blue-500">✓</span>
            )}
          </div>
          <p className="text-sm text-gray-500">@{post.user.username}</p>
        </div>
        <button className="ml-auto text-gray-400 hover:text-gray-600">
          •••
        </button>
      </div>

      {/* Post Content */}
      <div className="px-4 pb-3">
        <p className="text-gray-800 whitespace-pre-line">{post.content}</p>
        {post.image && (
          <div className="mt-3 rounded-lg overflow-hidden bg-gray-100 h-64 flex items-center justify-center">
            <span className="text-gray-400">[Image: {post.image}]</span>
          </div>
        )}
      </div>

      {/* Post Stats */}
      <div className="px-4 py-3 border-t border-gray-100 text-sm text-gray-500">
        {post.likes} likes • {post.comments} comments • {post.shares} shares
      </div>

      {/* Post Actions */}
      <div className="flex border-t border-gray-100">
        <button className={`flex-1 py-3 text-center hover:bg-gray-50 ${
          post.isLiked ? 'text-red-500' : 'text-gray-500'
        }`}>
          👍 Like
        </button>
        <button className="flex-1 py-3 text-center text-gray-500 hover:bg-gray-50">
          💬 Comment
        </button>
        <button className="flex-1 py-3 text-center text-gray-500 hover:bg-gray-50">
          🔄 Share
        </button>
      </div>
    </div>
  );
};

export default Post;