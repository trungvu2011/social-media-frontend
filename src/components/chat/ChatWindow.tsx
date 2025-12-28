import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";
import { type ChatMessage, type ChatUser } from "../../utils";
import { Info, Video } from "lucide-react";

interface ChatWindowProps {
  messages: ChatMessage[];
  otherUser: ChatUser | undefined;
  currentUserId: string;
  onSendMessage: (content: string) => void;
  loading: boolean;
  isConnected: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  isTyping?: boolean;
  onTyping?: () => void;
}

export const ChatWindow = ({
  messages,
  currentUserId,
  otherUser,
  onSendMessage,
  loading,
  isConnected,
  hasMore,
  onLoadMore,
  isTyping = false,
  onTyping,
}: ChatWindowProps) => {
  return (
    <div className="flex-1  flex flex-col bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden mx-10 my-4">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* avatar and name */}
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
          <div className="flex flex-col">
            <h3 className={`truncate font-semibold text-gray-900`}>
              {otherUser?.fullName || otherUser?.userName || "Unknown"}
            </h3>
            {isTyping && (
              <div className="text-sm text-gray-500">Đang nhập…</div>
            )}
          </div>
        </div>
        {/* icon button */}
        <div>
          <button className="p-2 rounded-full hover:bg-gray-100 transition ">
            <Video size={20} />
          </button>
          <button className="p-2 rounded-full hover:bg-gray-100 transition ml-2">
            <Info size={20} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <MessageList
        messages={messages}
        otherUser={otherUser}
        currentUserId={currentUserId}
        loading={loading}
        hasMore={hasMore}
        onLoadMore={onLoadMore}
      />

      {/* Input */}
      <MessageInput
        onSendMessage={onSendMessage}
        onTyping={onTyping}
        disabled={!isConnected}
      />
    </div>
  );
};
