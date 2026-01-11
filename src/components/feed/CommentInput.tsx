import React, { useRef, useState, useEffect } from "react";
import { Send, Image as ImageIcon, X } from "lucide-react";
import type { UserProfile } from "../../utils";

interface CommentInputProps {
  currentUser: UserProfile | null;
  onSubmit: (content: string, image: File | null) => Promise<void>;
  placeholder?: string;
  autoFocus?: boolean;
  onCancel?: () => void;
  className?: string; // Allow custom styling
}

const CommentInput: React.FC<CommentInputProps> = ({
  currentUser,
  onSubmit,
  placeholder = "Write a comment...",
  autoFocus = false,
  className = "",
}) => {
  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoFocus && textareaRef.current) {
        // Small timeout to ensure render is complete
        setTimeout(() => textareaRef.current?.focus(), 50);
    }
  }, [autoFocus]);

  useEffect(() => {
     return () => {
         if (previewUrl) URL.revokeObjectURL(previewUrl);
     }
  }, [previewUrl]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const clearImage = () => {
    setImage(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!content.trim() && !image) || submitting) return;

    try {
      setSubmitting(true);
      await onSubmit(content, image);
      setContent("");
      clearImage();
    } catch (error) {
      console.error("Submit failed", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
        {previewUrl && (
        <div className="mb-2 relative inline-block self-start ml-10">
            <img src={previewUrl} alt="Preview" className="h-20 w-auto rounded-lg border border-gray-200" />
            <button
            onClick={clearImage}
            type="button"
            className="absolute -top-2 -right-2 bg-gray-200 rounded-full p-1 text-gray-600 hover:bg-gray-300"
            >
            <X size={12} />
            </button>
        </div>
        )}
        <form onSubmit={handleSubmit} className="flex items-start gap-2">
            <img
                src={currentUser?.avatar || "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"}
                alt="Avatar"
                className="w-8 h-8 rounded-full object-cover mt-1 flex-shrink-0"
            />
            <div className="flex-1 relative">
                <textarea
                ref={textareaRef}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={placeholder}
                className="w-full bg-gray-100 text-gray-900 rounded-2xl py-2 pl-4 pr-12 focus:outline-none focus:ring-1 focus:ring-gray-300 resize-none min-h-[40px] max-h-32 text-sm"
                rows={1}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSubmit(e);
                    }
                    const target = e.target as HTMLTextAreaElement;
                    target.style.height = 'auto';
                    target.style.height = `${target.scrollHeight}px`;
                }}
                />
                
                {/* Actions inside input area */}
                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageSelect}
                />
                <div className="absolute right-2 bottom-1.5 flex items-center gap-1">
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-full transition"
                    >
                        <ImageIcon size={18} />
                    </button>
                    <button
                        type="submit"
                        disabled={(!content.trim() && !image) || submitting}
                        className="p-1 text-blue-500 hover:bg-blue-50 rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                        <Send size={18} />
                    </button>
                </div>
            </div>

        </form>
    </div>
  );
};

export default CommentInput;
