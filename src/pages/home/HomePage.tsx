import Layout from "../../components/layout/Layout";
import CreatePost from "../../components/feed/CreatePost";
import Post from "../../components/feed/Post";
import { Link } from "react-router-dom";

import { mockEvents, mockFriendSuggestions, mockPosts, mockStories } from "../../data/mockData";
import { useEffect, useState } from "react";
import { getAllPosts, type BackendPostListItem } from "../../utils";
import type { Post as SocialPost } from "../../types/social";
import Header from "./Header";
import Stories from "../../components/feed/Stories";

const HomePage: React.FC = () => {
  const [feedType, setFeedType] = useState("forYou");
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Map backend post to UI post type expected by <Post/>
  const mapToSocialPost = (p: BackendPostListItem): SocialPost => ({
    id: p._id,
    user: {
      id: p.authorId?._id || "",
      username: p.authorId?.userName || "unknown",
      displayName: p.authorId?.fullName || "Unknown",
      avatar: p.authorId?.avatar,
      isVerified: false,
    },
    content: (p.text ?? p.content ?? "").toString(),
    images: Array.isArray(p.images) ? p.images : [],
    likes: p.likeCount ?? 0,
    comments: p.commentCount ?? 0,
    shares: 0,
    createdAt: p.createdAt,
    isLiked: false,
  });

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await getAllPosts({ page: 1, limit: 5, order: "desc" });
        if (!isMounted) return;
        const mapped = res.data.map(mapToSocialPost);
        setPosts(mapped);
      } catch (e: any) {
        if (!isMounted) return;
        setError(e?.message || "Failed to load posts");
      } finally {
        if (isMounted) setLoading(false);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  console.log("Posts loaded:", posts);

  return (
    <Layout 
      friendSuggestions={mockFriendSuggestions}
      events={mockEvents}
    >
      <Stories stories={mockStories} />
      
      <CreatePost/>
      
      <div>
        {mockPosts.map((post) => (
          <Post key={post.id} post={post} />
        ))}
      </div>
      
    </Layout>
  );
};

export default HomePage;