import type { BackendPostListItem } from "../../utils";
import Post from "../feed/Post";
import type { Post as PostType } from "../../types/social";

interface PostDetailModalProps {
  isOpen: boolean;
  post: BackendPostListItem | null;
  onClose: () => void;
}

export default function PostDetailModal({
  isOpen,
  post,
  onClose,
}: PostDetailModalProps) {
  if (!isOpen || !post) return null;

  // Map BackendPostListItem to PostType
  const mappedPost: PostType = {
    id: post._id,
    user: {
      id: post.authorId._id,
      username: post.authorId.userName,
      displayName: post.authorId.fullName || post.authorId.userName,
      avatar: post.authorId.avatar,
      isVerified: false, // Default
      isPro: false, // Default
    },
    content: post.text || post.content || "",
    images: post.images,
    likes: post.likes,
    commentCount: post.commentCount,
    shares: 0,
    createdAt: post.createdAt,
    isLiked: false, // Admin view doesn't need to reflect admin's like status necessarily, or we can calculate it if needed
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
          <h3 className="font-bold text-gray-900">Post Details</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto bg-gray-100">
          <div className="bg-white rounded-lg shadow-sm">
             <Post post={mappedPost} />
          </div>
        </div>

        {/* Footer */}
        {/* <div className="p-4 border-t bg-gray-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-medium transition-colors"
          >
            Close
          </button>
        </div> */}
      </div>
    </div>
  );
}
