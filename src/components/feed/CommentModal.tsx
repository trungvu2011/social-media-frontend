import React, { useEffect, useState, useRef } from "react";
import { X } from "lucide-react";
import {
  getPostComments,
  addComment,
  deleteComment,
  type Comment,
  getProfile,
  type UserProfile,
} from "../../utils";
import type { Post as PostType } from "../../types/social";
import Post from "./Post";
import ReportModal from "../ReportModal";
import CommentItem from "./CommentItem";

import CommentInput from "./CommentInput";

interface CommentModalProps {
  post: PostType;
  onClose: () => void;
  onCommentChange?: (delta: number) => void;
}

const CommentModal: React.FC<CommentModalProps> = ({
  post,
  onClose,
  onCommentChange,
}) => {
  const postId = post.id;
  const [comments, setComments] = useState<Comment[]>([]);
  const [replyingTo, setReplyingTo] = useState<Comment | null>(null);
  const [lastAddedReply, setLastAddedReply] = useState<Comment | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [reportCommentId, setReportCommentId] = useState<string | null>(null);
  
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    fetchComments(1);
    fetchCurrentUser();
    return () => { document.body.style.overflow = "unset"; };
  }, [postId]);

  const fetchCurrentUser = async () => {
    try {
      const user = await getProfile();
      setCurrentUser(user);
    } catch (error) {
      console.error("Failed to fetch user profile", error);
    }
  };

  const fetchComments = async (pageNum: number) => {
    try {
      setLoading(true);
      const res = await getPostComments(postId, { page: pageNum, limit: 10 });
      if (pageNum === 1) {
        setComments(res.data);
      } else {
        setComments((prev) => [...prev, ...res.data]);
      }
      setHasMore(pageNum < res.meta.pages);
      setPage(pageNum);
    } catch (error) {
      console.error("Failed to load comments", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = () => {
    if (hasMore && !loading) {
      fetchComments(page + 1);
    }
  };

  const handleReply = (comment: Comment) => {
    setReplyingTo(comment);
    // No need to focus textareaRef as input is now dynamic inside CommentItem
  };

  const handleCancelReply = () => {
    setReplyingTo(null);
  };

  const handleCommentSubmit = async (content: string, image: File | null, parentId?: string) => {
    try {
      const res = await addComment(
        postId, 
        content, 
        image || undefined,
        parentId
      );
      
      const createdComment = res.data;

      // Optimistic user attachment
      if (!createdComment.authorId && currentUser) {
         createdComment.authorId = {
            _id: currentUser._id,
            userName: currentUser.userName,
            fullName: currentUser.fullName,
            avatar: currentUser.avatar
         };
      }
      
      if (parentId) {
          setLastAddedReply(createdComment);
          // Update reply count for visual consistency
          setComments(prev => prev.map(c => {
              if (c._id === parentId) {
                  return { ...c, replyCount: (c.replyCount || 0) + 1 };
              }
              return c;
          }));
          setReplyingTo(null); // Close inline input
      } else {
          setComments((prev) => [...prev, createdComment]);
          // Scroll to bottom to see new comment
          if (scrollRef.current) {
              setTimeout(() => {
                  if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
              }, 100);
          }
      }

      if (onCommentChange) onCommentChange(1);

    } catch (error) {
      console.error("Failed to post comment", error);
      alert("Failed to post comment");
    }
  };

  const handleDelete = async (commentId: string) => {
    try {
      await deleteComment(commentId);
      setComments((prev) => prev.filter((c) => c._id !== commentId));
      if (onCommentChange) {
        onCommentChange(-1);
      }
    } catch (error) {
      console.error("Failed to delete comment", error);
      alert('Unable to delete comment. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div className="relative bg-white w-full max-w-2xl h-[80vh] rounded-xl flex flex-col shadow-2xl overflow-hidden border border-gray-200">
        
        <div className="flex items-center justify-between p-4 border-b border-gray-100 sticky top-0 bg-white z-10">
          <h3 className="text-xl font-bold text-gray-900 text-center w-full">Post</h3>
          <button 
            onClick={onClose}
            className="absolute right-4 p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition"
          >
            <X size={20} className="text-gray-600" />
          </button>
        </div>

        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-0 space-y-0"
        >
          {/* Post Content */}
          <div className="border-b border-gray-200">
             <Post 
                post={post} 
                onCommentClick={() => {
                   // Focus main input?
                }} 
             />
          </div>

          <div className="p-4 space-y-4">
          {comments.length === 0 && !loading && (
            <div className="text-center text-gray-500 mt-10">
              No comments yet. Be the first to share your thoughts!
            </div>
          )}

          {comments.map((comment) => (
            <CommentItem
                key={comment._id}
                comment={comment}
                currentUser={currentUser}
                postOwnerId={post.user.id}
                onReply={handleReply}
                onDelete={handleDelete}
                onReport={(id) => setReportCommentId(id)}
                lastAddedReply={lastAddedReply}
                replyingToCommentId={replyingTo?._id}
                onReplySubmit={handleCommentSubmit}
                onCancelReply={handleCancelReply}
            />
          ))}

          {loading && (
             <div className="text-center text-gray-500 py-4">Loading comments...</div>
          )}

          {hasMore && !loading && comments.length > 0 && (
            <button 
              onClick={handleLoadMore}
              className="w-full text-blue-500 hover:text-blue-600 text-sm py-2 font-medium"
            >
              View more comments
            </button>
          )}
          </div>
        </div>

        {/* Global Footer Input - Visible only when NOT replying to specific comment or always visible? 
            Usually always visible for top-level comments. but if replying, maybe hide it? 
            User said "another comment line at reply place". 
            Let's keep global for Top Level, and disable or hide if replying inline? 
            For now, let's keep it but if replyingTo is set, maybe it shouldn't confuse user.
            Actually, if inline input is open, user is focused there.
        */}
        <div className="p-4 border-t border-gray-100 bg-white">
          {!replyingTo && (
            <CommentInput 
                currentUser={currentUser}
                onSubmit={(content, image) => handleCommentSubmit(content, image)}
                placeholder="Write a comment..."
            />
          )}
          {replyingTo && (
              <div className="text-center text-sm text-gray-500 py-2 bg-gray-50 rounded">
                  Replying to <strong>{replyingTo.authorId.userName}</strong> above... 
                  <button onClick={handleCancelReply} className="ml-2 text-blue-500 hover:underline">Cancel</button>
              </div>
          )}
        </div>
      </div>
      
      {/* Report Comment Modal */}
      {reportCommentId && (
        <ReportModal
          commentId={reportCommentId}
          onClose={() => setReportCommentId(null)}
        />
      )}
    </div>
  );
};

export default CommentModal;
