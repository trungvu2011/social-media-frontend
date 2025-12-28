import { type ChatUser, type ChatConversation } from "../../utils/index";

interface ChatSidebarProps {
  conversations: ChatConversation[];
  activeConversationId: string | null;
  onSelectConversation: (conversationId: string) => void;
  currentUserId: string;
}

export const ChatSidebar = ({
  conversations,
  activeConversationId,
  onSelectConversation,
  currentUserId,
}: ChatSidebarProps) => {
  const getOtherUser = (members: ChatUser[]): ChatUser | undefined => {
    return members.find((m) => m._id !== currentUserId);
  };

  const formatTime = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));

    if (hours < 24) {
      return date.toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
      });
    }
    return date.toLocaleDateString("vi-VN");
  };

  return (
    <div className="bg-white border-r border-gray-200 flex flex-col h-full w-80">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">Messages</h2>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        {conversations.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            Chưa có cuộc trò chuyện nào
          </div>
        ) : (
          conversations.map((conversation) => {
            const otherUser = getOtherUser(conversation.members);
            const isActive = conversation._id === activeConversationId;
            const lastMessage = conversation.lastMessage;
            const isUnread =
              lastMessage &&
              !lastMessage.isSeen &&
              lastMessage.senderId !== currentUserId;

            return (
              <div
                key={conversation._id}
                onClick={() => onSelectConversation(conversation._id)}
                className={`p-4 border-b border-gray-100 cursor-pointer transition-colors ${
                  isActive
                    ? "bg-blue-50 border-l-4 border-l-blue-500"
                    : "hover:bg-gray-50"
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* Avatar */}
                  <div className="flex-shrink-0 relative">
                    {otherUser?.avatar ? (
                      <img
                        src={otherUser.avatar}
                        alt={otherUser.fullName || otherUser.userName}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold text-lg">
                        {(otherUser?.fullName ||
                          otherUser?.userName ||
                          "? ")[0].toUpperCase()}
                      </div>
                    )}
                    {isUnread && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white"></div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline justify-between mb-1">
                      <h3
                        className={`truncate ${
                          isUnread ? "font-bold" : "font-semibold"
                        } text-gray-900`}
                      >
                        {otherUser?.fullName ||
                          otherUser?.userName ||
                          "Unknown"}
                      </h3>
                      <span className="text-xs text-gray-500 ml-2 flex-shrink-0">
                        {formatTime(lastMessage?.createdAt)}
                      </span>
                    </div>
                    <p
                      className={`text-sm truncate ${
                        isUnread
                          ? "font-semibold text-gray-900"
                          : "text-gray-600"
                      }`}
                    >
                      {lastMessage?.content || "Chưa có tin nhắn"}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
