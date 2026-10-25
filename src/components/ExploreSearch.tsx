/**
 * Advanced Search & Explore Page
 * Features global search, category filters, trending hashtags, suggested creators, and explore media grid.
 */
import React, { useState } from 'react';
import {
  Search, TrendingUp, Users, Film, Image, Hash, Music,
  CheckCircle2, X, Play, Heart, Eye
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ExploreSearch: React.FC = () => {
  const {
    posts, reels, users, currentUser, followUser,
    setActiveChannelUser, setActiveTab, t
  } = useApp();

  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'accounts' | 'reels' | 'posts' | 'tags'>('all');
  const [recentSearches, setRecentSearches] = useState<string[]>([
    '#Himalayas', 'Priya Sharma', '#DelhiEats', 'Aanya Roy', '#CreatorEconomy'
  ]);

  const clearRecent = () => setRecentSearches([]);

  // Filtered accounts
  const filteredUsers = users.filter(u =>
    u.username.toLowerCase().includes(query.toLowerCase()) ||
    u.displayName.toLowerCase().includes(query.toLowerCase()) ||
    (u.creatorCategory && u.creatorCategory.toLowerCase().includes(query.toLowerCase()))
  );

  // Filtered posts
  const filteredPosts = posts.filter(p =>
    p.caption.toLowerCase().includes(query.toLowerCase()) ||
    p.hashtags.some(h => h.toLowerCase().includes(query.toLowerCase())) ||
    p.username.toLowerCase().includes(query.toLowerCase())
  );

  // Filtered reels
  const filteredReels = reels.filter(r =>
    r.caption.toLowerCase().includes(query.toLowerCase()) ||
    r.hashtags.some(h => h.toLowerCase().includes(query.toLowerCase())) ||
    r.audioTrack.title.toLowerCase().includes(query.toLowerCase())
  );

  const trendingTags = [
    { tag: 'InstavideoCreators', count: '1.4M posts', category: 'Community' },
    { tag: 'Himalayas', count: '890K posts', category: 'Travel' },
    { tag: 'DelhiEats', count: '640K posts', category: 'Food' },
    { tag: 'UrbanDance', count: '512K posts', category: 'Entertainment' },
    { tag: 'CreatorEconomy', count: '380K posts', category: 'Business' },
    { tag: 'TechIndia', count: '290K posts', category: 'Technology' },
  ];

  const openCreator = (user: typeof users[0]) => {
    setActiveChannelUser(user);
    setActiveTab('channel');
  };

  return (
    <div className="w-full max-w-4xl mx-auto pb-24 pt-2 px-2 sm:px-4 space-y-6">
      {/* Search Input Bar */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
        <input
          type="text"
          placeholder={t('search', 'searchPlaceholder')}
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-10 pr-10 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-rose-500 transition-all"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
        {[
          { id: 'all', label: t('search', 'all'), icon: null },
          { id: 'accounts', label: t('search', 'accounts'), icon: Users },
          { id: 'reels', label: t('search', 'reels'), icon: Film },
          { id: 'posts', label: t('search', 'posts'), icon: Image },
          { id: 'tags', label: t('search', 'hashtags'), icon: Hash },
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id as typeof activeFilter)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                activeFilter === tab.id
                  ? 'bg-rose-500 text-white shadow-sm'
                  : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
              }`}
            >
              {Icon && <Icon className="w-3.5 h-3.5" />}
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* When no query is typed: Show Trending, Suggested Creators & Recent Searches */}
      {!query && (
        <>
          {/* Suggested Creators Carousel */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-rose-400" />
                Featured Creators
              </h3>
            </div>
            <div className="flex items-center gap-3 overflow-x-auto no-scrollbar py-1">
              {users.filter(u => u.id !== currentUser.id).map(user => (
                <div
                  key={user.id}
                  className="w-44 shrink-0 bg-zinc-900/80 border border-zinc-800 rounded-2xl p-3.5 flex flex-col items-center text-center space-y-2 hover:border-zinc-700 transition-colors"
                >
                  <button onClick={() => openCreator(user)} className="cursor-pointer">
                    <img
                      src={user.avatar}
                      alt={user.displayName}
                      referrerPolicy="no-referrer"
                      className="w-14 h-14 rounded-full object-cover ring-2 ring-rose-500/30"
                    />
                  </button>
                  <div className="w-full">
                    <p className="text-xs font-bold text-white truncate flex items-center justify-center gap-1">
                      {user.displayName}
                      {user.isVerified && <CheckCircle2 className="w-3 h-3 text-rose-500 shrink-0" />}
                    </p>
                    <p className="text-[11px] text-zinc-400 truncate">@{user.username}</p>
                    <p className="text-[10px] text-zinc-500 mt-0.5 truncate">{user.creatorCategory || 'Creator'}</p>
                  </div>
                  <button
                    onClick={() => followUser(user.id)}
                    className="w-full py-1.5 bg-rose-500 hover:bg-rose-600 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                  >
                    Follow
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Trending Hashtags */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-amber-400" />
                {t('search', 'trendingNow')}
              </h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {trendingTags.map(item => (
                <button
                  key={item.tag}
                  onClick={() => setQuery(item.tag)}
                  className="bg-zinc-900/60 border border-zinc-800/80 hover:border-zinc-700 p-3 rounded-xl text-left transition-colors cursor-pointer group"
                >
                  <span className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider block">
                    {item.category}
                  </span>
                  <span className="text-xs font-bold text-zinc-100 group-hover:text-rose-400 transition-colors block">
                    #{item.tag}
                  </span>
                  <span className="text-[10px] text-zinc-400 tabular-nums">
                    {item.count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Recent Searches */}
          {recentSearches.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-zinc-400">
                <span>{t('search', 'recentSearches')}</span>
                <button onClick={clearRecent} className="hover:text-white cursor-pointer">
                  {t('search', 'clearHistory')}
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map(term => (
                  <button
                    key={term}
                    onClick={() => setQuery(term)}
                    className="px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-full text-xs text-zinc-300 hover:text-white hover:border-zinc-700 transition-colors cursor-pointer"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Search Results / Explore Media Grid */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-white">
          {query ? `Results for "${query}"` : t('search', 'exploreGrid')}
        </h3>

        {/* Accounts Result Section (if active) */}
        {(activeFilter === 'all' || activeFilter === 'accounts') && query && filteredUsers.length > 0 && (
          <div className="space-y-2">
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              Creators & Accounts
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {filteredUsers.map(user => (
                <div
                  key={user.id}
                  onClick={() => openCreator(user)}
                  className="flex items-center justify-between p-2.5 bg-zinc-900/60 border border-zinc-800 rounded-xl hover:bg-zinc-800/50 cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <img
                      src={user.avatar}
                      alt={user.displayName}
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="text-xs font-bold text-white flex items-center gap-1">
                        {user.displayName}
                        {user.isVerified && <CheckCircle2 className="w-3 h-3 text-rose-500" />}
                      </p>
                      <p className="text-[11px] text-zinc-400">@{user.username}</p>
                    </div>
                  </div>
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      followUser(user.id);
                    }}
                    className="px-3 py-1 bg-rose-500 text-white text-xs font-semibold rounded-lg hover:bg-rose-600 cursor-pointer"
                  >
                    Follow
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Media Mosaic Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
          {/* Interleave Reels & Posts */}
          {(activeFilter === 'all' || activeFilter === 'reels') &&
            filteredReels.map(reel => (
              <div
                key={reel.id}
                onClick={() => setActiveTab('reels')}
                className="group relative aspect-9/16 bg-zinc-950 rounded-xl overflow-hidden cursor-pointer shadow-md"
              >
                <img
                  src={reel.thumbnailUrl}
                  alt={reel.caption}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

                <div className="absolute top-2 right-2 p-1 rounded-md bg-black/60 text-white">
                  <Play className="w-3.5 h-3.5 fill-white" />
                </div>

                <div className="absolute bottom-2 left-2 right-2 text-white text-xs space-y-1">
                  <p className="font-semibold line-clamp-1">@{reel.username}</p>
                  <div className="flex items-center gap-2 text-[10px] text-zinc-300">
                    <span className="flex items-center gap-0.5">
                      <Eye className="w-3 h-3" />
                      {reel.viewsCount.toLocaleString()}
                    </span>
                    <span className="flex items-center gap-0.5">
                      <Heart className="w-3 h-3" />
                      {reel.likesCount.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}

          {(activeFilter === 'all' || activeFilter === 'posts') &&
            filteredPosts.map(post => (
              <div
                key={post.id}
                onClick={() => setActiveTab('home')}
                className="group relative aspect-square bg-zinc-950 rounded-xl overflow-hidden cursor-pointer shadow-md"
              >
                <img
                  src={post.mediaUrls[0]}
                  alt={post.caption}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 text-white font-semibold text-xs">
                  <span className="flex items-center gap-1">
                    <Heart className="w-4 h-4 fill-white" />
                    {post.likesCount.toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};
