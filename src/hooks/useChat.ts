import { useState, useEffect, useCallback } from "react";
import { useSocket } from "./useSocket";
import {
  type ChatConversation,
  type ChatMessage,
  getUserConversations,
  getConversationMessages,
} from "../utils";

export const useChat = () => {
  const { socket, isConnected, on, off, emit } = useSocket();
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<
    string | null
  >(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());

  // Load conversations and populate member data
  const loadConversations = useCallback(async () => {
    try {
      const data = await getUserConversations();
      setConversations(data);
    } catch (error) {
      console.error("Failed to load conversations:", error);
    }
  }, []);

  // Load messages for a conversation
  const loadMessages = useCallback(
    async (conversationId: string, pageNum: number = 1) => {
      setLoading(true);
      try {
        const response = await getConversationMessages(conversationId, {
          page: pageNum,
          limit: 20,
        });

        if (pageNum === 1) {
          setMessages(response.data);
        } else {
          setMessages((prev) => [...response.data, ...prev]);
        }

        setHasMore(response.data.length === 20);
        setPage(pageNum);
      } catch (error) {
        console.error("Failed to load messages:", error);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Send message
  const sendMessage = useCallback(
    (content: string, toUserId: string) => {
      if (!content.trim()) return;
      emit("send_message", {
        toUserId,
        content: content.trim(),
      });
    },
    [emit]
  );

  // Mark messages as seen
  const markAsSeen = useCallback(
    (conversationId: string) => {
      if (socket && isConnected) {
        //log
        console.log(
          " Marking messages as seen for conversation:",
          conversationId
        );
        emit("seen_message", { conversationId });
      }
    },
    [socket, isConnected, emit]
  );

  // Send typing indicator
  const sendTyping = useCallback(
    (toUserId: string) => {
      if (socket && isConnected) {
        emit("typing", { toUserId });
      }
    },
    [socket, isConnected, emit]
  );

  // Handle incoming messages
  useEffect(() => {
    if (!socket) return;

    const handleReceiveMessage = (message: ChatMessage) => {
      console.log("📨 Received message:", message);
      if (activeConversationId === null) {
        setActiveConversationId(message.conversationId);
      }
      // Add to messages if it's for active conversation
      if (message.conversationId === activeConversationId) {
        setMessages((prev) => [...prev, message]);

        // Mark as seen if user is viewing this conversation
        markAsSeen(message.conversationId);
      }

      // Note: Conversation list will be updated via conversation_updated event
    };

    const handleMessageSeen = ({
      conversationId,
      userId,
    }: {
      conversationId: string;
      userId: string;
    }) => {
      console.log(" Messages seen:", { conversationId, userId });

      // Update isSeen status for messages in active conversation
      if (conversationId === activeConversationId) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.senderId !== userId && msg.conversationId === conversationId
              ? { ...msg, isSeen: true }
              : msg
          )
        );
      }
    };

    const handleTyping = ({ fromUserId }: { fromUserId: string }) => {
      console.log("User typing:", fromUserId);
      setTypingUsers((prev) => new Set(prev).add(fromUserId));

      // Clear typing indicator after 3 seconds
      setTimeout(() => {
        setTypingUsers((prev) => {
          const next = new Set(prev);
          next.delete(fromUserId);
          return next;
        });
      }, 3000);
    };

    const handleChatError = ({ message }: { message: string }) => {
      console.error("Chat error:", message);
      // You can show toast notification here
    };

    const handleConversationUpdated = (
      updatedConversation: ChatConversation
    ) => {
      console.log("🔄 Conversation updated:", updatedConversation);

      setConversations((prev) => {
        const existingIndex = prev.findIndex(
          (conv) => conv._id === updatedConversation._id
        );

        if (existingIndex >= 0) {
          // Update existing conversation and move to top
          const updated = [...prev];
          updated[existingIndex] = updatedConversation;
          // Move to top
          updated.unshift(updated.splice(existingIndex, 1)[0]);
          return updated;
        } else {
          // Add new conversation at top
          return [updatedConversation, ...prev];
        }
      });
    };

    on("receive_message", handleReceiveMessage);
    on("message_seen", handleMessageSeen);
    on("typing", handleTyping);
    on("chat_error", handleChatError);
    on("conversation_updated", handleConversationUpdated);

    return () => {
      off("receive_message", handleReceiveMessage);
      off("message_seen", handleMessageSeen);
      off("typing", handleTyping);
      off("chat_error", handleChatError);
      off("conversation_updated", handleConversationUpdated);
    };
  }, [socket, activeConversationId, on, off, markAsSeen]);

  // Load conversations on mount
  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  // Handle active conversation changes
  useEffect(() => {
    if (!activeConversationId) return;

    loadMessages(activeConversationId);
    markAsSeen(activeConversationId);
  }, [activeConversationId, loadMessages, markAsSeen]);

  return {
    conversations,
    setConversations,
    messages,
    activeConversationId,
    setActiveConversationId,
    sendMessage,
    loading,
    isConnected,
    loadMoreMessages: () => loadMessages(activeConversationId!, page + 1),
    hasMore,
    typingUsers,
    sendTyping,
    markAsSeen,
  };
};
