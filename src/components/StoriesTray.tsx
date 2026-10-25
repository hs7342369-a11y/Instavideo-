/**
 * Top Stories Horizontal Carousel Tray
 */
import React from 'react';
import { Plus } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const StoriesTray: React.FC = () => {
  const { stories, setActiveStory, openCreateModal, currentUser, t } = useApp();

  return (
    <div className="w-full border-b border-zinc-800/60 pb-3 mb-4">
      <div className="flex items-center gap-3.5 overflow-x-auto no-scrollbar px-1 py-1">
        {/* User's Own Story Item */}
        <div className="flex flex-col items-center shrink-0 space-y-1">
          <button
            onClick={() => openCreateModal('story')}
            className="relative group cursor-pointer focus:outline-none"
            aria-label={t('feed', 'addStory')}
          >
            <div className="w-16 h-16 rounded-full p-0.5 ring-2 ring-zinc-700 group-hover:ring-rose-500 transition-all">
              <img
                src={currentUser.avatar}
                alt={currentUser.displayName}
                referrerPolicy="no-referrer"
                className="w-full h-full rounded-full object-cover"
              />
            </div>
            <div className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-rose-500 ring-2 ring-zinc-950 flex items-center justify-center text-white">
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
            </div>
          </button>
          <span className="text-[11px] font-medium text-zinc-300 max-w-[64px] truncate text-center">
            {t('feed', 'addStory')}
          </span>
        </div>

        {/* Stories from creators */}
        {stories.map(story => (
          <div key={story.id} className="flex flex-col items-center shrink-0 space-y-1">
            <button
              onClick={() => setActiveStory(story)}
              className="group cursor-pointer focus:outline-none"
            >
              <div
                className={`w-16 h-16 rounded-full p-[2.5px] transition-transform group-hover:scale-105 active:scale-95 ${
                  story.isSeen
                    ? 'ring-2 ring-zinc-700'
                    : 'bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600'
                }`}
              >
                <div className="w-full h-full rounded-full p-0.5 bg-zinc-950">
                  <img
                    src={story.userAvatar}
                    alt={story.username}
                    referrerPolicy="no-referrer"
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
              </div>
            </button>
            <span className="text-[11px] text-zinc-300 max-w-[64px] truncate text-center">
              @{story.username}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
