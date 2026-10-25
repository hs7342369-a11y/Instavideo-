/**
 * Interactive 24-Hour Story Viewer Modal
 * Includes progress bar timer, story navigation, replies, and reactions.
 */
import React, { useState, useEffect } from 'react';
import { X, Heart, Send, ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { sounds } from '../utils/audio';

export const StoryViewerModal: React.FC = () => {
  const { activeStory, setActiveStory, stories, sendMessage, conversations } = useApp();
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [showHeartBurst, setShowHeartBurst] = useState(false);

  // Current story index
  const currentIndex = stories.findIndex(s => s.id === activeStory?.id);

  useEffect(() => {
    if (!activeStory || isPaused) return;

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          // Go to next story or close
          if (currentIndex < stories.length - 1) {
            setActiveStory(stories[currentIndex + 1]);
            return 0;
          } else {
            setActiveStory(null);
            return 0;
          }
        }
        return prev + 2; // 50 ticks * 100ms = 5000ms
      });
    }, 100);

    return () => clearInterval(interval);
  }, [activeStory, isPaused, currentIndex, stories, setActiveStory]);

  if (!activeStory) return null;

  const handleNext = () => {
    if (currentIndex < stories.length - 1) {
      setActiveStory(stories[currentIndex + 1]);
      setProgress(0);
    } else {
      setActiveStory(null);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setActiveStory(stories[currentIndex - 1]);
      setProgress(0);
    }
  };

  const handleReaction = (emoji: string) => {
    sounds.playLike();
    setShowHeartBurst(true);
    setTimeout(() => setShowHeartBurst(false), 900);

    // Send as message to conversation
    const conv = conversations.find(c => c.participants.some(p => p.username === activeStory.username));
    if (conv) {
      sendMessage(conv.id, `Reacted to your story: ${emoji}`);
    }
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    const conv = conversations.find(c => c.participants.some(p => p.username === activeStory.username));
    if (conv) {
      sendMessage(conv.id, `Replied to your story: "${replyText.trim()}"`);
    }
    setReplyText('');
    handleNext();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center backdrop-blur-md">
      {/* Background click to close */}
      <button
        onClick={() => setActiveStory(null)}
        className="absolute top-4 right-4 text-white/80 hover:text-white p-2 z-50 cursor-pointer"
        aria-label="Close Story"
      >
        <X className="w-7 h-7" />
      </button>

      {/* Main Story Container (Phone Aspect Ratio) */}
      <div
        className="relative w-full max-w-sm h-[88vh] max-h-[820px] rounded-3xl overflow-hidden bg-zinc-900 shadow-2xl flex flex-col justify-between"
        onMouseDown={() => setIsPaused(true)}
        onMouseUp={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      >
        {/* Story Media */}
        <div className="absolute inset-0 z-0">
          <img
            src={activeStory.mediaUrl}
            alt={activeStory.caption || 'Story'}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          {/* Gradients */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80 pointer-events-none" />
        </div>

        {/* Floating Heart Burst */}
        {showHeartBurst && (
          <div className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none animate-ping duration-500">
            <Heart className="w-24 h-24 text-rose-500 fill-rose-500 drop-shadow-lg" />
          </div>
        )}

        {/* Top Header & Progress */}
        <div className="relative z-20 p-4 space-y-3">
          {/* Progress Bars for all stories */}
          <div className="flex items-center gap-1.5">
            {stories.map((s, idx) => (
              <div key={s.id} className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white transition-all duration-100 rounded-full"
                  style={{
                    width:
                      idx < currentIndex
                        ? '100%'
                        : idx === currentIndex
                        ? `${progress}%`
                        : '0%',
                  }}
                />
              </div>
            ))}
          </div>

          {/* User info */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <img
                src={activeStory.userAvatar}
                alt={activeStory.username}
                referrerPolicy="no-referrer"
                className="w-9 h-9 rounded-full object-cover ring-2 ring-rose-500"
              />
              <div>
                <p className="text-sm font-bold text-white leading-tight">@{activeStory.username}</p>
                <p className="text-[11px] text-zinc-300">{activeStory.timestamp} · {activeStory.expiresAt}</p>
              </div>
            </div>

            <button
              onClick={() => setIsPaused(!isPaused)}
              className="text-white/80 hover:text-white p-1 cursor-pointer"
            >
              {isPaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Tap navigation zones */}
        <div className="absolute inset-y-16 inset-x-0 z-10 flex">
          <div className="w-1/3 h-full cursor-pointer" onClick={handlePrev} />
          <div className="w-2/3 h-full cursor-pointer" onClick={handleNext} />
        </div>

        {/* Bottom Interactive Area */}
        <div className="relative z-20 p-4 space-y-3">
          {activeStory.caption && (
            <p className="text-white text-sm font-medium drop-shadow-md bg-black/40 backdrop-blur-xs p-2.5 rounded-xl">
              {activeStory.caption}
            </p>
          )}

          {/* Quick emoji reactions */}
          <div className="flex items-center justify-around py-1">
            {['❤️', '🔥', '👏', '😂', '😍'].map(emoji => (
              <button
                key={emoji}
                onClick={() => handleReaction(emoji)}
                className="text-2xl hover:scale-125 active:scale-95 transition-transform cursor-pointer"
              >
                {emoji}
              </button>
            ))}
          </div>

          {/* Reply input */}
          <form onSubmit={handleSendReply} className="flex items-center gap-2">
            <input
              type="text"
              placeholder={`Reply to @${activeStory.username}...`}
              value={replyText}
              onChange={e => setReplyText(e.target.value)}
              className="flex-1 bg-white/15 backdrop-blur-md border border-white/20 text-white placeholder-zinc-300 text-xs rounded-full px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-rose-400"
            />
            <button
              type="submit"
              className="p-2.5 rounded-full bg-rose-500 text-white hover:bg-rose-600 transition-colors cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Desktop Previous / Next floating arrows */}
        {currentIndex > 0 && (
          <button
            onClick={handlePrev}
            className="hidden md:flex absolute -left-14 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 text-white items-center justify-center cursor-pointer transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}
        {currentIndex < stories.length - 1 && (
          <button
            onClick={handleNext}
            className="hidden md:flex absolute -right-14 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 text-white items-center justify-center cursor-pointer transition-colors"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}
      </div>
    </div>
  );
};
