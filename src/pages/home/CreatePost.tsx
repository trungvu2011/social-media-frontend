import { Smile, Send, Image, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createPost } from "../../utils";

const CreatePost = () => {
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
    // Revoke old previews before replacing
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
      // Reset state after successful post
      setText("");
      images.forEach((p) => URL.revokeObjectURL(p.preview));
      setImages([]);
      if (imgRef.current) imgRef.current.value = "";
    } catch (err) {
      console.error("Create post failed", err);
      // Optional: surface UI error state if desired
    } finally {
      setSubmitting(false);
    }
  };

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      images.forEach((p) => URL.revokeObjectURL(p.preview));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col items-center gap-4 border-b border-gray-200 w-full p-4 bg-white">
      <input
        type="file"
        accept="image/*"
        multiple
        ref={imgRef}
        onChange={onFilesChanged}
        className="hidden"
      />

      {/* 2. Text Input (takes up remaining space) */}
      <form className="flex-1 w-full" onSubmit={onSubmit}>
        <input
          type="text"
          placeholder="🧷 What's on your mind right now?"
          className="w-full bg-transparent outline-none text-lg text-gray-800 placeholder-gray-500"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </form>

      {/* 3. Right-side Icons & Button */}
      <div className="flex items-center gap-4 w-full justify-end">
        <Image
          onClick={onPickImages}
          className="h-6 w-6 text-gray-500 cursor-pointer hover:text-gray-700 transition-colors"
        />
        <Smile className="h-6 w-6 text-gray-500 cursor-pointer hover:text-gray-700 transition-colors" />

        {/* Post Button */}
        <button
          className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-full font-medium text-sm hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={onSubmit}
          disabled={submitting || (!text.trim() && images.length === 0)}
        >
          {submitting ? "Posting..." : "Post"}
          <Send className="h-4 w-4" />
        </button>
      </div>

      {/* Image thumbnails preview */}
      {images.length > 0 && (
        <div className="w-full flex flex-wrap gap-2">
          {images.map((item, idx) => (
            <div key={idx} className="relative">
              <img
                src={item.preview}
                alt={`preview-${idx}`}
                className="max-h-120 max-w-200 h-auto w-auto object-contain rounded border"
              />
              <button
                type="button"
                onClick={() => removeImage(idx)}
                className="absolute -top-2 -right-2 bg-black/60 hover:bg-black/80 text-white rounded-full p-1"
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
