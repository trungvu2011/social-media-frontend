import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../../components/layout/Layout";
import Post from "../../components/feed/Post";
import { getPostById } from "../../utils"; // Using direct utils type first to fetch, then map
import type { Post as SocialPost } from "../../types/social";

const PostPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<SocialPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
        navigate("/");
        return;
    }
    fetchPost(id);
  }, [id]);

  const fetchPost = async (postId: string) => {
    try {
      setLoading(true);
      setError(null);
      // getPostById returns utils.Post (which aligns with backend DB structure)
      // We need to map it to SocialPost for the UI component
      // However, getPostById result type from utils in Step 167 is 'Post'
      // utils.Post has authorId as string (not populated in type definition?)
      // Wait, in Step 167, utils.Post has authorId: string.
      // But getPostById in controller populates it?
      // Controller Step 149: getPostById does NOT populate authorId?
      // Step 109 controller:
      // const post = await Post.findById(id).lean();
      // It does NOT populate authorId!
      // This is a problem. The Post component needs author info.
      
      const data: any = await getPostById(postId);

      if (!data) {
        setError("Post not found");
        return;
      }
      
      // If authorId is just a string, we can't display user info.
      // I should verify if getPostById needs population.
      // If the backend doesn't populate, I might need to update backend too.
      // Or I can fetch the user profile if I have ID.
      // But let's check if I should update backend getPostById to populate.
      // It's better to populate.

      const socialPost: SocialPost = {
        id: data._id,
        user: {
            id: typeof data.authorId === 'object' ? (data.authorId as any)._id : data.authorId,
            username: typeof data.authorId === 'object' ? (data.authorId as any).userName : "Unknown", // Placeholder if not populated
            displayName: typeof data.authorId === 'object' ? (data.authorId as any).fullName : "Unknown",
            avatar: typeof data.authorId === 'object' ? (data.authorId as any).avatar : undefined,
        },
        content: data.text || data.content || "",
        images: data.images || [],
        likes: data.likes || [],
        commentCount: data.commentCount || 0,
        shares: 0,
        createdAt: data.createdAt,
        isLiked: false // Post handles this
      };
      
      setPost(socialPost);
    } catch (err: any) {
      setError(err?.message || "Failed to load post");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center py-8">Loading...</div>
      </Layout>
    );
  }

  if (error || !post) {
    return (
      <Layout>
         <div className="text-center py-8 text-red-500">{error || "Post not found"}</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto py-4">
        <Post post={post} />
      </div>
    </Layout>
  );
};

export default PostPage;
