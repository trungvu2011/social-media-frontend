import { Search, Plus, MessageCircle, Bell, Settings } from "lucide-react";

export default function Header() {
  return (
    <header className=" h-16 bg-white border-b border-gray-200 px-6 py-3 fixed top-0 left-72 right-72 z-10 content-center">
      <div className="flex items-center justify-between">
        <div className="flex-1 max-w-xl">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search for friends, groups, pages"
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex items-center gap-3 ml-6">
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Plus className="w-5 h-5" />
            <span className="text-sm font-medium">Add New Post</span>
          </button>
        </div>
      </div>
    </header>
  );
}
