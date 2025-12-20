import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "../../utils";

interface AdminLayoutProps {
  children: ReactNode;
  activeTab: "dashboard" | "users" | "posts" | "reports";
  onTabChange: (tab: "dashboard" | "users" | "posts" | "reports") => void;
}

export default function AdminLayout({
  children,
  activeTab,
  onTabChange,
}: AdminLayoutProps) {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  return (
    <div className="flex h-screen bg-gray-100 font-sans w-full">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col shadow-lg">
        <div className="p-6 border-b border-gray-800">
          <h1 className="text-xl font-bold tracking-wider text-blue-400">
            SocialHub Admin
          </h1>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <button
            onClick={() => onTabChange("dashboard")}
            className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors duration-200 ${
              activeTab === "dashboard"
                ? "bg-blue-600 text-white shadow-md"
                : "text-gray-400 hover:bg-gray-800 hover:text-white"
            }`}
          >
            <span className="mr-3 text-lg">📊</span>
            <span className="font-medium">Dashboard</span>
          </button>

          <button
            onClick={() => onTabChange("users")}
            className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors duration-200 ${
              activeTab === "users"
                ? "bg-blue-600 text-white shadow-md"
                : "text-gray-400 hover:bg-gray-800 hover:text-white"
            }`}
          >
            <span className="mr-3 text-lg">👥</span>
            <span className="font-medium">Manage Users</span>
          </button>

          <button
            onClick={() => onTabChange("posts")}
            className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors duration-200 ${
              activeTab === "posts"
                ? "bg-blue-600 text-white shadow-md"
                : "text-gray-400 hover:bg-gray-800 hover:text-white"
            }`}
          >
            <span className="mr-3 text-lg">📝</span>
            <span className="font-medium">Manage Posts</span>
          </button>

          <button
            onClick={() => onTabChange("reports")}
            className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors duration-200 ${
              activeTab === "reports"
                ? "bg-blue-600 text-white shadow-md"
                : "text-gray-400 hover:bg-gray-800 hover:text-white"
            }`}
          >
            <span className="mr-3 text-lg">🚩</span>
            <span className="font-medium">Manage Reports</span>
          </button>
        </nav>

        <div className="p-4 border-t border-gray-800">
          <button
            onClick={handleSignOut}
            className="w-full flex items-center px-4 py-3 text-red-400 hover:bg-red-900/20 hover:text-red-300 rounded-lg transition-colors"
          >
            <span className="mr-3">🚪</span>
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-8">
        <div className="w-full">{children}</div>
      </main>
    </div>
  );
}
