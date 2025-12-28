import { useChat } from "../../hooks/useChat";
import { ChatSidebar } from "../../components/chat/ChatSidebar";
import { ChatWindow } from "../../components/chat/ChatWindow";
import ChatSetting from "../../components/chat/ChatSetting";
import { Link } from "react-router-dom";
import AppIcon from "../../assets/socialhub-horizontal.png";
import { useLocation } from "react-router-dom";
import { type ChatUser } from "../../utils";

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

  // Get toUser from location state (if any)
  const location = useLocation();
  const toUserId = location.state?.userId;
  const toUserName = location.state?.userName;
  const toFullName = location.state?.fullName;
  const toUserAvatar = location.state?.avatar;
  // Get current user ID
  const currentUserId =
    JSON.parse(
      localStorage.getItem("auth_user") ||
        sessionStorage.getItem("auth_user") ||
        "{}"
    ).id || "";

  const activeConversation = conversations.find(
    (c) => c._id === activeConversationId
  );

  let otherUser: ChatUser | undefined;
  if (activeConversation) {
    otherUser = activeConversation.members.find((m) => m._id !== currentUserId);
  } else if (toUserId) {
    otherUser = {
      _id: toUserId,
      userName: toUserName,
      fullName: toFullName,
      avatar: toUserAvatar,
    };
  }

  const isOtherUserTyping = otherUser ? typingUsers.has(otherUser._id) : false;

  // Handle send message - pass toUserId
  const handleSendMessage = (content: string) => {
    if (toUserId) {
      sendMessage(content, toUserId);
    } else if (otherUser) {
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
    <div className="h-screen w-screen flex flex-col bg-gray-50">
      {/* header */}
      <div className="w-full  h-16 bg-white border-b border-gray-200 flex items-center px-6 shadow-sm shrink-0">
        {/* Logo */}
        <div className="py-5">
          <Link to="/" className="flex items-center gap-2">
            <img src={AppIcon} alt="Logo" className="w-40 h-15 rounded-xl" />
          </Link>
        </div>
      </div>
      <div className="flex-1 w-screen flex bg-gray-50 overflow-hidden">
        <ChatSidebar
          conversations={conversations}
          activeConversationId={activeConversationId}
          onSelectConversation={setActiveConversationId}
          currentUserId={currentUserId}
        />

        {activeConversationId || toUserId ? (
          <ChatWindow
            messages={messages}
            otherUser={otherUser}
            currentUserId={currentUserId}
            onSendMessage={handleSendMessage}
            onTyping={handleTyping}
            loading={loading}
            isConnected={isConnected}
            hasMore={hasMore}
            onLoadMore={loadMoreMessages}
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

        {activeConversation || toUserId ? (
          <ChatSetting otherUser={otherUser} />
        ) : (
          <div></div>
        )}
      </div>
    </div>
  );
};
