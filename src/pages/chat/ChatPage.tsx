import { useChat } from "../../hooks/useChat";
import { ChatSidebar } from "../../components/chat/ChatSidebar";
import { ChatWindow } from "../../components/chat/ChatWindow";

export const ChatPage = () => {
  const {
    conversations,
    messages,
    activeConversationId,
    setActiveConversationId,
    sendMessage,
    loading,
    isConnected,
    loadMoreMessages,
    hasMore,
    typingUsers,
    sendTyping,
  } = useChat();

  // Get current user ID
  const currentUserId =
    JSON.parse(localStorage.getItem("auth_user") || "{}").id || "";
  const activeConversation = conversations.find(
    (c) => c._id === activeConversationId
  );

  const otherUser = activeConversation?.members.find(
    (m) => m._id !== currentUserId
  );

  const isOtherUserTyping = otherUser ? typingUsers.has(otherUser._id) : false;

  // Handle send message - pass toUserId
  const handleSendMessage = (content: string) => {
    if (otherUser) {
      sendMessage(content, otherUser._id);
    }
  };

  // Handle typing
  const handleTyping = () => {
    if (otherUser) {
      sendTyping(otherUser._id);
    }
  };

  return (
    <div className="h-screen flex">
      <ChatSidebar
        conversations={conversations}
        activeConversationId={activeConversationId}
        onSelectConversation={setActiveConversationId}
        currentUserId={currentUserId}
      />

      {activeConversationId ? (
        <ChatWindow
          messages={messages}
          currentUserId={currentUserId}
          onSendMessage={handleSendMessage}
          onTyping={handleTyping}
          loading={loading}
          isConnected={isConnected}
          hasMore={hasMore}
          onLoadMore={loadMoreMessages}
          conversationName={otherUser?.fullName || otherUser?.userName}
          isTyping={isOtherUserTyping}
        />
      ) : (
        <div className="flex-1 flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Chào mừng đến với Chat
            </h3>
            <p className="text-gray-500">
              Chọn một cuộc trò chuyện để bắt đầu nhắn tin
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
