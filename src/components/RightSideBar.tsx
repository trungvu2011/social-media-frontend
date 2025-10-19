import { Bell, MessageCircle, Settings } from "lucide-react";
import FriendSuggestions from "./FriendSuggestions";

const RightSidebar = () => {
  return (
    <div className="w-72 bg-white border-l border-gray-200 h-screen fixed right-0 top-0 flex flex-col">
      <div className="h-16 w-full border-b border-gray-200">
        <div className="flex items-center gap-2 pl-4 pr-4 content-center h-full justify-between">
          <div className="relative flex w-full items-center justify-between">
            <div className="w-8 h-8 bg-gradient-to-br from-gray-700 to-gray-900 rounded-full"></div>
            <div className="relative gap-4 flex">
              <button className="relative p-2 border hover:bg-gray-100 rounded-full border-gray-300 transition-colors">
                <MessageCircle className="w-5 h-5 text-gray-600" />
              </button>
              <button className="p-2 border hover:bg-gray-100 rounded-full border-gray-300 transition-colors">
                <Bell className="w-5 h-5 text-gray-600" />
              </button>
              <button className="p-2 border hover:bg-gray-100 rounded-full border-gray-300 transition-colors">
                <Settings className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <FriendSuggestions />
    </div>
  );
};

export default RightSidebar;
