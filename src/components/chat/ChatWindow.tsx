import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";
import { type ChatMessage } from "../../utils";

interface ChatWindowProps {
  messages: ChatMessage[];
  currentUserId: string;
  onSendMessage: (content: string) => void;
  loading: boolean;
  isConnected: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  conversationName?: string;
  isTyping?: boolean;
  onTyping?: () => void;
}

export const ChatWindow = ({
  messages,
  currentUserId,
  onSendMessage,
  loading,
  isConnected,
  hasMore,
  onLoadMore,
  conversationName,
  isTyping = false,
  onTyping,
}: ChatWindowProps) => {
  return (
    <div className="flex-1 flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">
            {conversationName || "Chọn một cuộc trò chuyện"}
          </h2>
          {/* <div className="flex items-center gap-2 mt-1">
            <div
              className={`w-2 h-2 rounded-full ${
                isConnected ? "bg-green-500" : "bg-red-500"
              }`}
            />
            <span className="text-xs text-gray-500">
              {isTyping
                ? "Đang nhập..."
                : isConnected
                ? "Đang hoạt động"
                : "Mất kết nối"}
            </span>
          </div> */}
        </div>
      </div>

      {/* Messages */}
      <MessageList
        messages={messages}
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
