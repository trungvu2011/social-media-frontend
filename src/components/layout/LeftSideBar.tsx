import { House, LogOut, User, Bell, MessageCircle, Settings, X } from "lucide-react";

import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { signOut } from "../../utils";
import { NotificationBadge } from "./NotificationBadge";

interface LeftSidebarProps {
  onClose?: () => void;
}

export default function LeftSidebar({ onClose }: LeftSidebarProps) {
  const menuItems = [
    { id: "", icon: House, label: "Feed" },
    { id: "notifications", icon: Bell, label: "Notifications" },
    { id: "profile", icon: User, label: "Profile" },
    { id: "chat", icon: MessageCircle, label: "Messages" },
    { id: "help", icon: Settings, label: "Help & Support" },
  ];

  const [authUser] = useState<any>(() => {
    try {
      const stored =
        localStorage.getItem("auth_user") ||
        sessionStorage.getItem("auth_user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut();
      localStorage.removeItem("auth_user");
      localStorage.removeItem("access_token");
      sessionStorage.removeItem("auth_user");
      sessionStorage.removeItem("access_token");

      // Dispatch storage event to update App state immediately
      window.dispatchEvent(new Event("storage"));

      navigate("/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <div className="w-[300px] bg-white border-r border-gray-200 h-full left-0 top-0 flex flex-col">
      {/* Logo */}
      {/* Logo Area (Hidden on Desktop as it's in Header now) */}
      <div className="lg:hidden p-5 flex items-center justify-between">
         {/* Spacer or Title if needed, or just Close button */}
         <div className="font-bold text-xl text-gray-800">Menu</div>
        {/* Close button for mobile */}
        {onClose && (
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close menu"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        )}
      </div>

       {/* Desktop Spacer if needed? No, Header is fixed top. Sidebar is below header in desktop. */}
       {/* Actually in Layout, Sidebar is "lg:top-0" but we changed it to "fixed top-16". So it starts AFTER header. 
           So we don't need top padding for logo on desktop. 
       */}
      <div className="hidden lg:block h-4"></div> 


      {/* Navigation */}
      <nav className="flex-1 px-3">
        {menuItems.map((item) => {
          // Special handling for Profile - use current user's username
          const path =
            item.id === "profile"
              ? `/profile/${authUser?.userName || ""}`
              : `/${item.id}`;

          return (
            <Link
              key={item.id}
              to={path}
              onClick={onClose}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl mb-1 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              {item.id === "notifications" ? (
                <NotificationBadge />
              ) : (
                <item.icon className="w-6 h-6" />
              )}
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-3">
          <Link
            to={`/profile/${authUser?.userName || ""}`}
            className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex-shrink-0 overflow-hidden hover:opacity-80 transition-opacity"
          >
            {authUser?.avatar && (
              <img
                src={authUser.avatar}
                alt=""
                className="w-full h-full object-cover"
              />
            )}
          </Link>
          <Link
            to={`/profile/${authUser?.userName || ""}`}
            className="flex-1 min-w-0 text-left hover:opacity-80 transition-opacity"
          >
            <div className="text-medium font-semibold text-gray-900 truncate">
              {authUser?.fullName || "User"}
            </div>
            <div className="text-sm text-gray-500 truncate">
              @{authUser?.userName || "username"}
            </div>
          </Link>
          <button
            onClick={handleLogout}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
