import { useLayoutEffect, useRef } from "react";
import { type ChatMessage } from "../../utils";

interface MessageListProps {
  messages: ChatMessage[];
  currentUserId: string;
  loading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
}

export const MessageList = ({
  messages,
  currentUserId,
  loading,
  hasMore,
  onLoadMore,
}: MessageListProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const isFirstLoadRef = useRef(true);

  // Auto scroll to bottom on new messages
  useLayoutEffect(() => {
    if (!messages.length) return;
    if (isFirstLoadRef.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
      isFirstLoadRef.current = false;
      return;
    }
  }, [messages]);

  // Handle scroll for load more
  const handleScroll = () => {
    const container = messagesContainerRef.current;
    if (!container || loading || !hasMore) return;

    if (container.scrollTop === 0) {
      onLoadMore();
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div
      ref={messagesContainerRef}
      onScroll={handleScroll}
      className="flex-1 overflow-y-auto p-4 space-y-4"
    >
      {loading && (
        <div className="text-center py-2">
          <span className="text-sm text-gray-500">Đang tải...</span>
        </div>
      )}

      {messages.map((message, index) => {
        const isOwnMessage = message.senderId === currentUserId;
        const showTime =
          index === 0 ||
          new Date(message.createdAt).getTime() -
            new Date(messages[index - 1].createdAt).getTime() >
            5 * 60 * 1000; // 5 minutes

        return (
          <div
            key={message._id}
            className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[70%] ${
                isOwnMessage ? "items-end" : "items-start"
              } flex flex-col`}
            >
              <div
                className={`px-4 py-2 rounded-2xl ${
                  isOwnMessage
                    ? "bg-blue-500 text-white rounded-br-sm"
                    : "bg-gray-200 text-gray-800 rounded-bl-sm"
                }`}
              >
                <p className="break-words whitespace-pre-wrap">
                  {message.content}
                </p>
              </div>
              {showTime && (
                <span className="text-xs text-gray-500 mt-1 px-2">
                  {formatTime(message.createdAt)}
                </span>
              )}
            </div>
          </div>
        );
      })}

      <div ref={messagesEndRef} />
    </div>
  );
};
