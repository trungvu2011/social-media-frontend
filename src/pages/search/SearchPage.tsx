import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import {
  getAllPosts,
  searchUsers,
  type BackendPostListItem,
  type UserProfile,
} from "../../utils";
import Layout from "../../components/layout/Layout";
import Post from "../../components/feed/Post";

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [filter, setFilter] = useState<"people" | "post">("people");
  
  const [peopleResults, setPeopleResults] = useState<Partial<UserProfile>[]>([]);
  const [postResults, setPostResults] = useState<BackendPostListItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResults = async () => {
      if (!query.trim()) return;

      setLoading(true);
      setError(null);
      setPeopleResults([]);
      setPostResults([]);

      try {
        if (filter === "people") {
          const res = await searchUsers(query, { limit: 20 });
          setPeopleResults(res.users || []);
        } else {
          // Assuming getAllPosts supports 'search' param as per original Layout code
          const res = await getAllPosts({ search: query, limit: 20 });
          setPostResults(res.data || []);
        }
      } catch (err: any) {
        console.error("Search failed:", err);
        setError("Failed to load search results.");
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query, filter]);

  // UI mapping for posts is handled by Post component, but we need to map BackendPostListItem to SocialPost logic 
  // actually Post component expects 'Post' type. Let's look at how HomePage maps it.
  // HomePage maps it manually. We should duplicate that mapping or extract it. 
  // For now I will import Post and map it inline like HomePage does.

  const mapToSocialPost = (p: BackendPostListItem): any => {
    const mapped: any = {
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
      isLiked: false, 
    };
    
    if (p.sharedPost) {
        mapped.sharedPost = mapToSocialPost(p.sharedPost);
    }
    return mapped;
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto py-6 px-4">
        <h1 className="text-2xl font-bold mb-6">Search Results for "{query}"</h1>

        {/* Filter Tabs */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            onClick={() => setFilter("people")}
            className={`px-6 py-3 font-medium text-sm transition-colors border-b-2 ${
              filter === "people"
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            People
          </button>
          <button
            onClick={() => setFilter("post")}
            className={`px-6 py-3 font-medium text-sm transition-colors border-b-2 ${
              filter === "post"
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Posts
          </button>
        </div>

        {/* Results Area */}
        {loading && <div className="text-center text-gray-500 py-8">Searching...</div>}
        
        {error && <div className="text-center text-red-500 py-8">{error}</div>}

        {!loading && !error && (
          <div className="space-y-4">
            {filter === "people" ? (
              // People Results
              peopleResults.length > 0 ? (
                peopleResults.map((user) => (
                  <div key={user._id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                      {user.avatar ? (
                        <img src={user.avatar} alt={user.userName} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-500 font-bold text-lg">
                          {(user.fullName || user.userName || "?")[0].toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate">{user.fullName || user.userName}</h3>
                      <p className="text-sm text-gray-500 truncate">@{user.userName}</p>
                      {user.bio && <p className="text-sm text-gray-600 mt-1 line-clamp-1">{user.bio}</p>}
                    </div>
                    <Link
                      to={`/profile/${user.userName}`}
                      className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg text-sm font-semibold hover:bg-indigo-100 transition-colors"
                    >
                      View Profile
                    </Link>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500 py-8">No people found.</div>
              )
            ) : (
              // Post Results
              postResults.length > 0 ? (
                postResults.map((post) => (
                  <div key={post._id} className="mb-4">
                     <Post post={mapToSocialPost(post)} />
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500 py-8">No posts found.</div>
              )
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}
