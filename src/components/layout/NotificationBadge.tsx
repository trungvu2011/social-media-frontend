import { useEffect, useState } from "react";
import { useSocketContext } from "../../context/SocketContext";
import { Bell } from "lucide-react";
import { useLocation } from "react-router-dom";

export const NotificationBadge = () => {
  const { socket } = useSocketContext();
  const [unreadCount, setUnreadCount] = useState(0);
  const location = useLocation();

  // Reset count when visiting notifications page
  useEffect(() => {
    if (location.pathname === "/notifications") {
      setUnreadCount(0);
    }
  }, [location.pathname]);

  useEffect(() => {
    if (!socket) return;

    const handleNewNotification = () => {
      // Don't increment if already on notifications page
      if (location.pathname !== "/notifications") {
        setUnreadCount((prev) => prev + 1);
        
        // Optional: Browser notification could go here
      }
    };

    socket.on("notification:new", handleNewNotification);

    return () => {
      socket.off("notification:new", handleNewNotification);
    };
  }, [socket, location.pathname]);

  return (
    <div className="relative inline-block">
      <Bell className="w-6 h-6" />
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
          {unreadCount > 9 ? "9+" : unreadCount}
        </span>
      )}
    </div>
  );
};
