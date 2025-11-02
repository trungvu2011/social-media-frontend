import { useState } from "react";
import { useI18n } from "../../context/I18nContex";

import LoginForm from "../../components/LoginForm";
import NavBar from "../../components/NavBar";

import Layout from "../../components/layout/Layout";
import CreatePost from "../../components/feed/CreatePost";
import Stories from "../../components/feed/Stories";
import Post from "../../components/feed/Post";

import { mockPosts, mockEvents, mockFriendSuggestions, mockStories } from "../../data/mockData";

const HomePage: React.FC = () => {
  return (
    <Layout 
      friendSuggestions={mockFriendSuggestions}
      events={mockEvents}
    >
      {/* Stories */}
      <Stories stories={mockStories} />
      
      {/* Create Post */}
      <CreatePost />
      
      {/* Feed Posts */}
      <div>
        {mockPosts.map((post) => (
          <Post key={post.id} post={post} />
        ))}
      </div>
    </Layout>
  );
};

export default HomePage;
