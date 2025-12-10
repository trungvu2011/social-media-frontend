import type { User, Post, Story, FriendSuggestion, Event, Profile, FollowUser } from '../types/social';

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
    images: [],
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
    images: ['/sunset.jpg'],
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
    images: [],
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

export const mockFollowers: FollowUser[] = [
  {
    id: 'f1',
    username: 'kienbigmummy',
    displayName: 'm4n0w4r',
    bio: 'Work hard in silence, let success make the noise.',
    isVerified: false,
    isFollowingBack: true,
  },
  {
    id: 'f2',
    username: 'Rafa_elaelaela',
    displayName: 'Rafa',
    bio: '今天吃什么',
    isVerified: false,
    isFollowingBack: true,
  },
  {
    id: 'f3',
    username: 'Yunouou10',
    displayName: '旱欧欧',
    bio: 'weibo:@旱欧欧 weibo.com/u/2720243414',
    isVerified: false,
    isFollowingBack: false,
  },
  {
    id: 'f4',
    username: 'noland0707',
    displayName: 'Noland',
    bio: '=禾策 | 201 Illustrator | 中文/日本語/English E-mail:hecehece73@163.com/AI',
    isVerified: false,
    isFollowingBack: true,
  },
  {
    id: 'f5',
    username: 'liaoruoxingche1',
    displayName: '云间蓝',
    bio: 'illustrator/Designer -E-mail: 442321044@qq.com',
    isVerified: false,
    isFollowingBack: false,
  },
  {
    id: 'f6',
    username: 'Snooa_o',
    displayName: 'SnooAh',
    bio: '',
    isVerified: false,
    isFollowingBack: true,
  },
];

export const mockFollowing: FollowUser[] = [
  {
    id: 'fl1',
    username: 'user1',
    displayName: 'User One',
    bio: 'Tech enthusiast and developer',
    isVerified: true,
    isFollowingBack: true,
  },
  {
    id: 'fl2',
    username: 'misierpai',
    displayName: 'Misier Pai',
    bio: 'Photographer and traveler',
    isVerified: true,
    isFollowingBack: true,
  },
  {
    id: 'fl3',
    username: 'saykotwitt',
    displayName: 'Sayko',
    bio: 'Web developer and designer',
    isVerified: false,
    isFollowingBack: false,
  },
  {
    id: 'fl4',
    username: 'juliasmith',
    displayName: 'Julia Smith',
    bio: 'Digital marketer',
    isVerified: false,
    isFollowingBack: true,
  },
];