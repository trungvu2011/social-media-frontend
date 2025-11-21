export interface User {
  id: string;
  username: string;
  displayName: string;
  avatar?: string;
  isVerified?: boolean;
  isPro?: boolean;
}

export interface Post {
  id: string;
  user: User;
  content: string;
  image?: string;
  likes: number;
  comments: number;
  shares: number;
  createdAt: string;
  isLiked: boolean;
}

export interface Story {
  id: string;
  user: User;
  image: string;
  isViewed: boolean;
}

export interface FriendSuggestion {
  id: string;
  user: User;
  mutualFriends: number;
}

export interface Event {
  id: string;
  title: string;
  date: string;
  type: 'birthday' | 'holiday' | 'meetup' | 'graduation';
}

export interface Profile {
  id: string;
  user: User;
  bio: string;
  location: string;
  website?: string;
  phone?: string;
  email: string;
  stats: {
    posts: number;
    followers: number;
    following: number;
  };
  storyHighlights: string[];
}