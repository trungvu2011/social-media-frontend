import { useState, useEffect } from "react";
import { useSocketContext } from "../../context/SocketContext";
import { RefreshCw } from "lucide-react";
import { useTranslation } from "react-i18next";

interface NewPostsBannerProps {
  onLoadNewPosts: () => void;
}

export const NewPostsBanner = ({ onLoadNewPosts }: NewPostsBannerProps) => {
  const { t } = useTranslation();
  const { socket } = useSocketContext();
  const [newPostCount, setNewPostCount] = useState(0);

  useEffect(() => {
    if (!socket) return;

    const handleNewPostAvailable = () => {
      setNewPostCount((prev) => prev + 1);
    };

    socket.on("feed:new_post_available", handleNewPostAvailable);

    return () => {
      socket.off("feed:new_post_available", handleNewPostAvailable);
    };
  }, [socket]);

  if (newPostCount === 0) return null;

  const handleClick = () => {
    setNewPostCount(0);
    onLoadNewPosts();
  };

  return (
    <div
      onClick={handleClick}
      className="sticky top-0 z-10 bg-blue-500 text-white px-4 py-3 cursor-pointer hover:bg-blue-600 transition-colors flex items-center justify-center gap-2 rounded-lg mb-4 shadow-lg animate-fade-in"
    >
      <RefreshCw size={20} />
      <span className="font-medium">
        {t("Feed.NewPostsAvailable", { count: newPostCount })}
      </span>
      <span className="text-blue-100 text-sm">{t("Feed.ClickToLoad")}</span>
    </div>
  );
};
