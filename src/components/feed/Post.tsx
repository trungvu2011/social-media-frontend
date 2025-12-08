import React, { useState } from 'react';
import type { Post as PostType } from '../../types/social';
import { Link } from 'react-router-dom';
import { Heart, MessageCircle, Share2, MoreHorizontal, Paperclip, Smile, Send } from 'lucide-react';
import { likePost, unlikePost } from '../../utils';

interface PostProps {
  post: PostType;
}

const Post: React.FC<PostProps> = ({ post }) => {
  // State for like functionality
  const [isLiked, setIsLiked] = useState(post.isLiked);
  const [likeCount, setLikeCount] = useState(post.likes);
  const [isLiking, setIsLiking] = useState(false);

  // Get current user for comment avatar
  const authUser = (() => {
    try {
      const stored = localStorage.getItem("auth_user") || sessionStorage.getItem("auth_user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  })();

  // Handle like/unlike
  const handleLike = async () => {
    if (isLiking) return;
    
    setIsLiking(true);
    try {
      if (isLiked) {
        await unlikePost(post.id);
        setIsLiked(false);
        setLikeCount(prev => Math.max(0, prev - 1));
      } else {
        await likePost(post.id);
        setIsLiked(true);
        setLikeCount(prev => prev + 1);
      }
    } catch (error) {
      console.error('Failed to like/unlike:', error);
    } finally {
      setIsLiking(false);
    }
  };
  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
    return `${Math.floor(diffInSeconds / 86400)}d`;
  };

  return (
    <div className="bg-white border-b border-gray-200">
      {/* Post Header */}
      <div className="flex items-start p-4 pb-3">
        {/* Avatar */}
        <Link to={`/profile/${post.user.username}`} className="flex-shrink-0">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full hover:opacity-80 transition-opacity overflow-hidden">
            {post.user.avatar && (
              <img src={post.user.avatar} alt="" className="w-full h-full object-cover" />
            )}
          </div>
        </Link>
        
        <div className="ml-3 flex-1">
          {/* User Info */}
          <div className="flex items-center gap-2">
            <Link 
              to={`/profile/${post.user.username}`}
              className="font-semibold text-gray-900 hover:underline text-medium"
            >
              {post.user.displayName}
            </Link>
            {post.user.isVerified && (
              <span className="text-blue-500 text-medium">✓</span>
            )}
            <span className="text-gray-400 text-medium">·</span>
            <span className="text-gray-500 text-medium">{formatTimeAgo(post.createdAt)}</span>
          </div>
          <Link 
            to={`/profile/${post.user.username}`}
            className="text-sm text-gray-500 hover:text-gray-700 block -mt-0.5"
          >
            @{post.user.username}
          </Link>
        </div>
        
        <button className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
          <MoreHorizontal className="w-5 h-5 text-gray-400" />
        </button>
      </div>

      {/* Post Content */}
      <div className="px-4 pb-3">
        <p className="text-gray-800 text-medium whitespace-pre-line leading-relaxed">
          {post.content}
        </p>
        
        {/* Images */}
        {Array.isArray(post.images) && post.images.length > 0 && (
          <div className="mt-3 rounded-xl overflow-hidden">
            {post.images.length === 1 ? (
              <img
                src={post.images[0]}
                alt="post"
                className="w-full h-64 object-cover"
                loading="lazy"
              />
            ) : (
              <div className="grid grid-cols-2 gap-1">
                {post.images.slice(0, 4).map((src, idx) => (
                  <img
                    key={idx}
                    src={src}
                    alt={`post ${idx + 1}`}
                    className="w-full h-40 object-cover"
                    loading="lazy"
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Post Stats */}
      <div className="px-4 py-2 flex items-center gap-4 text-xs text-gray-500">
        <span>{likeCount} Likes</span>
        <span>{post.comments} Comments</span>
        <span>{post.shares} Share</span>
      </div>

      {/* Post Actions */}
      <div className="flex border-t border-gray-100">
        <button
          onClick={handleLike}
          disabled={isLiking}
          className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm hover:bg-gray-50 transition-colors disabled:opacity-50 ${
            isLiked ? 'text-red-500' : 'text-gray-500'
          }`}
        >
          <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
          <span>Like</span>
        </button>
        <button className="flex-1 flex items-center justify-center gap-2 py-3 text-sm text-gray-500 hover:bg-gray-50 transition-colors">
          <MessageCircle className="w-5 h-5" />
          <span>Comment</span>
        </button>
        <button className="flex-1 flex items-center justify-center gap-2 py-3 text-sm text-gray-500 hover:bg-gray-50 transition-colors">
          <Share2 className="w-5 h-5" />
          <span>Share</span>
        </button>
      </div>

      {/* Comment Input */}
      <div className="px-4 py-3 border-t border-gray-100 flex items-center gap-3">
        <div className="w-8 h-8 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex-shrink-0 overflow-hidden">
          {authUser?.avatar && (
            <img src={authUser.avatar} alt="" className="w-full h-full object-cover" />
          )}
        </div>
        <div className="flex-1 flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-full px-4 py-2">
          <input
            type="text"
            placeholder="Write your comment.."
            className="flex-1 bg-transparent text-sm placeholder-gray-400 focus:outline-none"
          />
        </div>
        <button className="p-2 text-gray-400 hover:text-gray-600 rounded-full border border-gray-200 hover:bg-gray-100 transition-colors">
          <Paperclip className="w-4 h-4" />
        </button>
        <button className="p-2 text-gray-400 hover:text-gray-600 rounded-full border border-gray-200 hover:bg-gray-100 transition-colors">
          <Smile className="w-4 h-4" />
        </button>
        <button className="p-2 text-indigo-600 hover:text-indigo-700 rounded-full border border-indigo-600 hover:bg-indigo-50 transition-colors">
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default Post;
