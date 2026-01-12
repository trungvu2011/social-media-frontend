import { useChat } from "../../hooks/useChat";
import { ChatSidebar } from "../../components/chat/ChatSidebar";
import { ChatWindow } from "../../components/chat/ChatWindow";
import ChatSetting from "../../components/chat/ChatSetting";
import { Link } from "react-router-dom";
import AppIcon from "../../assets/socialhub-horizontal.png";
import { useLocation } from "react-router-dom";
import { type ChatUser } from "../../utils";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export const ChatPage = () => {
  const { t } = useTranslation();
  const [showMobileSidebar, setShowMobileSidebar] = useState(true);
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

  // Handle conversation selection
  const handleSelectConversation = (conversationId: string) => {
    setActiveConversationId(conversationId);
    setShowMobileSidebar(false); // Hide sidebar on mobile when conversation selected
  };

  // Handle back to conversations (mobile)
  const handleBackToConversations = () => {
    setShowMobileSidebar(true);
  };

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
        {/* Chat Sidebar - responsive visibility */}
        <div
          className={`${
            showMobileSidebar ? "block" : "hidden"
          } md:block w-full md:w-auto`}
        >
          <ChatSidebar
            conversations={conversations}
            activeConversationId={activeConversationId}
            onSelectConversation={handleSelectConversation}
            currentUserId={currentUserId}
          />
        </div>

        {/* Chat Window - responsive visibility */}
        {activeConversationId || toUserId ? (
          <div
            className={`${
              showMobileSidebar ? "hidden" : "flex-1 h-full"
            } md:flex md:flex-1 md:h-auto`}
          >
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
              onBack={handleBackToConversations}
            />
          </div>
        ) : (
          <div className="flex-1 hidden md:flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                {t("Messages.Welcome.Title")}
              </h3>
              <p className="text-gray-500">
                {t("Messages.Welcome.Subtitle")}
              </p>
            </div>
          </div>
        )}

        {/* Chat Setting - hidden on mobile and tablet */}
        {activeConversation || toUserId ? (
          <div className="hidden xl:block">
            <ChatSetting otherUser={otherUser} />
          </div>
        ) : null}
      </div>
    </div>
  );
};
