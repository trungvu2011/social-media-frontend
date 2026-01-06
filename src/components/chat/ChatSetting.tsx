import React from "react";
import {
  User,
  BellOff,
  Search,
  ChevronDown,
  Image as ImageIcon,
  ShieldCheck,
  Settings,
} from "lucide-react";

import { type ChatUser } from "../../utils";

interface ChatSettingProps {
  otherUser?: ChatUser;
}

const ChatSetting = ({ otherUser }: ChatSettingProps) => {
  return (
    <div className="max-w-[350px] w-full bg-white p-4 rounded-xl my-4 shadow-md border border-gray-200">
      {/* Header Section */}
      <div className="flex flex-col items-center mt-4 mb-6">
        <div className="relative w-24 h-24 mb-3">
          {/* Avatar */}
          {otherUser?.avatar ? (
            <img
              src={otherUser.avatar}
              alt={otherUser.fullName || otherUser.userName}
              className="w-24 h-24 rounded-full object-cover"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold text-4xl">
              {(otherUser?.fullName ||
                otherUser?.userName ||
                "? ")[0].toUpperCase()}
            </div>
          )}
        </div>
        <h2 className="text-2xl font-bold">
          {otherUser?.fullName || otherUser?.userName || ""}
        </h2>
        <p className="text-gray-400 text-sm mt-1">Active 2 hours ago</p>
      </div>

      {/* Quick Actions */}
      <div className="flex justify-around mb-8 px-4">
        <ActionButton icon={<User size={22} />} label="Profile" />
        <ActionButton icon={<BellOff size={22} />} label="Notification" />
        <ActionButton icon={<Search size={22} />} label="Search" />
      </div>

      {/* Accordion Menu */}
      <div className="space-y-2">
        <MenuItem
          icon={<Settings size={20} />}
          title="Information and Settings"
        />
        <MenuItem icon={<Settings size={20} />} title="Chat Customization" />
        <MenuItem icon={<ImageIcon size={20} />} title="Media & Files" />
        <MenuItem
          icon={<ShieldCheck size={20} />}
          title="Privacy and Support"
        />
      </div>
    </div>
  );
};

// Sub-component cho các nút tròn phía trên
const ActionButton = ({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) => (
  <div className="flex flex-col items-center gap-2 cursor-pointer group">
    <div className="w-11 h-11 bg-gray-200 rounded-full flex items-center justify-center group-hover:bg-gray-400 transition">
      {icon}
    </div>
    <span className="text-xs text-black text-center w-16 truncate">
      {label}
    </span>
  </div>
);

// Sub-component cho các dòng Menu
const MenuItem = ({
  title,
  active = false,
}: {
  title: string;
  active?: boolean;
  icon?: React.ReactNode;
}) => (
  <div
    className={`
    flex items-center justify-between p-3 rounded-lg cursor-pointer transition
    ${active ? "bg-gray-200" : "hover:bg-gray-100"}
  `}
  >
    <span className="font-semibold text-[15px]">{title}</span>
    <ChevronDown size={20} className="text-gray-400" />
  </div>
);

export default ChatSetting;
