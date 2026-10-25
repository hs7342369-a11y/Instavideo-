/**
 * Notifications Hub & Activity Stream
 * Filters for Likes, Comments, Follows, Mentions, Monetization & System notices.
 */
import React, { useState } from 'react';
import {
  Bell, Heart, MessageSquare, UserPlus, DollarSign, Radio,
  CheckCheck, Sparkles, Filter
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { NotificationItem } from '../types';

export const NotificationsHub: React.FC = () => {
  const { notifications, markNotificationsAsRead, setActiveTab, t } = useApp();
  const [filterType, setFilterType] = useState<string>('all');

  const filteredNotifs = notifications.filter(n => {
    if (filterType === 'all') return true;
    return n.type === filterType;
  });

  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'like':
        return <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />;
      case 'comment':
        return <MessageSquare className="w-4 h-4 text-blue-400" />;
      case 'follow':
        return <UserPlus className="w-4 h-4 text-emerald-400" />;
      case 'monetization':
        return <DollarSign className="w-4 h-4 text-amber-400" />;
      case 'live':
        return <Radio className="w-4 h-4 text-red-500 animate-pulse" />;
      default:
        return <Sparkles className="w-4 h-4 text-purple-400" />;
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto pb-24 pt-2 px-2 sm:px-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
        <div>
          <h1 className="text-lg font-bold text-white font-['Outfit'] flex items-center gap-2">
            <Bell className="w-5 h-5 text-rose-500" />
            {t('nav', 'notifications')}
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Real-time activity on your posts, reels, and payouts
          </p>
        </div>

        <button
          onClick={markNotificationsAsRead}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-semibold cursor-pointer border border-zinc-800 transition-colors"
        >
          <CheckCheck className="w-3.5 h-3.5 text-rose-400" />
          <span>Mark all read</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
        {[
          { id: 'all', label: 'All' },
          { id: 'like', label: 'Likes' },
          { id: 'comment', label: 'Comments' },
          { id: 'follow', label: 'Follows' },
          { id: 'monetization', label: 'Earnings' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setFilterType(tab.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors ${
              filterType === tab.id
                ? 'bg-rose-500 text-white'
                : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Notification Items List */}
      <div className="space-y-2">
        {filteredNotifs.length === 0 ? (
          <div className="text-center py-16 text-zinc-500 text-xs">
            No notifications in this category.
          </div>
        ) : (
          filteredNotifs.map(n => (
            <div
              key={n.id}
              className={`p-3.5 rounded-2xl border transition-colors flex items-center justify-between gap-3 ${
                !n.isRead
                  ? 'bg-zinc-900/90 border-rose-500/30'
                  : 'bg-zinc-900/40 border-zinc-800/80'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="relative shrink-0">
                  <img
                    src={n.actorAvatar}
                    alt={n.actorName}
                    referrerPolicy="no-referrer"
                    className="w-10 h-10 rounded-full object-cover ring-1 ring-zinc-700"
                  />
                  <div className="absolute -bottom-1 -right-1 p-1 rounded-full bg-zinc-950 ring-1 ring-zinc-800">
                    {getIcon(n.type)}
                  </div>
                </div>

                <div className="space-y-0.5">
                  <p className="text-xs text-zinc-200">
                    <span className="font-bold text-white mr-1">{n.actorName}</span>
                    <span>{n.message}</span>
                  </p>
                  <span className="text-[10px] text-zinc-500 block">{n.timestamp}</span>
                </div>
              </div>

              {n.thumbnailUrl && (
                <div className="w-10 h-10 rounded-lg overflow-hidden bg-zinc-950 shrink-0 border border-zinc-800">
                  <img
                    src={n.thumbnailUrl}
                    alt="Thumbnail"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
