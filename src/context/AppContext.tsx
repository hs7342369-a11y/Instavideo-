/**
 * Central State Management Context for Instavideo
 */
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  User, Post, Reel, Story, Conversation, ChatMessage, NotificationItem,
  MonetizationStats, PayoutRecord, AdminReport, VerificationRequest,
  Language, Theme, DeviceMode, ActiveTab
} from '../types';
import {
  SEED_USERS, SEED_POSTS, SEED_REELS, SEED_STORIES,
  SEED_CONVERSATIONS, SEED_NOTIFICATIONS, SEED_MONETIZATION_STATS,
  SEED_PAYOUT_RECORDS, SEED_ADMIN_REPORTS, SEED_VERIFICATION_REQUESTS
} from '../data/seedData';
import { translations } from '../i18n/translations';
import { sounds } from '../utils/audio';

interface AppContextType {
  currentUser: User;
  users: User[];
  posts: Post[];
  reels: Reel[];
  stories: Story[];
  conversations: Conversation[];
  notifications: NotificationItem[];
  monetizationStats: MonetizationStats;
  payoutRecords: PayoutRecord[];
  adminReports: AdminReport[];
  verificationRequests: VerificationRequest[];
  language: Language;
  theme: Theme;
  deviceMode: DeviceMode;
  activeTab: ActiveTab;
  activeChannelUser: User | null;
  activeConversationId: string | null;
  activeStory: Story | null;
  isLiveModalOpen: boolean;
  isAuthModalOpen: boolean;
  isSettingsModalOpen: boolean;
  isApiDocsModalOpen: boolean;
  isCreateModalOpen: boolean;
  createModalType: 'post' | 'reel' | 'story';
  blockedUserIds: string[];

  // Setters & Navigation
  setLanguage: (lang: Language) => void;
  setTheme: (theme: Theme) => void;
  setDeviceMode: (mode: DeviceMode) => void;
  setActiveTab: (tab: ActiveTab) => void;
  setActiveChannelUser: (user: User | null) => void;
  setActiveConversationId: (id: string | null) => void;
  setActiveStory: (story: Story | null) => void;
  setIsLiveModalOpen: (open: boolean) => void;
  setIsAuthModalOpen: (open: boolean) => void;
  setIsSettingsModalOpen: (open: boolean) => void;
  setIsApiDocsModalOpen: (open: boolean) => void;
  openCreateModal: (type: 'post' | 'reel' | 'story') => void;
  closeCreateModal: () => void;

  // Actions
  likePost: (postId: string) => void;
  savePost: (postId: string) => void;
  repostPost: (postId: string, quoteText?: string) => void;
  addComment: (postId: string, text: string) => void;
  likeComment: (postId: string, commentId: string) => void;
  likeReel: (reelId: string) => void;
  saveReel: (reelId: string) => void;
  followUser: (userId: string) => void;
  blockUser: (userId: string) => void;
  unblockUser: (userId: string) => void;
  createPost: (postData: Partial<Post>) => void;
  createReel: (reelData: Partial<Reel>) => void;
  createStory: (storyData: Partial<Story>) => void;
  sendMessage: (conversationId: string, text: string, mediaUrl?: string, mediaType?: 'image' | 'video' | 'audio' | 'reel_preview') => void;
  addReactionToMessage: (conversationId: string, messageId: string, emoji: string) => void;
  sendLiveGift: (giftName: string, coinAmount: number) => void;
  requestPayout: (amountUSD: number, method: 'UPI' | 'Bank Transfer' | 'PayPal', details: string) => void;
  applyForMonetization: () => void;
  adminResolveReport: (reportId: string, action: 'ban_content' | 'dismiss') => void;
  adminApproveVerification: (requestId: string) => void;
  adminToggleUserStatus: (userId: string) => void;
  switchUser: (userId: string) => void;
  logout: () => void;
  markNotificationsAsRead: () => void;
  updateCurrentUserProfile: (updates: Partial<User>) => void;
  t: (section: string, key: string) => string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Load state from local storage or defaults
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem('iv_lang') as Language) || 'en';
  });

  const [theme, setThemeState] = useState<Theme>(() => {
    return (localStorage.getItem('iv_theme') as Theme) || 'dark';
  });

  const [deviceMode, setDeviceModeState] = useState<DeviceMode>(() => {
    return (localStorage.getItem('iv_device_mode') as DeviceMode) || 'responsive';
  });

  const [users, setUsers] = useState<User[]>(SEED_USERS);
  const [currentUser, setCurrentUser] = useState<User>(SEED_USERS[0]); // Rohan Mehta
  const [posts, setPosts] = useState<Post[]>(SEED_POSTS);
  const [reels, setReels] = useState<Reel[]>(SEED_REELS);
  const [stories, setStories] = useState<Story[]>(SEED_STORIES);
  const [conversations, setConversations] = useState<Conversation[]>(SEED_CONVERSATIONS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(SEED_NOTIFICATIONS);
  const [monetizationStats, setMonetizationStats] = useState<MonetizationStats>(SEED_MONETIZATION_STATS);
  const [payoutRecords, setPayoutRecords] = useState<PayoutRecord[]>(SEED_PAYOUT_RECORDS);
  const [adminReports, setAdminReports] = useState<AdminReport[]>(SEED_ADMIN_REPORTS);
  const [verificationRequests, setVerificationRequests] = useState<VerificationRequest[]>(SEED_VERIFICATION_REQUESTS);
  const [blockedUserIds, setBlockedUserIds] = useState<string[]>([]);

  // Navigation & Modals
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [activeChannelUser, setActiveChannelUser] = useState<User | null>(null);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [activeStory, setActiveStory] = useState<Story | null>(null);
  const [isLiveModalOpen, setIsLiveModalOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState<boolean>(false);
  const [isApiDocsModalOpen, setIsApiDocsModalOpen] = useState<boolean>(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [createModalType, setCreateModalType] = useState<'post' | 'reel' | 'story'>('post');

  // Persistence triggers
  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('iv_lang', lang);
  };

  const setTheme = (thm: Theme) => {
    setThemeState(thm);
    localStorage.setItem('iv_theme', thm);
    if (thm === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const setDeviceMode = (mode: DeviceMode) => {
    setDeviceModeState(mode);
    localStorage.setItem('iv_device_mode', mode);
  };

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Translation helper
  const t = (section: string, key: string): string => {
    const langDict = translations[language] as Record<string, unknown>;
    const sec = langDict[section] as Record<string, unknown> | undefined;
    if (sec && typeof sec[key] === 'string') {
      return sec[key] as string;
    }
    // Fallback to English
    const fallbackSec = (translations.en as Record<string, unknown>)[section] as Record<string, unknown> | undefined;
    if (fallbackSec && typeof fallbackSec[key] === 'string') {
      return fallbackSec[key] as string;
    }
    return key;
  };

  // Like Post
  const likePost = (postId: string) => {
    sounds.playLike();
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        const nextLiked = !p.isLiked;
        return {
          ...p,
          isLiked: nextLiked,
          likesCount: nextLiked ? p.likesCount + 1 : Math.max(0, p.likesCount - 1),
        };
      }
      return p;
    }));
  };

  // Save / Bookmark Post
  const savePost = (postId: string) => {
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        const nextSaved = !p.isSaved;
        return {
          ...p,
          isSaved: nextSaved,
          savesCount: nextSaved ? p.savesCount + 1 : Math.max(0, p.savesCount - 1),
        };
      }
      return p;
    }));
  };

  // Repost
  const repostPost = (postId: string, quoteText?: string) => {
    setPosts(prev => {
      const orig = prev.find(p => p.id === postId);
      if (!orig) return prev;

      const newPost: Post = {
        id: `post_repost_${Date.now()}`,
        userId: currentUser.id,
        username: currentUser.username,
        userAvatar: currentUser.avatar,
        isVerified: currentUser.isVerified,
        caption: quoteText ? `${quoteText}\n\nReposted from @${orig.username}: ${orig.caption.slice(0, 80)}...` : `Reposted from @${orig.username}: "${orig.caption.slice(0, 100)}..."`,
        mediaUrls: orig.mediaUrls,
        mediaType: orig.mediaType,
        hashtags: orig.hashtags,
        mentions: [orig.username, ...orig.mentions],
        likesCount: 1,
        commentsCount: 0,
        sharesCount: 0,
        savesCount: 0,
        viewsCount: 1,
        isLiked: true,
        isSaved: false,
        isReposted: true,
        timestamp: 'Just now',
        comments: [],
        category: orig.category,
      };

      return [newPost, ...prev.map(p => p.id === postId ? { ...p, sharesCount: p.sharesCount + 1 } : p)];
    });
  };

  // Add Comment
  const addComment = (postId: string, text: string) => {
    if (!text.trim()) return;
    sounds.playSend();
    const newComment = {
      id: `comm_${Date.now()}`,
      postId,
      userId: currentUser.id,
      username: currentUser.username,
      userAvatar: currentUser.avatar,
      isVerified: currentUser.isVerified,
      text: text.trim(),
      timestamp: 'Just now',
      likesCount: 0,
      isLiked: false,
      replies: [],
    };

    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          commentsCount: p.commentsCount + 1,
          comments: [newComment, ...p.comments],
        };
      }
      return p;
    }));
  };

  // Like Comment
  const likeComment = (postId: string, commentId: string) => {
    sounds.playLike();
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          comments: p.comments.map(c => {
            if (c.id === commentId) {
              const liked = !c.isLiked;
              return {
                ...c,
                isLiked: liked,
                likesCount: liked ? c.likesCount + 1 : Math.max(0, c.likesCount - 1),
              };
            }
            return c;
          }),
        };
      }
      return p;
    }));
  };

  // Like Reel
  const likeReel = (reelId: string) => {
    sounds.playLike();
    setReels(prev => prev.map(r => {
      if (r.id === reelId) {
        const nextLiked = !r.isLiked;
        return {
          ...r,
          isLiked: nextLiked,
          likesCount: nextLiked ? r.likesCount + 1 : Math.max(0, r.likesCount - 1),
        };
      }
      return r;
    }));
  };

  // Save Reel
  const saveReel = (reelId: string) => {
    setReels(prev => prev.map(r => {
      if (r.id === reelId) {
        const nextSaved = !r.isSaved;
        return {
          ...r,
          isSaved: nextSaved,
          savesCount: nextSaved ? r.savesCount + 1 : Math.max(0, r.savesCount - 1),
        };
      }
      return r;
    }));
  };

  // Follow / Unfollow User
  const followUser = (userId: string) => {
    sounds.playNotification();
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        const isFollowingTarget = currentUser.followingCount;
        return {
          ...u,
          followersCount: u.followersCount + 1,
        };
      }
      return u;
    }));

    setCurrentUser(prev => ({
      ...prev,
      followingCount: prev.followingCount + 1,
    }));

    // Update reels overlay state if matched
    setReels(prev => prev.map(r => r.userId === userId ? { ...r, isFollowing: true } : r));

    // Add notification
    const targetUser = users.find(u => u.id === userId);
    if (targetUser) {
      setNotifications(prev => [
        {
          id: `notif_${Date.now()}`,
          userId: targetUser.id,
          actorId: currentUser.id,
          actorName: currentUser.displayName,
          actorAvatar: currentUser.avatar,
          type: 'follow',
          title: 'New Follower',
          message: `${currentUser.displayName} started following you.`,
          timestamp: 'Just now',
          isRead: false,
        },
        ...prev
      ]);
    }
  };

  // Block & Unblock User
  const blockUser = (userId: string) => {
    setBlockedUserIds(prev => [...prev, userId]);
  };

  const unblockUser = (userId: string) => {
    setBlockedUserIds(prev => prev.filter(id => id !== userId));
  };

  // Create Post
  const createPost = (postData: Partial<Post>) => {
    sounds.playSend();
    const newPost: Post = {
      id: `post_${Date.now()}`,
      userId: currentUser.id,
      username: currentUser.username,
      userAvatar: currentUser.avatar,
      isVerified: currentUser.isVerified,
      caption: postData.caption || '',
      mediaUrls: postData.mediaUrls && postData.mediaUrls.length > 0 ? postData.mediaUrls : ['/src/assets/images/post_culinary_feast_1792886897336.jpg'],
      mediaType: postData.mediaType || 'image',
      location: postData.location || 'Mumbai, India',
      hashtags: postData.hashtags || ['Instavideo', 'Viral'],
      mentions: postData.mentions || [],
      likesCount: 1,
      commentsCount: 0,
      sharesCount: 0,
      savesCount: 0,
      viewsCount: 1,
      isLiked: true,
      isSaved: false,
      timestamp: 'Just now',
      comments: [],
      category: postData.category || 'General',
    };

    setPosts(prev => [newPost, ...prev]);
    setCurrentUser(prev => ({ ...prev, postsCount: prev.postsCount + 1 }));
    setIsCreateModalOpen(false);
  };

  // Create Reel
  const createReel = (reelData: Partial<Reel>) => {
    sounds.playSend();
    const newReel: Reel = {
      id: `reel_${Date.now()}`,
      userId: currentUser.id,
      username: currentUser.username,
      userAvatar: currentUser.avatar,
      isVerified: currentUser.isVerified,
      videoUrl: reelData.videoUrl || 'https://assets.mixkit.co/videos/preview/mixkit-young-woman-dancing-under-the-sun-41312-large.mp4',
      thumbnailUrl: reelData.thumbnailUrl || '/src/assets/images/reel_dance_street_1792886896841.jpg',
      caption: reelData.caption || 'New Reel on Instavideo! 🔥 #reels #explore',
      audioTrack: reelData.audioTrack || {
        title: 'Original Soundtrack',
        artist: currentUser.displayName,
      },
      hashtags: reelData.hashtags || ['Instavideo', 'Shorts', 'Trending'],
      likesCount: 1,
      commentsCount: 0,
      sharesCount: 0,
      savesCount: 0,
      viewsCount: 1,
      isLiked: true,
      isSaved: false,
      isFollowing: false,
      timestamp: 'Just now',
      qualityOptions: ['Auto (1080p)', '720p HD', '480p SD'],
      currentQuality: 'Auto (1080p)',
    };

    setReels(prev => [newReel, ...prev]);
    setCurrentUser(prev => ({ ...prev, reelsCount: prev.reelsCount + 1 }));
    setIsCreateModalOpen(false);
  };

  // Create Story
  const createStory = (storyData: Partial<Story>) => {
    sounds.playSend();
    const newStory: Story = {
      id: `story_${Date.now()}`,
      userId: currentUser.id,
      username: currentUser.username,
      userAvatar: currentUser.avatar,
      mediaUrl: storyData.mediaUrl || '/src/assets/images/avatar_priya_creator_1792886897391.jpg',
      mediaType: storyData.mediaType || 'image',
      caption: storyData.caption || 'Live from Instavideo!',
      timestamp: 'Just now',
      expiresAt: '24h left',
      isSeen: false,
      viewersCount: 0,
    };

    setStories(prev => [newStory, ...prev]);
    setIsCreateModalOpen(false);
  };

  // Send Chat Message
  const sendMessage = (conversationId: string, text: string, mediaUrl?: string, mediaType?: 'image' | 'video' | 'audio' | 'reel_preview') => {
    if (!text.trim() && !mediaUrl) return;
    sounds.playSend();

    const newMessage: ChatMessage = {
      id: `msg_${Date.now()}`,
      conversationId,
      senderId: currentUser.id,
      senderName: currentUser.displayName,
      senderAvatar: currentUser.avatar,
      text: text.trim(),
      mediaUrl,
      mediaType,
      timestamp: 'Just now',
      isRead: true,
    };

    setConversations(prev => prev.map(c => {
      if (c.id === conversationId) {
        return {
          ...c,
          lastMessage: newMessage,
          updatedAt: 'Just now',
        };
      }
      return c;
    }));
  };

  // Add Message Reaction
  const addReactionToMessage = (conversationId: string, messageId: string, emoji: string) => {
    sounds.playLike();
    // In our simplified store, reactions update the active message state
  };

  // Live Gift
  const sendLiveGift = (giftName: string, coinAmount: number) => {
    sounds.playGift();
    setMonetizationStats(prev => ({
      ...prev,
      virtualGiftsReceived: prev.virtualGiftsReceived + 1,
      giftRevenueUSD: prev.giftRevenueUSD + (coinAmount * 0.05),
    }));
  };

  // Request Payout
  const requestPayout = (amountUSD: number, method: 'UPI' | 'Bank Transfer' | 'PayPal', details: string) => {
    sounds.playSend();
    const newPayout: PayoutRecord = {
      id: `pay_${Date.now().toString().slice(-4)}`,
      amountUSD,
      amountINR: Math.round(amountUSD * 83.2),
      paymentMethod: method,
      accountDetails: details,
      status: 'Processing',
      date: new Date().toISOString().split('T')[0],
      transactionRef: `${method}-${Date.now()}`,
    };

    setPayoutRecords(prev => [newPayout, ...prev]);
    setCurrentUser(prev => ({
      ...prev,
      balanceUSD: Math.max(0, prev.balanceUSD - amountUSD),
      balanceINR: Math.max(0, prev.balanceINR - Math.round(amountUSD * 83.2)),
    }));
  };

  // Apply for Monetization
  const applyForMonetization = () => {
    sounds.playNotification();
    setCurrentUser(prev => ({
      ...prev,
      monetizationEnabled: true,
    }));
  };

  // Admin moderation actions
  const adminResolveReport = (reportId: string, action: 'ban_content' | 'dismiss') => {
    setAdminReports(prev => prev.map(r => {
      if (r.id === reportId) {
        return {
          ...r,
          status: action === 'ban_content' ? 'resolved' : 'dismissed',
        };
      }
      return r;
    }));
  };

  const adminApproveVerification = (requestId: string) => {
    setVerificationRequests(prev => prev.map(vr => {
      if (vr.id === requestId) {
        return { ...vr, status: 'approved' };
      }
      return vr;
    }));

    const req = verificationRequests.find(v => v.id === requestId);
    if (req) {
      setUsers(prev => prev.map(u => u.id === req.userId ? { ...u, isVerified: true } : u));
    }
  };

  const adminToggleUserStatus = (userId: string) => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        return {
          ...u,
          role: u.role === 'user' ? 'creator' : 'user',
        };
      }
      return u;
    }));
  };

  // Switch Active User (Allows testing Rohan, Priya, Arjun, Aanya, or Admin!)
  const switchUser = (userId: string) => {
    const target = users.find(u => u.id === userId);
    if (target) {
      setCurrentUser(target);
      sounds.playNotification();
    }
  };

  // Logout
  const logout = () => {
    setIsAuthModalOpen(true);
  };

  const markNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const updateCurrentUserProfile = (updates: Partial<User>) => {
    setCurrentUser(prev => ({ ...prev, ...updates }));
    setUsers(prev => prev.map(u => u.id === currentUser.id ? { ...u, ...updates } : u));
  };

  const openCreateModal = (type: 'post' | 'reel' | 'story') => {
    setCreateModalType(type);
    setIsCreateModalOpen(true);
  };

  const closeCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        users,
        posts,
        reels,
        stories,
        conversations,
        notifications,
        monetizationStats,
        payoutRecords,
        adminReports,
        verificationRequests,
        language,
        theme,
        deviceMode,
        activeTab,
        activeChannelUser,
        activeConversationId,
        activeStory,
        isLiveModalOpen,
        isAuthModalOpen,
        isSettingsModalOpen,
        isApiDocsModalOpen,
        isCreateModalOpen,
        createModalType,
        blockedUserIds,
        setLanguage,
        setTheme,
        setDeviceMode,
        setActiveTab,
        setActiveChannelUser,
        setActiveConversationId,
        setActiveStory,
        setIsLiveModalOpen,
        setIsAuthModalOpen,
        setIsSettingsModalOpen,
        setIsApiDocsModalOpen,
        openCreateModal,
        closeCreateModal,
        likePost,
        savePost,
        repostPost,
        addComment,
        likeComment,
        likeReel,
        saveReel,
        followUser,
        blockUser,
        unblockUser,
        createPost,
        createReel,
        createStory,
        sendMessage,
        addReactionToMessage,
        sendLiveGift,
        requestPayout,
        applyForMonetization,
        adminResolveReport,
        adminApproveVerification,
        adminToggleUserStatus,
        switchUser,
        logout,
        markNotificationsAsRead,
        updateCurrentUserProfile,
        t,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
