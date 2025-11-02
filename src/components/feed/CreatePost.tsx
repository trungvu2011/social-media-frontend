import { Paperclip, Smile, Mic, Send, Image } from "lucide-react";
import { useRef, useState } from "react";

const CreatePost = () => {
  const [text, setText] = useState("");
  const [img, setImg] = useState(null);
  const imgRef = useRef(null);

  return (
    <div className="flex flex-col items-center gap-4 border-b border-gray-200 w-full p-4 bg-white">
      <input
        type="file"
        accept="image/*"
        ref={imgRef}
        onChange={() => {}}
        className="hidden"
      />

      {/* 2. Text Input (takes up remaining space) */}
      <form className="flex-1 w-full" onSubmit={() => {}}>
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
        <Image className="h-6 w-6 text-gray-500 cursor-pointer hover:text-gray-700 transition-colors" />
        <Smile className="h-6 w-6 text-gray-500 cursor-pointer hover:text-gray-700 transition-colors" />

        {/* Post Button */}
        <button
          className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-full font-medium text-sm hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => {}}
          disabled={!text && !img}
        >
          Post
          <Send className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default CreatePost;
