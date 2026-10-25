/**
 * Fixed Bottom Navigation Bar for Mobile and Android-First Experience
 * Touch hitbox >= 44x44px, strict 15% sticky height compliance
 */
import React, { useState } from 'react';
import { Home, Compass, Plus, Film, User, Camera, Image, Video } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, currentUser, openCreateModal, t } = useApp();
  const [showCreatePicker, setShowCreatePicker] = useState(false);

  return (
    <>
      {/* Quick Create Popover */}
      {showCreatePicker && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs flex items-end justify-center pb-20 animate-in fade-in duration-150"
          onClick={() => setShowCreatePicker(false)}
        >
          <div
            className="w-11/12 max-w-sm bg-zinc-900 border border-zinc-800 rounded-2xl p-4 shadow-2xl space-y-2 mb-2"
            onClick={e => e.stopPropagation()}
          >
            <div className="text-center font-bold text-sm text-zinc-300 pb-2 border-b border-zinc-800">
              Create New Content
            </div>
            <button
              onClick={() => {
                setShowCreatePicker(false);
                openCreateModal('post');
              }}
              className="w-full flex items-center gap-3 p-3 rounded-xl bg-zinc-800/60 hover:bg-zinc-800 text-left transition-colors cursor-pointer"
            >
              <div className="w-10 h-10 rounded-lg bg-pink-500/20 text-pink-400 flex items-center justify-center">
                <Image className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Photo / Carousel Post</p>
                <p className="text-xs text-zinc-400">Share single photo or album with captions</p>
              </div>
            </button>

            <button
              onClick={() => {
                setShowCreatePicker(false);
                openCreateModal('reel');
              }}
              className="w-full flex items-center gap-3 p-3 rounded-xl bg-zinc-800/60 hover:bg-zinc-800 text-left transition-colors cursor-pointer"
            >
              <div className="w-10 h-10 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center">
                <Video className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Reel / Short Video</p>
                <p className="text-xs text-zinc-400">Upload or record full-screen vertical video</p>
              </div>
            </button>

            <button
              onClick={() => {
                setShowCreatePicker(false);
                openCreateModal('story');
              }}
              className="w-full flex items-center gap-3 p-3 rounded-xl bg-zinc-800/60 hover:bg-zinc-800 text-left transition-colors cursor-pointer"
            >
              <div className="w-10 h-10 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
                <Camera className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">24-Hour Story</p>
                <p className="text-xs text-zinc-400">Disappearing photo or quick clip for followers</p>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* Main Bottom Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-zinc-950/95 backdrop-blur-md border-t border-zinc-800/80 px-2 py-1 max-w-md mx-auto md:max-w-none">
        <div className="flex items-center justify-around h-14 max-w-md mx-auto">
          {/* Home */}
          <button
            onClick={() => setActiveTab('home')}
            className={`min-w-[48px] min-h-[48px] flex flex-col items-center justify-center transition-colors cursor-pointer ${
              activeTab === 'home' ? 'text-rose-500 font-semibold' : 'text-zinc-400 hover:text-zinc-200'
            }`}
            aria-label={t('nav', 'home')}
          >
            <Home className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">{t('nav', 'home')}</span>
          </button>

          {/* Explore */}
          <button
            onClick={() => setActiveTab('explore')}
            className={`min-w-[48px] min-h-[48px] flex flex-col items-center justify-center transition-colors cursor-pointer ${
              activeTab === 'explore' ? 'text-rose-500 font-semibold' : 'text-zinc-400 hover:text-zinc-200'
            }`}
            aria-label={t('nav', 'explore')}
          >
            <Compass className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">{t('nav', 'explore')}</span>
          </button>

          {/* Create Button (+) */}
          <button
            onClick={() => setShowCreatePicker(!showCreatePicker)}
            className="min-w-[48px] min-h-[48px] flex items-center justify-center cursor-pointer group"
            aria-label={t('nav', 'create')}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-500 via-pink-500 to-purple-600 flex items-center justify-center shadow-lg shadow-rose-950/50 group-active:scale-95 transition-transform">
              <Plus className="w-6 h-6 text-white stroke-[2.5]" />
            </div>
          </button>

          {/* Reels */}
          <button
            onClick={() => setActiveTab('reels')}
            className={`min-w-[48px] min-h-[48px] flex flex-col items-center justify-center transition-colors cursor-pointer ${
              activeTab === 'reels' ? 'text-rose-500 font-semibold' : 'text-zinc-400 hover:text-zinc-200'
            }`}
            aria-label={t('nav', 'reels')}
          >
            <Film className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">{t('nav', 'reels')}</span>
          </button>

          {/* Profile */}
          <button
            onClick={() => setActiveTab('profile')}
            className={`min-w-[48px] min-h-[48px] flex flex-col items-center justify-center transition-colors cursor-pointer ${
              activeTab === 'profile' ? 'text-rose-500 font-semibold' : 'text-zinc-400 hover:text-zinc-200'
            }`}
            aria-label={t('nav', 'profile')}
          >
            <div className={`w-6 h-6 rounded-full overflow-hidden ring-1 ${
              activeTab === 'profile' ? 'ring-rose-500' : 'ring-zinc-600'
            }`}>
              <img
                src={currentUser.avatar}
                alt={currentUser.displayName}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-[10px] mt-0.5">{t('nav', 'profile')}</span>
          </button>
        </div>
      </nav>
    </>
  );
};
