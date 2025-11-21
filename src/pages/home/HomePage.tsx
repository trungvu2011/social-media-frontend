import Layout from "../../components/layout/Layout";
import CreatePost from "../../components/feed/CreatePost";
import Stories from "../../components/feed/Stories";
import Post from "../../components/feed/Post";
import { Link } from "react-router-dom";

import { mockPosts, mockEvents, mockFriendSuggestions, mockStories } from "../../data/mockData";

const HomePage: React.FC = () => {
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