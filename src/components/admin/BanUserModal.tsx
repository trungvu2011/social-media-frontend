import { useState } from "react";

interface BanUserModalProps {
  isOpen: boolean;
  userName: string;
  onConfirm: (reason: string) => void;
  onCancel: () => void;
}

export default function BanUserModal({
  isOpen,
  userName,
  onConfirm,
  onCancel,
}: BanUserModalProps) {
  const [reason, setReason] = useState("");

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (!reason.trim()) {
      alert("Please provide a reason for banning this user");
      return;
    }
    onConfirm(reason);
    setReason("");
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
      onClick={onCancel}
    >
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-semibold mb-4">Ban User: {userName}</h3>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Reason for ban <span className="text-red-500">*</span>
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-red-500 focus:border-red-500"
            rows={4}
            placeholder="Enter the reason for banning this user..."
          />
        </div>

        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors font-semibold"
          >
            🚫 Ban User
          </button>
        </div>
      </div>
    </div>
  );
}
