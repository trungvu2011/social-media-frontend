import React, { useState, useEffect } from 'react';
import type { Post as PostType } from '../../types/social';
import { Link } from 'react-router-dom';
import { Heart, MessageCircle, Share2, MoreHorizontal, Flag } from 'lucide-react';
import { likePost, unlikePost } from '../../utils';
import { useSocketContext } from '../../context/SocketContext';

interface PostProps {
  post: PostType;
}


const CommentModal = React.lazy(() => import('./CommentModal'));
const ReportModal = React.lazy(() => import('../ReportModal'));

interface PostProps {
  post: PostType;
  onCommentClick?: () => void;
}

const Post: React.FC<PostProps> = ({ post, onCommentClick }) => {
  // Get current user for checks
  const authUser = (() => {
    try {
      const stored = localStorage.getItem("auth_user") || sessionStorage.getItem("auth_user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  })();

  // State for like functionality
  const [isLiked, setIsLiked] = useState(Array.isArray(post.likes) ? post.likes.includes(authUser?.id || authUser?._id) : false);
  const [likeCount, setLikeCount] = useState(Array.isArray(post.likes) ? post.likes.length : 0);
  const [isLiking, setIsLiking] = useState(false);
  
  // State for comments
  const [showComments, setShowComments] = useState(false);
  const [commentCount, setCommentCount] = useState(post.commentCount || 0);

  // State for report/options
  const [showOptions, setShowOptions] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);

  // Sync local state when prop updates (e.g. feed refresh)
  React.useEffect(() => {
    if (Array.isArray(post.likes)) {
       setIsLiked(post.likes.includes(authUser?.id || authUser?._id));
       setLikeCount(post.likes.length);
    }
    setCommentCount(post.commentCount || 0); 
  }, [post.likes, post.commentCount]);

  // Real-time Socket.io listeners
  const { socket, isConnected } = useSocketContext();

  useEffect(() => {
    if (!socket || !isConnected) return;

    // Join post room to receive updates
    const postId = post.id;
    // ...
    socket.emit('join:post', postId);

    // Listen for like events
    const handlePostLiked = (data: any) => {
      if (data.postId === postId) {
        setLikeCount(data.likeCount);
        // Update isLiked if current user liked
        if (data.userId === (authUser?.id || authUser?._id)) {
          setIsLiked(true);
        }
      }
    };

    const handlePostUnliked = (data: any) => {
      if (data.postId === postId) {
        setLikeCount(data.likeCount);
        // Update isLiked if current user unliked
        if (data.userId === (authUser?.id || authUser?._id)) {
          setIsLiked(false);
        }
      }
    };

    const handleCommentAdded = (data: any) => {
      if (data.postId === postId) {
        setCommentCount(data.commentCount);
      }
    };

    socket.on('post:liked', handlePostLiked);
    socket.on('post:unliked', handlePostUnliked);
    socket.on('comment:added', handleCommentAdded);

    return () => {
      socket.emit('leave:post', postId);
      socket.off('post:liked', handlePostLiked);
      socket.off('post:unliked', handlePostUnliked);
      socket.off('comment:added', handleCommentAdded);
    };
  }, [socket, isConnected, post.id, authUser?.id, authUser?._id]);

  // Handle like/unlike
  const handleLike = async () => {
    if (isLiking) return;
    
    setIsLiking(true);
    // Store previous state for rollback
    const prevIsLiked = isLiked;
    const prevLikeCount = likeCount;

    // Optimistic update
    setIsLiked(!prevIsLiked);
    setLikeCount(prev => prevIsLiked ? Math.max(0, prev - 1) : prev + 1);

    try {
      if (prevIsLiked) {
        await unlikePost(post.id);
      } else {
        await likePost(post.id);
      }
    } catch (error) {
      console.error('Failed to like/unlike:', error);
      // Revert on error
      setIsLiked(prevIsLiked);
      setLikeCount(prevLikeCount);
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
          <div className="w-10 h-10 rounded-full hover:opacity-80 transition-opacity overflow-hidden">
              <img src={post.user.avatar || "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"} alt="" className="w-full h-full object-cover" />
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
        
        <div className="relative">
          <button 
            onClick={() => setShowOptions(!showOptions)}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <MoreHorizontal className="w-5 h-5 text-gray-400" />
          </button>
          
          {showOptions && (
            <>
              <div 
                className="fixed inset-0 z-10 cursor-default" 
                onClick={() => setShowOptions(false)}
              ></div>
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20 border border-gray-100">
                <button
                  onClick={() => {
                    setShowOptions(false);
                    setShowReportModal(true);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                >
                  <Flag className="w-4 h-4" />
                  Report Post
                </button>
              </div>
            </>
          )}
        </div>
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
        <span>{commentCount} Comments</span>
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
        <button 
          onClick={onCommentClick ? onCommentClick : () => setShowComments(true)}
          className="flex-1 flex items-center justify-center gap-2 py-3 text-sm text-gray-500 hover:bg-gray-50 transition-colors"
        >
          <MessageCircle className="w-5 h-5" />
          <span>Comment</span>
        </button>
        <button className="flex-1 flex items-center justify-center gap-2 py-3 text-sm text-gray-500 hover:bg-gray-50 transition-colors">
          <Share2 className="w-5 h-5" />
          <span>Share</span>
        </button>
      </div>

      {/* Comment Input Preview (triggers modal) */}
      {/* <div className="px-4 py-3 border-t border-gray-100 flex items-center gap-3">
        <div className="w-8 h-8 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex-shrink-0 overflow-hidden">
          {authUser?.avatar && (
            <img src={authUser.avatar} alt="" className="w-full h-full object-cover" />
          )}
        </div>
        <div 
          onClick={() => setShowComments(true)}
          className="flex-1 flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-full px-4 py-2 cursor-pointer hover:bg-gray-100 transition"
        >
          <span className="text-sm text-gray-400">Write your comment..</span>
        </div>
        <button className="p-2 text-gray-400 hover:text-gray-600 rounded-full border border-gray-200 hover:bg-gray-100 transition-colors">
          <Paperclip className="w-4 h-4" />
        </button>
        <button className="p-2 text-gray-400 hover:text-gray-600 rounded-full border border-gray-200 hover:bg-gray-100 transition-colors">
          <Smile className="w-4 h-4" />
        </button>
        <button 
           onClick={() => setShowComments(true)}
           className="p-2 text-indigo-600 hover:text-indigo-700 rounded-full border border-indigo-600 hover:bg-indigo-50 transition-colors"
        >
          <Send className="w-4 h-4" />
        </button>
      </div> */}

      {/* Comment Modal */}
      {showComments && (
        <React.Suspense fallback={null}>
          <CommentModal
            post={post}
            onClose={() => setShowComments(false)}
            onCommentChange={(delta) => setCommentCount((prev) => prev + delta)}
          />
        </React.Suspense>
      )}

      {showReportModal && (
        <React.Suspense fallback={null}>
          <ReportModal
            postId={post.id}
            onClose={() => setShowReportModal(false)}
          />
        </React.Suspense>
      )}
    </div>
  );
};

export default Post;

