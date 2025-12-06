import React, { useEffect, useState } from "react";
import Layout from "../../components/layout/Layout";
import ProfileHeader from "../../components/profile/ProfileHeader";
import ProfileInfo from "../../components/profile/ProfileInfo";
import ProfilePosts from "../../components/profile/ProfilePost";
import { mockProfile, mockFriendSuggestions, mockEvents, mockStories, mockPosts } from "../../data/mockData";
import type { Profile, Post as SocialPost } from "../../types/social";
import { useParams } from "react-router-dom";

const ProfilePage: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log("Looking for profile with username:", username);
        console.log("Available mock profile username:", mockProfile.user.username);

        if (username === "xtheobliterator") {
          setProfile(mockProfile);
          
          const userPosts = mockPosts.filter(post => 
            post.user.username === username || 
            post.user.username === "user1" 
          );
          console.log("Found posts:", userPosts.length);
          setPosts(userPosts);
        } 
 
        else if (["user1", "misierpai", "saykotwitt"].includes(username || "")) {
 
          const tempProfile: Profile = {
            id: '2',
            user: {
              id: '2',
              username: username || '',
              displayName: username === "user1" ? "User One" : 
                         username === "misierpai" ? "Misier Pai" : 
                         username === "saykotwitt" ? "Sayko Twitt" : username || '',
              isVerified: username === "misierpai",
            },
            bio: `Hello! I'm ${username}. Welcome to my profile!`,
            location: username === "user1" ? "Tokyo, Japan" : "Unknown",
            website: 'www.example.com',
            phone: '+123456789000',
            email: `${username}@example.com`,
            stats: {
              posts: Math.floor(Math.random() * 100),
              followers: Math.floor(Math.random() * 1000),
              following: Math.floor(Math.random() * 100),
            },
            storyHighlights: ['Travel', 'Food', 'Music', 'Sports'],
          };
          setProfile(tempProfile);
          
          const userPosts = mockPosts.filter(post => 
            post.user.username === username
          );
          setPosts(userPosts);
        }
        else {
          setError(`User @${username} not found in mock data. Try: xtheobliterator, user1, misierpai, saykotwitt`);
        }
      } catch (err: any) {
        if (!isMounted) return;
        setError(err?.message || "Failed to load profile");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchProfileData();

    return () => {
      isMounted = false;
    };
  }, [username]);

  const userStories = mockStories.filter(story => 
    story.user.username === username || 
    (username === "xtheobliterator" && story.user.username === "user1")
  );

  if (loading) {
    return (
      <Layout 
        friendSuggestions={mockFriendSuggestions}
        events={mockEvents}
      >
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading profile...</p>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout 
        friendSuggestions={mockFriendSuggestions}
        events={mockEvents}
      >
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
          <div className="text-red-500 text-xl font-semibold mb-4">Profile Not Found</div>
          <p className="text-gray-600 mb-4">{error}</p>
          <p className="text-gray-500 text-sm">
            Available test users: <br/>
            • <a href="/profile/xtheobliterator" className="text-blue-500 hover:underline">@xtheobliterator</a><br/>
            • <a href="/profile/user1" className="text-blue-500 hover:underline">@user1</a><br/>
            • <a href="/profile/misierpai" className="text-blue-500 hover:underline">@misierpai</a><br/>
            • <a href="/profile/saykotwitt" className="text-blue-500 hover:underline">@saykotwitt</a>
          </p>
        </div>
      </Layout>
    );
  }

  if (!profile) {
    return (
      <Layout 
        friendSuggestions={mockFriendSuggestions}
        events={mockEvents}
      >
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg mb-2">Profile not found</div>
          <p className="text-gray-600">The user @{username} does not exist.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout 
      friendSuggestions={mockFriendSuggestions}
      events={mockEvents}
    >
      <div className="space-y-6">
        <ProfileHeader profile={profile} />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-1">
            <ProfileInfo 
              profile={profile} 
              stories={userStories}
            />
          </div>
          
          {/* Right Column - Posts */}
          <div className="lg:col-span-2">
            <ProfilePosts 
              posts={posts}
              username={username || ""}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProfilePage;