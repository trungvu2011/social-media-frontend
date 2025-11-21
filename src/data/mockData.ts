import type { User, Post, Story, FriendSuggestion, Event, Profile } from '../types/social';

export const mockUser: User = {
  id: '1',
  username: 'azunyan',
  displayName: 'Azunyan U. Wu',
  isPro: false,
};

export const mockProfile: Profile = {
  id: '1',
  user: {
    id: '5',
    username: 'xtheobliterator',
    displayName: 'X_AE_C-921',
    avatar: '',
    isVerified: true,
  },
  bio: "Hi there! I'm X-AE-A-19, an AI enthusiast and fitness aficionado. When I'm not crunching numbers or optimizing algorithms, you can find me hitting the gym.",
  location: 'Osaka, Japan',
  website: 'www.slothui.com',
  phone: '+123456789000',
  email: 'hello@slothui.com',
  stats: {
    posts: 548,
    followers: 12700,
    following: 221,
  },
  storyHighlights: ['France', 'Korea', 'USA', 'India', 'Su'],
};

export const mockPosts: Post[] = [
  {
    id: '1',
    user: {
      id: '2',
      username: 'user1',
      displayName: 'user1',
      isVerified: true,
    },
    content: 'Just launched our new product! 🚀 So excited to share this with everyone. #innovation #tech',
    likes: 142,
    comments: 23,
    shares: 8,
    createdAt: '2024-01-15T10:30:00Z',
    isLiked: false,
  },
  {
    id: '2',
    user: {
      id: '3',
      username: 'misierpai',
      displayName: 'Misier Pai',
      isVerified: true,
    },
    content: 'Beautiful sunset today! Sometimes we need to stop and appreciate the little things in life. 🌅',
    image: '/sunset.jpg',
    likes: 89,
    comments: 12,
    shares: 3,
    createdAt: '2024-01-15T08:15:00Z',
    isLiked: true,
  },
  {
    id: '3',
    user: {
      id: '4', 
      username: 'saykotwitt',
      displayName: 'Sayko',
      isVerified: false,
    },
    content: 'Working on some exciting new features for the platform. Can\'t wait to show you all! #coding #webdev',
    likes: 56,
    comments: 7,
    shares: 2,
    createdAt: '2024-01-14T16:45:00Z',
    isLiked: false,
  },
];

export const mockStories: Story[] = [
  {
    id: '1',
    user: {
      id: '5',
      username: 'user1',
      displayName: 'Japan',
    },
    image: '/story1.jpg',
    isViewed: false,
  },
  {
    id: '1',
    user: {
      id: '5',
      username: 'user1',
      displayName: 'France',
    },
    image: '/story2.jpg',
    isViewed: true,
  },
  {
    id: '3',
    user: {
      id: '2',
      username: 'x_se_23b',
      displayName: 'X_se-23b',
    },
    image: '/story3.jpg',
    isViewed: false,
  },
];

export const mockFriendSuggestions: FriendSuggestion[] = [
  {
    id: '1',
    user: {
      id: '6',
      username: 'juliasmith',
      displayName: 'Julia Smith',
    },
    mutualFriends: 15,
  },
  {
    id: '2',
    user: {
      id: '7',
      username: 'vermilliongray',
      displayName: 'Vermillion D. Gray',
    },
    mutualFriends: 8,
  },
];

export const mockEvents: Event[] = [
  {
    id: '1',
    title: "Friend's Birthday",
    date: "Jun 25, 2024",
    type: "birthday"
  },
  {
    id: '2',
    title: "Holiday",
    date: "Jun 28, 2024", 
    type: "holiday"
  },
  {
    id: '3',
    title: "Group Meetup",
    date: "Aug 19, 2024",
    type: "meetup"
  },
];