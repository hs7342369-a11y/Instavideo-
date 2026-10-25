/**
 * User Profile & Professional Creator Page
 * Features profile stats, bio, location, website, tabbed content grid (Posts, Reels, Saved),
 * followers/following modal, and edit profile drawer.
 */
import React, { useState } from 'react';
import {
  Grid, Film, Bookmark, Settings, Edit3, CheckCircle2,
  MapPin, Globe, Calendar, DollarSign, Lock, Unlock, Eye, Sparkles
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { User } from '../types';

export const UserProfileView: React.FC = () => {
  const {
    currentUser, posts, reels, users, updateCurrentUserProfile,
    setIsSettingsModalOpen, setActiveTab, setActiveChannelUser, t
  } = useApp();

  const [profileTab, setProfileTab] = useState<'posts' | 'reels' | 'saved'>('posts');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [showFollowModal, setShowFollowModal] = useState<'followers' | 'following' | null>(null);

  // Edit profile form state
  const [editName, setEditName] = useState(currentUser.displayName);
  const [editBio, setEditBio] = useState(currentUser.bio);
  const [editLocation, setEditLocation] = useState(currentUser.location || '');
  const [editWebsite, setEditWebsite] = useState(currentUser.website || '');
  const [isPrivate, setIsPrivate] = useState(currentUser.isPrivate);

  const userPosts = posts.filter(p => p.userId === currentUser.id);
  const userReels = reels.filter(r => r.userId === currentUser.id);
  const savedPosts = posts.filter(p => p.isSaved);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateCurrentUserProfile({
      displayName: editName,
      bio: editBio,
      location: editLocation,
      website: editWebsite,
      isPrivate,
    });
    setIsEditingProfile(false);
  };

  const openCreatorChannel = () => {
    setActiveChannelUser(currentUser);
    setActiveTab('channel');
  };

  return (
    <div className="w-full max-w-4xl mx-auto pb-24 pt-2 px-2 sm:px-4 space-y-4">
      {/* Cover Banner */}
      <div className="relative w-full h-32 sm:h-44 rounded-3xl overflow-hidden bg-zinc-900 border border-zinc-800">
        <img
          src={currentUser.coverImage || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80'}
          alt="Profile Cover"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent" />
      </div>

      {/* Profile Header Details */}
      <div className="px-2 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="flex items-end gap-3.5">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden ring-4 ring-zinc-950 -mt-10 sm:-mt-12 bg-zinc-900 shrink-0 shadow-xl">
              <img
                src={currentUser.avatar}
                alt={currentUser.displayName}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-lg sm:text-xl font-bold text-white font-['Outfit']">
                  {currentUser.displayName}
                </h1>
                {currentUser.isVerified && (
                  <CheckCircle2 className="w-4 h-4 text-rose-500 fill-rose-500/20" />
                )}
                {currentUser.isPrivate && (
                  <Lock className="w-3.5 h-3.5 text-zinc-400" />
                )}
              </div>
              <p className="text-xs text-zinc-400">@{currentUser.username}</p>
            </div>
          </div>

          {/* Quick Profile Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsEditingProfile(true)}
              className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-xs font-semibold text-zinc-200 flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5 text-zinc-400" />
              <span>{t('profile', 'editProfile')}</span>
            </button>

            <button
              onClick={openCreatorChannel}
              className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-xs font-bold text-white shadow-md cursor-pointer transition-transform active:scale-95"
            >
              <span>{t('channel', 'channelTitle')}</span>
            </button>

            <button
              onClick={() => setIsSettingsModalOpen(true)}
              className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white cursor-pointer"
              title={t('profile', 'settings')}
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Bio, Location, Website */}
        <div className="space-y-2 text-xs text-zinc-300">
          <p className="leading-relaxed max-w-xl">{currentUser.bio}</p>

          <div className="flex flex-wrap items-center gap-4 text-zinc-400 text-[11px]">
            {currentUser.location && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-rose-400" />
                {currentUser.location}
              </span>
            )}
            {currentUser.website && (
              <a
                href={currentUser.website}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 text-rose-400 hover:underline"
              >
                <Globe className="w-3.5 h-3.5" />
                {currentUser.website.replace('https://', '')}
              </a>
            )}
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {currentUser.joinedDate}
            </span>
          </div>
        </div>

        {/* Numeric Counts (Tabular Numerals) */}
        <div className="flex items-center justify-around py-3 border-y border-zinc-800/80 text-center">
          <div>
            <span className="text-base font-bold text-white tabular-nums block font-['Outfit']">
              {currentUser.postsCount + currentUser.reelsCount}
            </span>
            <span className="text-[11px] text-zinc-400">{t('profile', 'posts')}</span>
          </div>

          <button
            onClick={() => setShowFollowModal('followers')}
            className="cursor-pointer hover:opacity-80 transition-opacity"
          >
            <span className="text-base font-bold text-white tabular-nums block font-['Outfit']">
              {currentUser.followersCount.toLocaleString()}
            </span>
            <span className="text-[11px] text-zinc-400">{t('profile', 'followers')}</span>
          </button>

          <button
            onClick={() => setShowFollowModal('following')}
            className="cursor-pointer hover:opacity-80 transition-opacity"
          >
            <span className="text-base font-bold text-white tabular-nums block font-['Outfit']">
              {currentUser.followingCount.toLocaleString()}
            </span>
            <span className="text-[11px] text-zinc-400">{t('profile', 'following')}</span>
          </button>
        </div>

        {/* Creator Monetization Quick Access Card */}
        {currentUser.isCreator && (
          <div
            onClick={() => setActiveTab('monetization')}
            className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-zinc-900 to-zinc-900 border border-emerald-500/30 flex items-center justify-between cursor-pointer hover:border-emerald-500/60 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <DollarSign className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-white flex items-center gap-1.5">
                  Creator Earnings Dashboard
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.2 rounded font-semibold">
                    Live
                  </span>
                </p>
                <p className="text-[11px] text-zinc-400">
                  Balance: ₹{currentUser.balanceINR.toLocaleString('en-IN')} (${currentUser.balanceUSD})
                </p>
              </div>
            </div>
            <span className="text-xs text-emerald-400 font-semibold">View Studio →</span>
          </div>
        )}

        {/* Tabs: Posts, Reels, Saved */}
        <div className="flex items-center justify-around border-b border-zinc-800">
          <button
            onClick={() => setProfileTab('posts')}
            className={`py-2.5 text-xs font-semibold flex items-center gap-1.5 border-b-2 -mb-[2px] transition-colors cursor-pointer ${
              profileTab === 'posts'
                ? 'border-rose-500 text-white'
                : 'border-transparent text-zinc-400 hover:text-white'
            }`}
          >
            <Grid className="w-4 h-4" />
            <span>{t('profile', 'posts')}</span>
          </button>

          <button
            onClick={() => setProfileTab('reels')}
            className={`py-2.5 text-xs font-semibold flex items-center gap-1.5 border-b-2 -mb-[2px] transition-colors cursor-pointer ${
              profileTab === 'reels'
                ? 'border-rose-500 text-white'
                : 'border-transparent text-zinc-400 hover:text-white'
            }`}
          >
            <Film className="w-4 h-4" />
            <span>{t('reels', 'reelsTitle')}</span>
          </button>

          <button
            onClick={() => setProfileTab('saved')}
            className={`py-2.5 text-xs font-semibold flex items-center gap-1.5 border-b-2 -mb-[2px] transition-colors cursor-pointer ${
              profileTab === 'saved'
                ? 'border-rose-500 text-white'
                : 'border-transparent text-zinc-400 hover:text-white'
            }`}
          >
            <Bookmark className="w-4 h-4" />
            <span>Saved</span>
          </button>
        </div>

        {/* Tab 1: Posts Grid */}
        {profileTab === 'posts' && (
          <div className="grid grid-cols-3 gap-1 sm:gap-2">
            {userPosts.length === 0 ? (
              <div className="col-span-3 text-center py-12 text-zinc-500 text-xs">
                No posts shared yet. Tap (+) to upload your first photo!
              </div>
            ) : (
              userPosts.map(post => (
                <div
                  key={post.id}
                  className="aspect-square bg-zinc-900 rounded-lg overflow-hidden relative group cursor-pointer"
                >
                  <img
                    src={post.mediaUrls[0]}
                    alt={post.caption}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 2: Reels Grid */}
        {profileTab === 'reels' && (
          <div className="grid grid-cols-3 gap-1 sm:gap-2">
            {userReels.length === 0 ? (
              <div className="col-span-3 text-center py-12 text-zinc-500 text-xs">
                No reels created yet. Tap (+) to record a short!
              </div>
            ) : (
              userReels.map(reel => (
                <div
                  key={reel.id}
                  className="aspect-9/16 bg-zinc-900 rounded-lg overflow-hidden relative group cursor-pointer"
                >
                  <img
                    src={reel.thumbnailUrl}
                    alt={reel.caption}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute bottom-1.5 left-1.5 text-white text-[10px] font-semibold flex items-center gap-0.5">
                    <Eye className="w-3 h-3" />
                    {reel.viewsCount.toLocaleString()}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 3: Saved Items */}
        {profileTab === 'saved' && (
          <div className="grid grid-cols-3 gap-1 sm:gap-2">
            {savedPosts.length === 0 ? (
              <div className="col-span-3 text-center py-12 text-zinc-500 text-xs">
                No saved posts. Bookmark posts from your home feed to see them here.
              </div>
            ) : (
              savedPosts.map(post => (
                <div
                  key={post.id}
                  className="aspect-square bg-zinc-900 rounded-lg overflow-hidden relative group cursor-pointer"
                >
                  <img
                    src={post.mediaUrls[0]}
                    alt={post.caption}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Edit Profile Modal */}
      {isEditingProfile && (
        <div
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={() => setIsEditingProfile(false)}
        >
          <div
            className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-3xl p-5 shadow-2xl space-y-4"
            onClick={e => e.stopPropagation()}
          >
            <h3 className="text-base font-bold text-white">{t('profile', 'editProfile')}</h3>

            <form onSubmit={handleSaveProfile} className="space-y-3 text-xs">
              <div>
                <label className="block text-zinc-400 mb-1">Display Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-rose-500"
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1">Bio</label>
                <textarea
                  value={editBio}
                  onChange={e => setEditBio(e.target.value)}
                  className="w-full h-20 bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white focus:outline-none focus:ring-1 focus:ring-rose-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1">Location</label>
                <input
                  type="text"
                  value={editLocation}
                  onChange={e => setEditLocation(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-rose-500"
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1">Website</label>
                <input
                  type="text"
                  value={editWebsite}
                  onChange={e => setEditWebsite(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-rose-500"
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-zinc-950 rounded-xl border border-zinc-800">
                <div>
                  <p className="font-semibold text-white">Private Account</p>
                  <p className="text-[10px] text-zinc-400">Only approved followers can view your posts</p>
                </div>
                <input
                  type="checkbox"
                  checked={isPrivate}
                  onChange={e => setIsPrivate(e.target.checked)}
                  className="w-4 h-4 accent-rose-500 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(false)}
                  className="px-4 py-2 text-zinc-400 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-xl cursor-pointer"
                >
                  {t('profile', 'saveChanges')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Followers / Following List Modal */}
      {showFollowModal && (
        <div
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={() => setShowFollowModal(null)}
        >
          <div
            className="w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-3xl p-5 shadow-2xl space-y-4 max-h-96 overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
              <h3 className="text-sm font-bold text-white capitalize">
                {showFollowModal}
              </h3>
              <button
                onClick={() => setShowFollowModal(null)}
                className="text-zinc-400 hover:text-white text-xs cursor-pointer"
              >
                Close
              </button>
            </div>

            <div className="space-y-3">
              {users.map(u => (
                <div key={u.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={u.avatar}
                      alt={u.username}
                      referrerPolicy="no-referrer"
                      className="w-9 h-9 rounded-full object-cover"
                    />
                    <div>
                      <p className="text-xs font-bold text-white flex items-center gap-1">
                        {u.displayName}
                        {u.isVerified && <CheckCircle2 className="w-3 h-3 text-rose-500" />}
                      </p>
                      <p className="text-[11px] text-zinc-400">@{u.username}</p>
                    </div>
                  </div>
                  <button className="px-3 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium rounded-lg cursor-pointer">
                    Message
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
