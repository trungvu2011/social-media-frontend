import { Home, HelpCircle, LogOut } from "lucide-react";
import AppIcon from "../../assets/app_icon.png";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { signOut } from "../../utils";

export default function LeftSidebar() {
  const menuItems = [
    { id: "", icon: Home, label: "Feed" },
    { id: "help", icon: HelpCircle, label: "Help & Support" },
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
    } finally {
      try {
        localStorage.removeItem("auth_user");
        localStorage.removeItem("access_token");
      } catch {}
      try {
        sessionStorage.removeItem("auth_user");
        sessionStorage.removeItem("access_token");
      } catch {}
      navigate("/login", { replace: true });
      setTimeout(() => window.location.reload(), 0);
    }
  };

  return (
    <div className="w-[300px] bg-white border-r border-gray-200 h-screen left-0 top-0 flex flex-col">
      {/* Logo */}
      <div className="p-5">
        <div className="flex items-center gap-2">
          <img src={AppIcon} alt="Logo" className="w-10 h-10 rounded-xl" />
          <span className="font-bold text-xl text-gray-900">slothui</span>
        </div>
      </div>

      {/* Search */}
      <div className="px-4 pb-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search..."
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3">
        {menuItems.map((item) => (
          <Link
            key={item.id}
            to={`/${item.id}`}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl mb-1 text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <item.icon className="w-5 h-5" />
            <span className="font-medium">{item.label}</span>
          </Link>
        ))}
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-3">
          <Link
            to={`/profile/${authUser?.userName || ''}`}
            className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex-shrink-0 overflow-hidden hover:opacity-80 transition-opacity"
          >
            {authUser?.avatar && (
              <img src={authUser.avatar} alt="" className="w-full h-full object-cover" />
            )}
          </Link>
          <Link 
            to={`/profile/${authUser?.userName || ''}`}
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
