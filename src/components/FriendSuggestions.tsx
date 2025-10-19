import { Plus, ArrowRight, MoreVertical } from "lucide-react";

const suggestions = [
  {
    id: 1,
    name: "Julia Smith",
    username: "@juliasmith",
    avatar: "from-pink-400 to-rose-500",
  },
  {
    id: 2,
    name: "Vermillion D. Gray",
    username: "@vermilliongray",
    avatar: "from-gray-600 to-gray-800",
  },
  {
    id: 3,
    name: "Mai Senpai",
    username: "@maisenpai",
    avatar: "from-blue-400 to-indigo-500",
  },
  {
    id: 4,
    name: "Azumayu U. Wu",
    username: "@azunyandeau",
    avatar: "from-purple-400 to-pink-500",
  },
  {
    id: 5,
    name: "Oarack Babama",
    username: "@obama21",
    avatar: "from-orange-400 to-red-500",
  },
];
const FriendSuggestions = () => {
  return (
    <div className="bg-white m-4 gap-6">
      <div className="flex items-center justify-between mb-4 border-b border-gray-200 pb-4">
        <h2 className="font-semibold text-lg">Friend Suggestions</h2>
        <button className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm">
          <span>See All</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-4">
        {suggestions.map((user) => (
          <div
            key={user.id}
            className="flex items-center gap-3 border-b pb-3 border-gray-200"
          >
            <div
              className={`w-10 h-10 rounded-full bg-gradient-to-br ${user.avatar}`}
            ></div>
            <div className="flex-1 min-w-0 text-lef">
              <div className="font-medium truncate">{user.name}</div>
              <div className="text-sm text-gray-500 truncate">
                {user.username}
              </div>
            </div>
            <button className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
              <Plus className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FriendSuggestions;
