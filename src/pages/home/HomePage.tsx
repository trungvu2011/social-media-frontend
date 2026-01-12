import Layout from "../../components/layout/Layout";
import CreatePost from "../../components/feed/CreatePost";
import Post from "../../components/feed/Post";
import { NewPostsBanner } from "../../components/feed/NewPostsBanner";

import { useEffect, useState } from "react";
import { getAllPosts, getFollowedPosts, type BackendPostListItem } from "../../utils";
import type { Post as SocialPost } from "../../types/social";
import Header from "./Header";
import { useTranslation } from "react-i18next";

const HomePage: React.FC = () => {
  const { t } = useTranslation();
  const [feedType, setFeedType] = useState("forYou");
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Map backend post to UI post type expected by <Post/>
  const mapToSocialPost = (p: BackendPostListItem): SocialPost => {
     const mapped: SocialPost = {
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
      likes: p.likes || [],
      commentCount: p.commentCount ?? 0,
      shares: p.shareCount || 0,
      createdAt: p.createdAt,
      isLiked: false, // Post component handles this via useEffect
    };

    if (p.sharedPost) {
       mapped.sharedPost = mapToSocialPost(p.sharedPost);
    }
    
    return mapped;
  };

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
        setError(e?.message || t("Feed.LoadFailed"));
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchPosts();
    
    return () => {
      isMounted = false;
    };
  }, [feedType, t]);

  const handleLoadNewPosts = async () => {
    try {
      setLoading(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
      
      let res;
      if (feedType === "forYou") {
        res = await getAllPosts({ page: 1, limit: 20, order: "desc" });
      } else {
        res = await getFollowedPosts();
      }
      
      const mapped = res.data.map(mapToSocialPost);
      setPosts(mapped);
    } catch (e) {
      console.error("Failed to refresh feed:", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <Header feedType={feedType} setFeedType={setFeedType} />

      {/* Create Post */}
      <CreatePost />

      {/* New Posts Banner */}
      <NewPostsBanner onLoadNewPosts={handleLoadNewPosts} />

      {/* Feed Posts */}
      <div className="mt-4">
        {loading && (
          <div className="text-center text-gray-500 py-8">
            {t("Feed.LoadingPosts")}
          </div>
        )}
        {error && !loading && (
          <div className="text-center text-red-500 py-8">{error}</div>
        )}
        {!loading && !error && posts.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            {feedType === "following" 
              ? t("Feed.NoFollowedPosts")
              : t("Feed.NoPosts")}
          </div>
        )}
        {!loading &&
          !error &&
          posts.map((post) => (
            <div key={post.id} className="mb-4">
              <Post post={post} />
            </div>
          ))}
      </div>
    </Layout>
  );
};

export default HomePage;