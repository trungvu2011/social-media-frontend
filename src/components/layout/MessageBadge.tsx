import { useEffect, useState } from "react";
import { useSocketContext } from "../../context/SocketContext";
import { useLocation } from "react-router-dom";
import { getUnreadMessageCount } from "../../utils";

export const MessageBadge = () => {
  const { socket } = useSocketContext();
  const [unreadCount, setUnreadCount] = useState(0);
  const location = useLocation();

  // Fetch initial unread count on mount
  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const { count } = await getUnreadMessageCount();
        setUnreadCount(count);
      } catch (error) {
        console.error("Failed to fetch unread message count:", error);
      }
    };

    fetchUnreadCount();
  }, []);

  // Reset count when visiting chat page
  useEffect(() => {
    if (location.pathname === "/chat") {
      setUnreadCount(0);
    }
  }, [location.pathname]);

  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = () => {
      // Don't increment if already on chat page
      if (location.pathname !== "/chat") {
        setUnreadCount((prev) => prev + 1);
      }
    };

    socket.on("message:new", handleNewMessage);

    return () => {
      socket.off("message:new", handleNewMessage);
    };
  }, [socket, location.pathname]);

  // Return count number only, not the icon
  if (unreadCount === 0) return null;
  
  return (
    <span className="ml-auto bg-white border-2 border-indigo-300 text-indigo-600 text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
      {unreadCount > 99 ? "99+" : unreadCount}
    </span>
  );
};
