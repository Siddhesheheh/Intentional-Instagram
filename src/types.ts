export interface Story {
  id: string;
  username: string;
  avatar: string;
  mediaUrl: string;
  isViewed: boolean;
  timeAgo: string;
}

export interface Comment {
  id: string;
  username: string;
  avatar: string;
  text: string;
  timeAgo: string;
  likes: number;
  isLiked?: boolean;
}

export interface Post {
  id: string;
  username: string;
  userAvatar: string;
  location?: string;
  mediaUrl: string;
  mediaType: 'image' | 'video';
  caption: string;
  likesCount: number;
  isLiked: boolean;
  isSaved: boolean;
  commentsCount: number;
  timeAgo: string;
  comments: Comment[];
}

export interface Reel {
  id: string;
  username: string;
  userAvatar: string;
  isFollowing?: boolean;
  caption: string;
  audioTrack: string;
  videoUrl: string;
  posterUrl: string;
  likesCount: number;
  isLiked: boolean;
  isSaved: boolean;
  commentsCount: number;
  sharesCount: number;
}

export interface ChatMessage {
  id: string;
  sender: 'me' | 'other';
  text?: string;
  timestamp: string;
  reelAttachment?: Reel;
}

export interface ChatThread {
  id: string;
  username: string;
  name: string;
  avatar: string;
  isOnline: boolean;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  messages: ChatMessage[];
}

export interface UserProfile {
  name: string;
  username: string;
  avatar: string;
  bio: string;
  website: string;
  postsCount: number;
  followersCount: number;
  followingCount: number;
}

export interface ScreenTimeSettings {
  dailyLimitEnabled: boolean;
  dailyLimitSeconds: number; // e.g. 60
  takeBreakEnabled: boolean;
  takeBreakSeconds: number; // e.g. 30
}
