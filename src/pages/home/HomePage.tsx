import Layout from "../../components/layout/Layout";
import CreatePost from "../../components/feed/CreatePost";
import Post from "../../components/feed/Post";

import { useEffect, useState } from "react";
import { getAllPosts, getFollowedPosts, type BackendPostListItem } from "../../utils";
import type { Post as SocialPost } from "../../types/social";
import Header from "./Header";

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

  // Fetch posts when feedType changes
  useEffect(() => {
    let isMounted = true;
    
    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        let res;
        if (feedType === "forYou") {
          // For You: Get all posts
          res = await getAllPosts({ page: 1, limit: 20, order: "desc" });
        } else {
          // Following: Get posts from followed users
          res = await getFollowedPosts();
        }
        
        if (!isMounted) return;
        const mapped = res.data.map(mapToSocialPost);
        setPosts(mapped);
      } catch (e: any) {
        if (!isMounted) return;
        setError(e?.message || "Failed to load posts");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchPosts();
    
    return () => {
      isMounted = false;
    };
  }, [feedType]);

  return (
    <Layout>
      <Header feedType={feedType} setFeedType={setFeedType} />

      {/* Create Post */}
      <CreatePost />

      {/* Feed Posts */}
      <div className="mt-4">
        {loading && (
          <div className="text-center text-gray-500 py-8">
            Loading posts...
          </div>
        )}
        {error && !loading && (
          <div className="text-center text-red-500 py-8">{error}</div>
        )}
        {!loading && !error && posts.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            {feedType === "following" 
              ? "No posts from people you follow yet."
              : "No posts yet. Be the first to post!"}
          </div>
        )}
        {!loading &&
          !error &&
          posts.map((post) => <Post key={post.id} post={post} />)}
      </div>
    </Layout>
  );
};

export default HomePage;