import { Plus, ArrowRight } from "lucide-react";
import type { FriendSuggestion } from "../../types/social";

interface FriendSuggestionsProps {
  suggestions: FriendSuggestion[];
}

const FriendSuggestions = ({ suggestions }: FriendSuggestionsProps) => {
  // Tạo gradient colors cho avatar dựa trên user id
  const getAvatarGradient = (id: string) => {
    const gradients = [
      "from-pink-400 to-rose-500",
      "from-gray-600 to-gray-800",
      "from-blue-400 to-indigo-500",
      "from-purple-400 to-pink-500",
      "from-orange-400 to-red-500",
      "from-green-400 to-teal-500",
      "from-yellow-400 to-orange-500",
    ];
    const index = parseInt(id) % gradients.length;
    return gradients[index];
  };

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
        {suggestions.map((suggestion) => (
          <div
            key={suggestion.id}
            className="flex items-center gap-3 border-b pb-3 border-gray-200"
          >
            <div
              className={`w-10 h-10 rounded-full bg-gradient-to-br ${getAvatarGradient(
                suggestion.id
              )}`}
            ></div>
            <div className="flex-1 min-w-0 text-left">
              <div className="font-medium truncate">
                {suggestion.user.displayName}
              </div>
              <div className="text-sm text-gray-500 truncate">
                @{suggestion.user.username}
              </div>
              {suggestion.mutualFriends > 0 && (
                <div className="text-xs text-gray-400 mt-1">
                  {suggestion.mutualFriends} mutual friends
                </div>
              )}
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
