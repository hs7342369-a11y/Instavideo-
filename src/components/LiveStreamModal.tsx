/**
 * Live Streaming Studio & Viewer Modal
 * Features real-time rolling comments, viewer counter ticker, floating gift bursts,
 * host controls (mute/end stream), and virtual gifts catalog.
 */
import React, { useState, useEffect } from 'react';
import {
  X, Heart, Send, Gift, Users, Eye, Mic, MicOff,
  Video, Sparkles, MessageSquare, Award
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { sounds } from '../utils/audio';

interface LiveComment {
  id: string;
  username: string;
  text: string;
  avatar: string;
  isHost?: boolean;
}

export const LiveStreamModal: React.FC = () => {
  const { isLiveModalOpen, setIsLiveModalOpen, sendLiveGift, currentUser, t } = useApp();

  const [viewerCount, setViewerCount] = useState(1482);
  const [comments, setComments] = useState<LiveComment[]>([
    { id: '1', username: 'priya_creations', text: 'Welcome everyone to today’s creator masterclass! 🚀', avatar: '/src/assets/images/avatar_priya_creator_1792886897391.jpg', isHost: true },
    { id: '2', username: 'arjun_travels', text: 'Joining live from Manali basecamp! 🏔️ Signal is crisp!', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80' },
    { id: '3', username: 'aanya_beats', text: 'Watching your tips on camera stabilization! 🙌', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80' },
  ]);
  const [commentInput, setCommentInput] = useState('');
  const [showGiftsTray, setShowGiftsTray] = useState(false);
  const [floatingHearts, setFloatingHearts] = useState<{ id: number; x: number }[]>([]);
  const [isMuted, setIsMuted] = useState(false);

  // Viewer fluctuation
  useEffect(() => {
    if (!isLiveModalOpen) return;
    const interval = setInterval(() => {
      setViewerCount(prev => prev + Math.floor(Math.random() * 7) - 3);
    }, 2500);
    return () => clearInterval(interval);
  }, [isLiveModalOpen]);

  // Periodic simulated live comments
  useEffect(() => {
    if (!isLiveModalOpen) return;
    const simComments = [
      { username: 'rahul_mumbai', text: 'Audio is super clear! 🔥' },
      { username: 'neha_vlogs', text: 'Sending a virtual super diamond! 💎' },
      { username: 'tech_guru_raj', text: 'How do you structure your 55% ad rev-share?' },
      { username: 'dance_with_simran', text: 'Love the stream quality! ❤️❤️' },
    ];
    let idx = 0;
    const interval = setInterval(() => {
      if (idx < simComments.length) {
        const item = simComments[idx];
        setComments(prev => [
          ...prev.slice(-12),
          {
            id: `c_${Date.now()}`,
            username: item.username,
            text: item.text,
            avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
          }
        ]);
        idx++;
      }
    }, 4000);
    return () => clearInterval(interval);
  }, [isLiveModalOpen]);

  if (!isLiveModalOpen) return null;

  const handleSendComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;

    setComments(prev => [
      ...prev,
      {
        id: `c_${Date.now()}`,
        username: currentUser.username,
        text: commentInput.trim(),
        avatar: currentUser.avatar,
      }
    ]);
    setCommentInput('');
  };

  const spawnHeart = () => {
    sounds.playLike();
    const newHeart = { id: Date.now(), x: Math.random() * 80 + 10 };
    setFloatingHearts(prev => [...prev, newHeart]);
    setTimeout(() => {
      setFloatingHearts(prev => prev.filter(h => h.id !== newHeart.id));
    }, 1500);
  };

  const handleSendGift = (name: string, coins: number) => {
    sendLiveGift(name, coins);
    setShowGiftsTray(false);
    spawnHeart();
    setComments(prev => [
      ...prev,
      {
        id: `gift_${Date.now()}`,
        username: currentUser.username,
        text: `Sent a virtual ${name}! (${coins} coins) 🎁🎉`,
        avatar: currentUser.avatar,
      }
    ]);
  };

  const giftsList = [
    { name: 'Rose', coins: 10, icon: '🌹' },
    { name: 'Firecracker', coins: 50, icon: '🧨' },
    { name: 'Rocket', coins: 100, icon: '🚀' },
    { name: 'Super Diamond', coins: 500, icon: '💎' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-2 sm:p-4">
      {/* Container simulating high quality 1080p live stream */}
      <div className="relative w-full max-w-sm sm:max-w-md h-[90vh] max-h-[820px] rounded-3xl overflow-hidden bg-zinc-950 shadow-2xl flex flex-col justify-between border border-zinc-800">
        {/* Stream Video Backdrop */}
        <div className="absolute inset-0 z-0" onClick={spawnHeart}>
          <img
            src="/src/assets/images/avatar_priya_creator_1792886897391.jpg"
            alt="Live Stream"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/60 pointer-events-none" />

          {/* Floating Hearts Animation */}
          {floatingHearts.map(h => (
            <div
              key={h.id}
              className="absolute bottom-24 pointer-events-none animate-bounce duration-1000"
              style={{ left: `${h.x}%` }}
            >
              <Heart className="w-8 h-8 text-rose-500 fill-rose-500 drop-shadow-lg" />
            </div>
          ))}
        </div>

        {/* Top Overlay: LIVE Badge, Viewer Counter, Close */}
        <div className="relative z-20 p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 px-3 py-1 bg-rose-600 text-white rounded-full text-xs font-bold shadow-lg">
              <span className="w-2 h-2 rounded-full bg-white animate-ping" />
              LIVE
            </span>
            <span className="flex items-center gap-1 px-2.5 py-1 bg-black/50 backdrop-blur-md text-white rounded-full text-xs font-semibold tabular-nums">
              <Eye className="w-3.5 h-3.5" />
              {viewerCount.toLocaleString()}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-2 rounded-full bg-black/40 hover:bg-black/60 text-white cursor-pointer"
            >
              {isMuted ? <MicOff className="w-4 h-4 text-rose-400" /> : <Mic className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setIsLiveModalOpen(false)}
              className="p-2 rounded-full bg-black/40 hover:bg-black/60 text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Bottom Area: Rolling Comments & Gift Bar */}
        <div className="relative z-20 p-4 space-y-3">
          {/* Comments List */}
          <div className="max-h-52 overflow-y-auto space-y-2 no-scrollbar pr-1 flex flex-col justify-end">
            {comments.map(c => (
              <div
                key={c.id}
                className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full text-xs text-white max-w-fit"
              >
                <img
                  src={c.avatar}
                  alt={c.username}
                  referrerPolicy="no-referrer"
                  className="w-5 h-5 rounded-full object-cover shrink-0"
                />
                <span className="font-bold text-rose-300 shrink-0">@{c.username}:</span>
                <span className="truncate">{c.text}</span>
              </div>
            ))}
          </div>

          {/* Interactive Chat Form & Gift Trigger */}
          <div className="flex items-center gap-2">
            <form onSubmit={handleSendComment} className="flex-1 flex items-center gap-2">
              <input
                type="text"
                placeholder={t('live', 'saySomething')}
                value={commentInput}
                onChange={e => setCommentInput(e.target.value)}
                className="flex-1 bg-black/50 backdrop-blur-md border border-white/20 text-white placeholder-zinc-400 text-xs rounded-full px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-rose-500"
              />
              <button
                type="submit"
                className="p-2.5 bg-rose-500 text-white rounded-full hover:bg-rose-600 transition-colors cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

            <button
              onClick={() => setShowGiftsTray(!showGiftsTray)}
              className="p-2.5 rounded-full bg-gradient-to-tr from-amber-500 to-rose-500 text-white shadow-lg cursor-pointer hover:scale-105 active:scale-95 transition-transform"
              title="Send Gift"
            >
              <Gift className="w-5 h-5" />
            </button>

            <button
              onClick={spawnHeart}
              className="p-2.5 rounded-full bg-rose-600/80 text-white hover:bg-rose-600 cursor-pointer active:scale-125 transition-transform"
              title="Tap heart"
            >
              <Heart className="w-5 h-5 fill-white" />
            </button>
          </div>
        </div>

        {/* Virtual Gifts Popover Shelf */}
        {showGiftsTray && (
          <div className="absolute inset-x-0 bottom-16 z-30 bg-zinc-900/95 backdrop-blur-md border-t border-zinc-800 p-4 rounded-t-3xl animate-in slide-in-from-bottom duration-150">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Gift className="w-4 h-4 text-amber-400" />
                Send Creator Virtual Support Gifts
              </span>
              <button
                onClick={() => setShowGiftsTray(false)}
                className="text-xs text-zinc-400 hover:text-white cursor-pointer"
              >
                Close
              </button>
            </div>

            <div className="grid grid-cols-4 gap-2 pt-3">
              {giftsList.map(g => (
                <button
                  key={g.name}
                  onClick={() => handleSendGift(g.name, g.coins)}
                  className="flex flex-col items-center p-2 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-amber-400 transition-colors cursor-pointer"
                >
                  <span className="text-2xl mb-1">{g.icon}</span>
                  <span className="text-[11px] font-bold text-white truncate">{g.name}</span>
                  <span className="text-[10px] text-amber-400 font-semibold">{g.coins} coins</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
