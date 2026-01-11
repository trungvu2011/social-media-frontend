import { signOut } from "../utils";

export default function BannedPage() {
  
  // Get ban reason from localStorage (set during login)
  const banReason = localStorage.getItem("ban_reason") || "You have violated our community guidelines.";
  const bannedAt = localStorage.getItem("banned_at");

  const handleLogout = async () => {
    await signOut();
    window.location.href = "/login";
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center">
        {/* Icon */}
        <div className="mb-6">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto">
            <svg 
              className="w-12 h-12 text-red-600" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" 
              />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Account Banned
        </h1>

        {/* Message */}
        <div className="mb-6">
          <p className="text-gray-600 mb-4">
            Your account has been suspended and you cannot access the platform.
          </p>
          
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <p className="text-sm font-semibold text-red-800 mb-2">Reason:</p>
            <p className="text-sm text-red-700">{banReason}</p>
          </div>

          {bannedAt && (
            <p className="text-xs text-gray-500">
              Banned on: {new Date(bannedAt).toLocaleDateString()}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={handleLogout}
            className="w-full bg-gray-600 text-white py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
          >
            Logout
          </button>
          
          <p className="text-xs text-gray-500 mt-4">
            If you believe this is a mistake, please contact support.
          </p>
        </div>
      </div>
    </div>
  );
}
