import React, { useState } from "react";
import { X, Send } from "lucide-react";
import { type Post } from "../../types/social";
import { sharePost } from "../../utils";
import { useTranslation } from "react-i18next";

interface ShareModalProps {
  post: Post;
  onClose: () => void;
  onSuccess?: () => void;
}

const ShareModal: React.FC<ShareModalProps> = ({ post, onClose, onSuccess }) => {
  const { t } = useTranslation();
  const [caption, setCaption] = useState("");
  const [isSharing, setIsSharing] = useState(false);

  const authUser = (() => {
    try {
      const stored =
        localStorage.getItem("auth_user") ||
        sessionStorage.getItem("auth_user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  })();

  const handleShare = async () => {
    if (isSharing) return;
    setIsSharing(true);
    try {
      await sharePost(post.id, caption);
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error("Failed to share post:", error);
      alert(t("Share.Failed"));
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl w-full max-w-lg shadow-2xl overflow-hidden scale-100 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h3 className="font-semibold text-lg text-gray-900">{t("Share.Title")}</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* User Info */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200">
              {authUser?.avatar && (
                <img
                  src={authUser.avatar}
                  alt={authUser.displayName}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            <div>
              <div className="font-semibold text-gray-900">
                {authUser?.displayName || authUser?.userName}
              </div>
              <div className="text-xs text-gray-500">{t("Share.ShareToFeed")}</div>
            </div>
          </div>

          {/* Caption Input */}
          <textarea
            placeholder={t("Share.Placeholder")}
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            className="w-full min-h-[100px] resize-none border-none focus:ring-0 text-lg placeholder-gray-400 p-0 mb-4"
            autoFocus
          />

          {/* Post Preview Card */}
          <div className="border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
             {/* Preview Header */}
             <div className="flex items-center gap-2 p-3 border-b border-gray-100">
                <div className="w-6 h-6 rounded-full overflow-hidden bg-gray-200">
                    <img src={post.user.avatar || "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="text-sm font-medium text-gray-900">{post.user.displayName}</div>
             </div>
             
             {/* Preview Content */}
             <div className="p-3">
                 <p className="text-sm text-gray-600 line-clamp-2 mb-2">{post.content}</p>
                 {post.images && post.images.length > 0 && (
                     <div className="h-40 w-full rounded-md overflow-hidden">
                         <img src={post.images[0]} alt="Post preview" className="w-full h-full object-cover" />
                     </div>
                 )}
             </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 flex justify-end gap-3">
            <button 
                onClick={onClose}
                className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition-colors"
            >
                {t("Share.Cancel")}
            </button>
          <button
            onClick={handleShare}
            disabled={isSharing}
            className="px-6 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            {isSharing ? (
              t("Share.Sharing")
            ) : (
                <>
                    <Send className="w-4 h-4" />
                    {t("Share.ShareNow")}
                </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
