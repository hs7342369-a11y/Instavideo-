/**
 * Instavideo Type Definitions
 */

export type Language = 'en' | 'hi';
export type Theme = 'dark' | 'light';
export type DeviceMode = 'mobile' | 'responsive';
export type ActiveTab = 'home' | 'explore' | 'create' | 'reels' | 'profile' | 'messages' | 'notifications' | 'channel' | 'monetization' | 'admin';

export interface User {
  id: string;
  username: string;
  displayName: string;
  email: string;
  phone?: string;
  avatar: string;
  coverImage?: string;
  bio: string;
  location?: string;
  website?: string;
  isVerified: boolean;
  isPrivate: boolean;
  followersCount: number;
  followingCount: number;
  postsCount: number;
  reelsCount: number;
  isCreator: boolean;
  creatorCategory?: string;
  role: 'user' | 'creator' | 'admin';
  joinedDate: string;
  monetizationEnabled: boolean;
  balanceUSD: number;
  balanceINR: number;
}

export interface Comment {
  id: string;
  postId: string;
  userId: string;
  username: string;
  userAvatar: string;
  isVerified?: boolean;
  text: string;
  timestamp: string;
  likesCount: number;
  isLiked?: boolean;
  replies?: Comment[];
}

export interface Post {
  id: string;
  userId: string;
  username: string;
  userAvatar: string;
  isVerified: boolean;
  caption: string;
  mediaUrls: string[];
  mediaType: 'image' | 'video' | 'carousel';
  location?: string;
  hashtags: string[];
  mentions: string[];
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  savesCount: number;
  viewsCount: number;
  isLiked: boolean;
  isSaved: boolean;
  isReposted?: boolean;
  timestamp: string;
  comments: Comment[];
  category?: string;
}

export interface Reel {
  id: string;
  userId: string;
  username: string;
  userAvatar: string;
  isVerified: boolean;
  videoUrl: string;
  thumbnailUrl: string;
  caption: string;
  audioTrack: {
    title: string;
    artist: string;
    coverUrl?: string;
  };
  hashtags: string[];
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  savesCount: number;
  viewsCount: number;
  isLiked: boolean;
  isSaved: boolean;
  isFollowing?: boolean;
  timestamp: string;
  qualityOptions: string[];
  currentQuality?: string;
}

export interface Story {
  id: string;
  userId: string;
  username: string;
  userAvatar: string;
  mediaUrl: string;
  mediaType: 'image' | 'video';
  caption?: string;
  timestamp: string;
  expiresAt: string;
  isSeen: boolean;
  viewersCount: number;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  text: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'video' | 'audio' | 'reel_preview';
  timestamp: string;
  isRead: boolean;
  reactions?: { [emoji: string]: string[] }; // emoji -> userIds
  replyTo?: {
    id: string;
    text: string;
    senderName: string;
  };
}

export interface Conversation {
  id: string;
  participants: User[];
  isGroup: boolean;
  groupName?: string;
  groupAvatar?: string;
  lastMessage?: ChatMessage;
  unreadCount: number;
  updatedAt: string;
  isTyping?: boolean;
}

export interface NotificationItem {
  id: string;
  userId: string; // target user
  actorId: string;
  actorName: string;
  actorAvatar: string;
  type: 'like' | 'comment' | 'follow' | 'mention' | 'monetization' | 'live' | 'system';
  title: string;
  message: string;
  referenceId?: string; // post, reel, or chat id
  thumbnailUrl?: string;
  timestamp: string;
  isRead: boolean;
}

export interface MonetizationEligibility {
  followersMet: boolean;
  viewsMet: boolean;
  accountAgeMet: boolean;
  guidelinesMet: boolean;
  isEligible: boolean;
  status: 'not_applied' | 'pending' | 'approved' | 'rejected';
}

export interface MonetizationStats {
  estimatedRevenueUSD: number;
  estimatedRevenueINR: number;
  adImpressions: number;
  rpm: number;
  cpm: number;
  subscriberCount: number;
  subscriptionRevenueUSD: number;
  virtualGiftsReceived: number;
  giftRevenueUSD: number;
  platformCommissionPercent: number;
  minPayoutThresholdUSD: number;
}

export interface PayoutRecord {
  id: string;
  amountUSD: number;
  amountINR: number;
  paymentMethod: 'UPI' | 'Bank Transfer' | 'PayPal';
  accountDetails: string;
  status: 'Completed' | 'Processing' | 'Pending';
  date: string;
  transactionRef: string;
}

export interface AdminReport {
  id: string;
  reporterId: string;
  reporterName: string;
  targetType: 'post' | 'reel' | 'user' | 'comment';
  targetId: string;
  targetContent: string;
  reason: 'Spam' | 'Harassment' | 'Hate Speech' | 'Inappropriate Media' | 'Copyright Violation';
  status: 'pending' | 'resolved' | 'dismissed';
  timestamp: string;
}

export interface VerificationRequest {
  id: string;
  userId: string;
  username: string;
  category: string;
  documentType: string;
  status: 'pending' | 'approved' | 'rejected';
  requestDate: string;
}
