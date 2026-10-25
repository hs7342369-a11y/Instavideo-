/**
 * Creator Channel Page (YouTube/Instagram style creator hub)
 * Features custom banner, tabs (Home, Videos, Reels, Community, About),
 * membership tiers (Join ₹199/mo), and channel analytics.
 */
import React, { useState } from 'react';
import {
  CheckCircle2, Bell, BellRing, Users, Play, Heart, MessageSquare,
  Share2, Award, Sparkles, ExternalLink, ShieldCheck, DollarSign
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { User, Reel, Post } from '../types';

interface CreatorChannelViewProps {
  user?: User;
}

export const CreatorChannelView: React.FC<CreatorChannelViewProps> = ({ user }) => {
  const {
    activeChannelUser, currentUser, users, posts, reels,
    followUser, setActiveTab, t
  } = useApp();

  const channelUser = user || activeChannelUser || users[1]; // defaults to Priya
  const [activeChannelTab, setActiveChannelTab] = useState<'home' | 'videos' | 'reels' | 'community' | 'about'>('home');
  const [isSubscribed, setIsSubscribed] = useState(true);
  const [bellState, setBellState] = useState<'all' | 'none'>('all');
  const [isMember, setIsMember] = useState(false);
  const [showMembershipModal, setShowMembershipModal] = useState(false);

  // Creator's content
  const creatorPosts = posts.filter(p => p.userId === channelUser.id);
  const creatorReels = reels.filter(r => r.userId === channelUser.id);

  return (
    <div className="w-full max-w-4xl mx-auto pb-24 pt-1 px-2 sm:px-4 space-y-4">
      {/* Channel Banner */}
      <div className="relative w-full h-36 sm:h-52 rounded-3xl overflow-hidden bg-zinc-900 border border-zinc-800">
        <img
          src={channelUser.coverImage || '/src/assets/images/reel_travel_himalayas_1792886895985.jpg'}
          alt="Channel Cover Banner"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/30 to-transparent" />
      </div>

      {/* Channel Header Information */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-2">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-full overflow-hidden ring-4 ring-zinc-950 -mt-10 sm:-mt-12 bg-zinc-900 shrink-0 shadow-xl">
            <img
              src={channelUser.avatar}
              alt={channelUser.displayName}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-white font-['Outfit']">
                {channelUser.displayName}
              </h1>
              {channelUser.isVerified && (
                <CheckCircle2 className="w-4 h-4 text-rose-500 fill-rose-500/20" />
              )}
            </div>

            <p className="text-xs text-zinc-400">
              @{channelUser.username} · {channelUser.followersCount.toLocaleString()} {t('channel', 'subscribers')} · {channelUser.postsCount + channelUser.reelsCount} uploads
            </p>

            <p className="text-xs text-zinc-300 max-w-xl line-clamp-2 pt-0.5">
              {channelUser.bio}
            </p>
          </div>
        </div>

        {/* Subscribe & Membership Actions */}
        <div className="flex items-center gap-2 self-stretch sm:self-auto">
          {/* Join Membership Tier */}
          <button
            onClick={() => setShowMembershipModal(true)}
            className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-rose-400 hover:text-rose-300 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer hover:bg-zinc-800 transition-colors"
          >
            <Award className="w-4 h-4 text-rose-500" />
            <span>{isMember ? 'VIP Member' : t('channel', 'joinMembership')}</span>
          </button>

          {/* Subscribe / Follow Button */}
          <button
            onClick={() => setIsSubscribed(!isSubscribed)}
            className={`flex-1 sm:flex-none px-5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              isSubscribed
                ? 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                : 'bg-rose-500 hover:bg-rose-600 text-white shadow-md shadow-rose-950/50'
            }`}
          >
            {isSubscribed ? t('channel', 'subscribed') : t('channel', 'subscribe')}
          </button>

          {/* Notification Bell */}
          {isSubscribed && (
            <button
              onClick={() => setBellState(bellState === 'all' ? 'none' : 'all')}
              className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white cursor-pointer"
            >
              {bellState === 'all' ? <BellRing className="w-4 h-4 text-rose-400" /> : <Bell className="w-4 h-4" />}
            </button>
          )}
        </div>
      </div>

      {/* Channel Tabs */}
      <div className="flex items-center gap-2 border-b border-zinc-800 pt-2 overflow-x-auto no-scrollbar">
        {(['home', 'videos', 'reels', 'community', 'about'] as const).map(tab => {
          const tabLabels: Record<string, string> = {
            home: 'Home',
            videos: 'Videos',
            reels: 'Reels',
            community: 'Community',
            about: 'About',
          };
          return (
            <button
              key={tab}
              onClick={() => setActiveChannelTab(tab)}
              className={`px-4 py-2 text-xs font-semibold capitalize transition-colors whitespace-nowrap cursor-pointer border-b-2 -mb-[2px] ${
                activeChannelTab === tab
                  ? 'border-rose-500 text-white'
                  : 'border-transparent text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {tabLabels[tab]}
            </button>
          );
        })}
      </div>

      {/* Tab 1: Home (Featured Video + Content Highlights) */}
      {activeChannelTab === 'home' && (
        <div className="space-y-6 pt-2">
          {/* Featured Video Box */}
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-4 space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              {t('channel', 'featuredVideo')}
            </span>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
              <div className="relative aspect-video rounded-xl overflow-hidden bg-black">
                <img
                  src="/src/assets/images/post_culinary_feast_1792886897336.jpg"
                  alt="Featured Video"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-rose-500/90 text-white flex items-center justify-center shadow-lg">
                    <Play className="w-5 h-5 fill-white ml-0.5" />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-base font-bold text-white leading-tight">
                  How Creators Can Build $100K+ Recurring Revenue on Instavideo in 2026
                </h3>
                <p className="text-xs text-zinc-400 line-clamp-3">
                  Comprehensive breakdown of real revenue channels: Ad Revenue splits, channel membership tiers, sponsored brand deals, and direct UPI instantaneous settlements.
                </p>
                <div className="flex items-center gap-3 text-xs text-zinc-500 tabular-nums">
                  <span>142K views</span>
                  <span>·</span>
                  <span>3 days ago</span>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Reels Shelf */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white">Popular Reels</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {creatorReels.map(reel => (
                <div
                  key={reel.id}
                  onClick={() => setActiveTab('reels')}
                  className="relative aspect-9/16 rounded-xl overflow-hidden bg-zinc-900 cursor-pointer group"
                >
                  <img
                    src={reel.thumbnailUrl}
                    alt={reel.caption}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute bottom-2 left-2 right-2 text-white text-xs">
                    <p className="text-[10px] tabular-nums font-semibold flex items-center gap-1">
                      <Play className="w-3 h-3 fill-white" />
                      {reel.viewsCount.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Videos (Grid) */}
      {activeChannelTab === 'videos' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          {creatorPosts.map(post => (
            <div
              key={post.id}
              className="bg-zinc-900/60 border border-zinc-800 rounded-xl overflow-hidden"
            >
              <div className="aspect-video bg-black relative">
                <img
                  src={post.mediaUrls[0]}
                  alt={post.caption}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-3 space-y-1">
                <p className="text-xs font-semibold text-white line-clamp-2">{post.caption}</p>
                <p className="text-[10px] text-zinc-500 tabular-nums">{post.viewsCount.toLocaleString()} views · {post.timestamp}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: Reels */}
      {activeChannelTab === 'reels' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 pt-2">
          {creatorReels.map(reel => (
            <div
              key={reel.id}
              onClick={() => setActiveTab('reels')}
              className="relative aspect-9/16 rounded-xl overflow-hidden bg-zinc-900 cursor-pointer"
            >
              <img
                src={reel.thumbnailUrl}
                alt={reel.caption}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-2 left-2 text-white text-xs tabular-nums">
                {reel.viewsCount.toLocaleString()} views
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 4: Community */}
      {activeChannelTab === 'community' && (
        <div className="space-y-4 pt-2">
          <div className="p-4 bg-zinc-900/70 border border-zinc-800 rounded-2xl space-y-2">
            <div className="flex items-center gap-2">
              <img
                src={channelUser.avatar}
                alt={channelUser.displayName}
                referrerPolicy="no-referrer"
                className="w-8 h-8 rounded-full object-cover"
              />
              <div>
                <p className="text-xs font-bold text-white">@{channelUser.username}</p>
                <p className="text-[10px] text-zinc-400">2 days ago</p>
              </div>
            </div>
            <p className="text-xs text-zinc-200">
              Big thank you to all our subscribers! We just crossed 485K members on Instavideo. What topic should our next masterclass cover? Poll below:
            </p>
            <div className="space-y-1.5 pt-2">
              <div className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs flex justify-between">
                <span>1. Optimizing short video watch-time algorithms</span>
                <span className="font-bold text-rose-400">62%</span>
              </div>
              <div className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs flex justify-between">
                <span>2. Negotiating high-ticket brand collaborations</span>
                <span className="font-bold text-rose-400">38%</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: About */}
      {activeChannelTab === 'about' && (
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 space-y-4 pt-2">
          <h3 className="text-sm font-bold text-white">Channel Details & Verification</h3>
          <p className="text-xs text-zinc-300 leading-relaxed">{channelUser.bio}</p>
          <div className="grid grid-cols-2 gap-4 text-xs border-t border-zinc-800 pt-3">
            <div>
              <span className="text-zinc-500 block">Location</span>
              <span className="text-white font-medium">{channelUser.location || 'India'}</span>
            </div>
            <div>
              <span className="text-zinc-500 block">Category</span>
              <span className="text-white font-medium">{channelUser.creatorCategory}</span>
            </div>
            <div>
              <span className="text-zinc-500 block">Channel Verification</span>
              <span className="text-rose-400 font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Approved Official Creator
              </span>
            </div>
            <div>
              <span className="text-zinc-500 block">Official Website</span>
              <a href={channelUser.website} target="_blank" rel="noreferrer" className="text-rose-400 underline truncate block">
                {channelUser.website}
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Channel Membership Modal */}
      {showMembershipModal && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={() => setShowMembershipModal(false)}
        >
          <div
            className="w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-2xl space-y-4"
            onClick={e => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-500 to-purple-600 flex items-center justify-center text-white mx-auto shadow-lg shadow-rose-950/40">
              <Award className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-base font-bold text-white">
                Join {channelUser.displayName}&apos;s VIP Tier
              </h3>
              <p className="text-xs text-zinc-400">
                Unlock exclusive perks, subscriber badges, and direct priority live Q&As.
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-2 text-xs text-zinc-300">
              <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                <CheckCircle2 className="w-4 h-4" />
                <span>Monthly Creator Masterclasses</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                <CheckCircle2 className="w-4 h-4" />
                <span>Exclusive VIP Badge next to comments</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                <CheckCircle2 className="w-4 h-4" />
                <span>Private Discord & Telegram Group Access</span>
              </div>
            </div>

            <div className="text-center">
              <span className="text-2xl font-bold text-white font-['Outfit']">₹199</span>
              <span className="text-xs text-zinc-400"> / month</span>
            </div>

            <button
              onClick={() => {
                setIsMember(true);
                setShowMembershipModal(false);
              }}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white text-xs font-bold transition-all shadow-md cursor-pointer"
            >
              Confirm Subscription (₹199)
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
