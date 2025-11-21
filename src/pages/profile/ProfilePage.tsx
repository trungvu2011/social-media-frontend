import React from 'react';
import Layout from '../../components/layout/Layout';
import ProfileHeader from '../../components/profile/ProfileHeader';
import ProfileInfo from '../../components/profile/ProfileInfo';
import ProfilePosts from '../../components/profile/ProfilePosts';
import { mockProfile, mockPosts, mockFriendSuggestions, mockEvents, mockStories } from '../../data/mockData';

const ProfilePage: React.FC = () => {
  // Filter posts to show only user's posts
  const userPosts = mockPosts.filter(post => post.user.id === mockProfile.user.id);
  
  // Filter stories for this user (giả sử user có id '5' có stories)
  const userStories = mockStories.filter(story => story.user.id === mockProfile.user.id);

  return (
    <Layout 
      friendSuggestions={mockFriendSuggestions}
      events={mockEvents}
    >
      <div className="space-y-6">
        <ProfileHeader profile={mockProfile} />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-1">
            <ProfileInfo profile={mockProfile} stories={userStories} />
          </div>
          
          {/* Right Column - Posts */}
          <div className="lg:col-span-2">
            <ProfilePosts posts={userPosts} />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProfilePage;