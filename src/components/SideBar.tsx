import {
  Home,
  BookOpen,
  Users,
  CreditCard,
  Settings,
  HelpCircle,
  LogOut,
} from "lucide-react";
import AppIcon from "../assets/app_icon.png";

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const menuItems = [
    { id: "feed", icon: Home, label: "Feed", count: 10 },
    { id: "stories", icon: BookOpen, label: "Stories", count: null },
    { id: "friends", icon: Users, label: "Friends", count: 2 },
    {
      id: "subscription",
      icon: CreditCard,
      label: "Subscription",
      count: null,
    },
    { id: "settings", icon: Settings, label: "Settings", count: null },
    { id: "help", icon: HelpCircle, label: "Help & Support", count: null },
  ];

  return (
    <div className="w-72 bg-white border-r border-gray-200 h-screen fixed left-0 top-0 flex flex-col">
      <div className="p-4 border-b border-gray-200 content-center">
        <div className="flex items-center gap-2">
          <img src={AppIcon} alt="Logo" className="w-12 h-12 rounded-full" />
          <span className="font-bold text-xl content-center mb-2">slothui</span>
        </div>
      </div>

      <div className="p-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search..."
            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <nav className="flex-1 px-4 overflow-y-auto">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`w-full flex items-center gap-4 px-3 py-2.5 rounded-lg mb-1 text-sm transition-colors ${
              activeTab === item.id
                ? "bg-gray-100 text-gray-900"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <item.icon className="w-6 h-6" />
            <span className="flex-1 text-left font-bold">{item.label}</span>
            {item.count !== null && (
              <span className="text-xs bg-[#EEF2FF] text-[#4F46E5] px-2 py-0.5 rounded-full border border-[#A5B4FC] font-medium">
                {item.count}
              </span>
            )}
          </button>
        ))}
      </nav>

      <div className="p-3 border-t border-gray-200">
        <div className="flex items-center gap-6">
          <div className="w-10 h-10 bg-gradient-to-br from-gray-700 to-gray-900 rounded-full"></div>
          <div className="flex-1 text-left">
            <div className="text-medium font-medium">John Doe</div>
            <div className="text-sm text-gray-500">Basic Member</div>
          </div>
          <button className="text-gray-400 hover:text-gray-600">
            <LogOut className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
}
