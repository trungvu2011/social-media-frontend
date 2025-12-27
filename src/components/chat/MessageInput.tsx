import { useState, useCallback, useRef, type KeyboardEvent } from "react";
import { Send } from "lucide-react";

interface MessageInputProps {
  onSendMessage: (content: string) => void;
  onTyping?: () => void;
  disabled?: boolean;
}

export const MessageInput = ({
  onSendMessage,
  onTyping,
  disabled,
}: MessageInputProps) => {
  const [message, setMessage] = useState("");
  const typingTimeoutRef = useRef<number | null>(null);

  const handleTyping = useCallback(() => {
    if (onTyping) {
      onTyping();

      // Clear previous timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      // Set new timeout
      typingTimeoutRef.current = setTimeout(() => {
        // Typing stopped
      }, 3000);
    }
  }, [onTyping]);

  const handleSend = () => {
    if (message.trim() && !disabled) {
      onSendMessage(message);
      setMessage("");

      // Clear typing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    handleTyping();
  };

  return (
    <div className="p-4 border-t border-gray-200 bg-white">
      <div className="flex items-end gap-2">
        <textarea
          value={message}
          onChange={handleChange}
          onKeyPress={handleKeyPress}
          placeholder="Nhập tin nhắn..."
          disabled={disabled}
          rows={1}
          className="flex-1 resize-none border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
          style={{
            maxHeight: "120px",
            minHeight: "40px",
          }}
        />
        <button
          onClick={handleSend}
          disabled={!message.trim() || disabled}
          className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
};
