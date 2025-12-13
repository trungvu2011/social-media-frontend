import React, { useEffect, useState, useRef } from "react";
import { X, Send, Image as ImageIcon, Trash2 } from "lucide-react";
import {
  getPostComments,
  addComment,
  deleteComment,
  type Comment,
  getProfile,
  type UserProfile,
} from "../../utils";

interface CommentModalProps {
  postId: string;
  onClose: () => void;
  onCommentChange?: (delta: number) => void; 
}

const CommentModal: React.FC<CommentModalProps> = ({
  postId,
  onClose,
  onCommentChange,
}) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    fetchComments(1);
    fetchCurrentUser();
    
    return () => {
      document.body.style.overflow = "unset";
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
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

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const clearImage = () => {
    setSelectedImage(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!newComment.trim() && !selectedImage) || submitting) return;

    try {
      setSubmitting(true);
      
      const res = await addComment(postId, newComment, selectedImage || undefined);
      
      const createdComment = res.data;

      if (!createdComment.authorId && currentUser) {
         createdComment.authorId = {
            _id: currentUser._id,
            userName: currentUser.userName,
            fullName: currentUser.fullName,
            avatar: currentUser.avatar
         };
      }

      setComments((prev) => [createdComment, ...prev]);
      setNewComment("");
      clearImage();
      
      if (onCommentChange) {
         onCommentChange(1);
      }

      if (scrollRef.current) {
        scrollRef.current.scrollTop = 0;
      }
    } catch (error) {
      console.error("Failed to post comment", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (commentId: string) => {
    if (!window.confirm("Delete this comment?")) return;
    try {
      await deleteComment(commentId);
      setComments((prev) => prev.filter((c) => c._id !== commentId));
      if (onCommentChange) {
        onCommentChange(-1);
      }
    } catch (error) {
      console.error("Failed to delete comment", error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div className="relative bg-white w-full max-w-2xl h-[80vh] rounded-xl flex flex-col shadow-2xl overflow-hidden border border-gray-200">
        
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h3 className="text-xl font-bold text-gray-900 text-center w-full">Comments</h3>
          <button 
            onClick={onClose}
            className="absolute right-4 p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition"
          >
            <X size={20} className="text-gray-600" />
          </button>
        </div>

        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-4 space-y-4"
        >
          {comments.length === 0 && !loading && (
            <div className="text-center text-gray-500 mt-10">
              No comments yet. Be the first to share your thoughts!
            </div>
          )}

          {comments.map((comment) => (
            <div key={comment._id} className="flex gap-3 group">
              <img 
                src={comment.authorId?.avatar || "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"} 
                alt={comment.authorId?.userName}
                className="w-8 h-8 rounded-full object-cover mt-1 flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="bg-gray-100 rounded-2xl p-3 inline-block max-w-full">
                  <div className="font-semibold text-gray-900 text-sm mb-1">
                    {comment.authorId?.fullName || comment.authorId?.userName || "Unknown"}
                  </div>
                  {comment.content && (
                    <p className="text-gray-800 text-sm whitespace-pre-wrap break-words">{comment.content}</p>
                  )}
                  {comment.image && (
                    <div className="mt-2 rounded-lg overflow-hidden max-w-sm border border-gray-200">
                      <img src={comment.image} alt="Comment attachment" className="w-full h-auto object-cover" />
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-4 mt-1 ml-2 text-xs text-gray-500">
                  <span>{new Date(comment.createdAt).toLocaleDateString()}</span>
                  {(currentUser?._id === comment.authorId?._id) && (
                    <button 
                      onClick={() => handleDelete(comment._id)}
                      className="text-red-500 hover:underline opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1"
                    >
                      <Trash2 size={12} /> Delete
                    </button>
                  )}
                </div>
              </div>
            </div>
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

        <div className="p-4 border-t border-gray-100 bg-white">
          {previewUrl && (
            <div className="mb-2 relative inline-block">
              <img src={previewUrl} alt="Preview" className="h-20 w-auto rounded-lg border border-gray-200" />
              <button
                onClick={clearImage}
                className="absolute -top-2 -right-2 bg-gray-200 rounded-full p-1 text-gray-600 hover:bg-gray-300"
              >
                <X size={12} />
              </button>
            </div>
          )}
          <form onSubmit={handleSubmit} className="flex items-end gap-2">
             <img 
                src={currentUser?.avatar || "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"} 
                alt="Your avatar"
                className="w-8 h-8 rounded-full object-cover mb-2"
              />
             <div className="flex-1 relative">
               <textarea
                 value={newComment}
                 onChange={(e) => setNewComment(e.target.value)}
                 placeholder="Write a comment..."
                 className="w-full bg-gray-100 text-gray-900 rounded-2xl py-3 pl-4 pr-12 focus:outline-none focus:ring-1 focus:ring-gray-300 resize-none min-h-[44px] max-h-32 placeholder-gray-500"
                 rows={1}
                 onKeyDown={(e) => {
                   if (e.key === 'Enter' && !e.shiftKey) {
                     e.preventDefault();
                     handleSubmit(e);
                   }
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = 'auto'; 
                  target.style.height = `${target.scrollHeight}px`;
                 }}
               />
               <input 
                  type="file" 
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageSelect}
               />
               <div className="absolute right-2 bottom-2 flex items-center gap-1">
                 <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-full transition"
                 >
                   <ImageIcon size={20} />
                 </button>
                 <button 
                   type="submit"
                   disabled={(!newComment.trim() && !selectedImage) || submitting}
                   className="p-1 text-blue-500 hover:bg-blue-50 rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition"
                 >
                   <Send size={20} />
                 </button>
               </div>
             </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CommentModal;
