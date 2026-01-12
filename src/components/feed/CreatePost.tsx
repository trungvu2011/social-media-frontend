import { Send, Paperclip, Image, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createPost } from "../../utils";
import { useTranslation } from "react-i18next";

const CreatePost = () => {
  const { t } = useTranslation();
  const [text, setText] = useState("");
  const [images, setImages] = useState<Array<{ file: File; preview: string }>>(
    []
  );
  const [submitting, setSubmitting] = useState(false);
  const imgRef = useRef<HTMLInputElement | null>(null);

  const onPickImages = () => {
    imgRef.current?.click();
  };

  const onFilesChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    images.forEach((p) => URL.revokeObjectURL(p.preview));
    const next = files.map((f) => ({
      file: f,
      preview: URL.createObjectURL(f),
    }));
    setImages(next);
  };

  const removeImage = (index: number) => {
    setImages((prev) => {
      const copy = [...prev];
      const [removed] = copy.splice(index, 1);
      if (removed) URL.revokeObjectURL(removed.preview);
      return copy;
    });
  };

  const onSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!text.trim() && images.length === 0) return;
    setSubmitting(true);
    try {
      await createPost(
        text.trim(),
        images.map((i) => i.file)
      );
      setText("");
      images.forEach((p) => URL.revokeObjectURL(p.preview));
      setImages([]);
      if (imgRef.current) imgRef.current.value = "";
      window.location.reload();
    } catch (err) {
      console.error("Create post failed", err);
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    return () => {
      images.forEach((p) => URL.revokeObjectURL(p.preview));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="bg-white p-4">
      <input
        type="file"
        accept="image/*"
        multiple
        ref={imgRef}
        onChange={onFilesChanged}
        className="hidden"
      />

      {/* Input Container */}
      <div className="flex items-center gap-2 sm:gap-3 bg-gray-50 border border-gray-200 rounded-2xl px-2 sm:px-4 py-3">
        {/* Attachment Icon */}
        <button
          type="button"
          onClick={onPickImages}
          className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
        >
          <Paperclip className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        {/* Text Input */}
        <input
          type="text"
          placeholder={t("Feed.CreatePostPlaceholder")}
          className="flex-1 bg-transparent text-gray-700 placeholder-gray-400 text-base focus:outline-none"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onSubmit()}
        />

        {/* Right Icons */}
        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
          <button
            type="button"
            onClick={onPickImages}
            className="p-1.5 sm:p-2 text-gray-400 hover:text-gray-600 rounded-full border border-gray-200 hover:bg-gray-100 transition-colors flex-shrink-0"
          >
            <Image className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          
          <button
            className="flex items-center gap-1 sm:gap-2 bg-indigo-600 text-white px-2 sm:px-5 py-2 sm:py-2.5 rounded-full font-medium text-sm hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
            onClick={() => onSubmit()}
            disabled={submitting || (!text.trim() && images.length === 0)}
          >
            <span className="hidden sm:inline">
              {submitting ? t("Feed.Posting") : t("Feed.PostButton")}
            </span>
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Image Preview */}
      {images.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {images.map((item, idx) => (
            <div key={idx} className="relative">
              <img
                src={item.preview}
                alt={`preview-${idx}`}
                className="h-20 w-20 object-cover rounded-lg border border-gray-200"
              />
              <button
                type="button"
                onClick={() => removeImage(idx)}
                className="absolute -top-2 -right-2 bg-gray-800 hover:bg-gray-900 text-white rounded-full p-1"
                aria-label="Remove image"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CreatePost;
