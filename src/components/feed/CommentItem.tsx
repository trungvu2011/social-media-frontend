import React, { useState } from "react";
import { Link } from "react-router-dom";
import { MoreHorizontal, Trash2, Flag } from "lucide-react";
import { type Comment, type UserProfile, getPostComments } from "../../utils";
import CommentInput from "./CommentInput";
import { useTranslation } from "react-i18next";
import ImageLightbox from "../common/ImageLightbox";

interface CommentItemProps {
  comment: Comment;
  currentUser: UserProfile | null;
  postOwnerId: string;
  onReply: (comment: Comment) => void;
  onDelete: (commentId: string) => void;
  onReport: (commentId: string) => void;
  lastAddedReply?: Comment | null;
  // New props for inline reply
  replyingToCommentId?: string | null;
  onReplySubmit?: (content: string, image: File | null, parentId: string) => Promise<void>;
  onCancelReply?: () => void;
}

const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  currentUser,
  postOwnerId,
  onReply,
  onDelete,
  onReport,
  lastAddedReply,
  replyingToCommentId,
  onReplySubmit,
  onCancelReply,
}) => {
  const { t } = useTranslation();
  const [replies, setReplies] = useState<Comment[]>([]);
  const [showReplies, setShowReplies] = useState(false);
  const [loadingReplies, setLoadingReplies] = useState(false);
  const [repliesLoaded, setRepliesLoaded] = useState(false);
  
  const [openOptions, setOpenOptions] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  // State for image lightbox
  const [showLightbox, setShowLightbox] = useState(false);

  // Check if current user can delete: post owner or comment author
  const isPostOwner = currentUser?._id === postOwnerId;
  const isCommentAuthor = currentUser?._id === comment.authorId._id;
  const canDelete = isPostOwner || isCommentAuthor;

  const isReplying = replyingToCommentId === comment._id;

  // Watch for new reply from parent
  React.useEffect(() => {
    if (lastAddedReply && lastAddedReply.parentCommentId === comment._id) {
        // Prevent duplicates
        setReplies(prev => {
            if (prev.some(r => r._id === lastAddedReply._id)) return prev;
            return [...prev, lastAddedReply];
        });
        setShowReplies(true);
        setRepliesLoaded(true); 
    }
  }, [lastAddedReply, comment._id]);
  
  const handleFetchReplies = async () => {
    if (showReplies && repliesLoaded) {
      setShowReplies(false);
      return;
    }

    if (!showReplies && repliesLoaded) {
      setShowReplies(true);
      return;
    }

    try {
      setLoadingReplies(true);
      const res = await getPostComments(comment.postId, {
        parentCommentId: comment._id,
        limit: 100, // Load initial batch of replies
      });
      setReplies(res.data);
      setRepliesLoaded(true);
      setShowReplies(true);
    } catch (error) {
      console.error("Failed to load replies", error);
    } finally {
      setLoadingReplies(false);
    }
  };

  return (
    <div className="flex gap-3 group relative">
      <Link to={`/profile/${comment.authorId?.userName || ""}`} className="flex-shrink-0 mt-1 z-10">
        <img
          src={
            comment.authorId?.avatar ||
            "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"
          }
          alt={comment.authorId?.userName}
          className="w-8 h-8 rounded-full object-cover"
        />
      </Link>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <div className="bg-gray-100 rounded-2xl p-3 inline-block max-w-full">
            <Link
              to={`/profile/${comment.authorId?.userName || ""}`}
              className="font-semibold text-gray-900 text-sm mb-1 hover:underline block"
            >
              {comment.authorId?.fullName || comment.authorId?.userName || t("Comments.Unknown")}
            </Link>
            <p className="text-gray-800 text-sm whitespace-pre-wrap break-words">
              {comment.content}
            </p>
            {comment.image && (
              <div className="mt-2 rounded-lg overflow-hidden max-w-sm border border-gray-200">
                <img
                  src={comment.image}
                  alt="Comment attachment"
                  className="w-full h-auto object-cover cursor-pointer hover:opacity-95 transition-opacity"
                  onClick={() => setShowLightbox(true)}
                />
              </div>
            )}
          </div>

          {/* Options Menu */}
          <div className="relative flex-shrink-0 self-center">
            <button
              onClick={() => setOpenOptions(!openOptions)}
              className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
            >
              <MoreHorizontal className="w-4 h-4 text-gray-400" />
            </button>

            {openOptions && (
              <>
                <div
                  className="fixed inset-0 z-10 cursor-default"
                  onClick={() => setOpenOptions(false)}
                ></div>
                <div className="absolute left-0 mt-1 w-32 bg-white rounded-md shadow-lg py-1 z-20 border border-gray-100">
                  {canDelete && (
                    <button
                      onClick={() => {
                        setOpenOptions(false);
                        setDeleteConfirm(true);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      {t("Comments.Delete")}
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setOpenOptions(false);
                      onReport(comment._id);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                  >
                    <Flag className="w-4 h-4" />
                    {t("Comments.Report")}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Action Links */}
        <div className="flex items-center gap-4 mt-1 ml-2 text-xs text-gray-500">
          <span>{new Date(comment.createdAt).toLocaleDateString()}</span>
          
          {(comment.replyCount && comment.replyCount > 0) || (replies.length > 0) ? (
              <button 
                  onClick={() => {
                      if (showReplies) {
                          setShowReplies(false);
                          if (onCancelReply) onCancelReply();
                      } else {
                          handleFetchReplies();
                          onReply(comment);
                      }
                  }}
                  className="font-semibold hover:underline cursor-pointer"
              >
                  {loadingReplies ? t("Comments.Loading") : (showReplies ? t("Comments.HideReplies") : t("Comments.ViewReplies", { count: comment.replyCount || replies.length }))}
              </button>
          ) : (
            <button
                onClick={() => {
                    if (isReplying) {
                        if (onCancelReply) onCancelReply();
                    } else {
                        onReply(comment);
                    }
                }}
                className={`font-semibold hover:underline cursor-pointer ${isReplying ? 'text-blue-500' : ''}`}
            >
                {isReplying ? t("Comments.Cancel") : t("Comments.Reply")}
            </button>
          )}
        </div>

        {/* Tree Structure Container */}
        {(showReplies || isReplying) && (
            <div className="mt-2">
                {/* Render Replies */}
                {showReplies && replies.map((reply, index) => {
                    // It is last if: it's the last reply AND we are NOT replying (input is not shown)
                    const isLast = index === replies.length - 1 && !isReplying;
                    
                    return (
                        <div key={reply._id} className="relative pl-5">
                            {/* Vertical Line Segment */}
                            <div 
                                className={`absolute left-0 top-0 w-[2px] bg-gray-200 -ml-[11px] ${isLast ? 'h-[24px]' : 'h-full'}`}
                            ></div>
                            
                            {/* Squared Connector */}
                             <div className="absolute left-0 top-0 w-[18px] h-[20px] border-b-[2px] border-l-[2px] border-gray-200 -ml-[11px]"></div>

                            <CommentItem
                                comment={reply}
                                currentUser={currentUser}
                                postOwnerId={postOwnerId}
                                onReply={onReply}
                                onDelete={onDelete}
                                onReport={onReport}
                                lastAddedReply={lastAddedReply}
                                replyingToCommentId={replyingToCommentId}
                                onReplySubmit={onReplySubmit}
                                onCancelReply={onCancelReply}
                            />
                        </div>
                    );
                })}

                {/* Inline Reply Input - Always show if expanding or explicitly replying */}
                {(isReplying || showReplies) && (
                    <div className="relative pl-5 mt-2">
                         {/* Lines for Input - distinct squared connection */}
                         <div className="absolute left-0 top-[-8px] w-[2px] bg-gray-200 -ml-[11px] h-[20px]"></div>
                         <div className="absolute left-0 top-0 w-[18px] h-[24px] border-b-[2px] border-l-[2px] border-gray-200 -ml-[11px]"></div>
                        
                        <CommentInput
                            currentUser={currentUser}
                            // Don't autoFocus if just viewing replies, unless explicitly replying? 
                            // User said: "chô nhập comment bên trong luôn" implies visible.
                            autoFocus={isReplying} 
                            onSubmit={(content, image) => onReplySubmit ? onReplySubmit(content, image, comment._id) : Promise.resolve()}
                            placeholder={t("Comments.ReplyTo", { name: comment.authorId.userName })}
                        />
                    </div>
                )}
            </div>
        )}

        {/* Delete Modal */}
        {deleteConfirm && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4 shadow-xl">
              <h3 className="text-lg font-semibold mb-2">{t("Comments.ConfirmDeleteTitle")}</h3>
              <p className="text-gray-600 mb-6">
                {t("Comments.ConfirmDeleteMessage")}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteConfirm(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  {t("Comments.Cancel")}
                </button>
                <button
                  onClick={() => onDelete(comment._id)}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  {t("Comments.Confirm")}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Image Lightbox */}
      {showLightbox && comment.image && (
        <ImageLightbox
          images={[comment.image]}
          currentIndex={0}
          onClose={() => setShowLightbox(false)}
        />
      )}
    </div>
  );
};

export default CommentItem;
