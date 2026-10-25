/**
 * Reels & Short Videos Full-Screen Vertical Player
 * Features auto-play simulation, spinning vinyl audio disk, quality selector,
 * double tap heart pop, creator follow button, comments drawer, and watch-time metrics.
 */
import React, { useState, useRef, useEffect } from 'react';
import {
  Heart, MessageCircle, Share2, Bookmark, Music, CheckCircle2,
  Volume2, VolumeX, Play, Pause, ChevronUp, ChevronDown, Sliders,
  Send, Sparkles
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Reel } from '../types';

export const ReelsFeed: React.FC = () => {
  const {
    reels, likeReel, saveReel, followUser, currentUser,
    setActiveChannelUser, setActiveTab, users, t
  } = useApp();

  const [activeReelIndex, setActiveReelIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [showHeartBurst, setShowHeartBurst] = useState(false);
  const [showQualityMenu, setShowQualityMenu] = useState(false);
  const [selectedQuality, setSelectedQuality] = useState('Auto (1080p)');
  const [showComments, setShowComments] = useState(false);
  const [commentsList, setCommentsList] = useState<{ [reelId: string]: string[] }>({});
  const [commentInput, setCommentInput] = useState('');
  const [watchSeconds, setWatchSeconds] = useState(0);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const currentReel = reels[activeReelIndex] || reels[0];

  // Watch time ticker
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      timer = setInterval(() => {
        setWatchSeconds(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isPlaying]);

  const handleNext = () => {
    if (activeReelIndex < reels.length - 1) {
      setActiveReelIndex(prev => prev + 1);
      setIsPlaying(true);
    }
  };

  const handlePrev = () => {
    if (activeReelIndex > 0) {
      setActiveReelIndex(prev => prev - 1);
      setIsPlaying(true);
    }
  };

  const handleDoubleTap = () => {
    likeReel(currentReel.id);
    setShowHeartBurst(true);
    setTimeout(() => setShowHeartBurst(false), 700);
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play().catch(() => {});
        setIsPlaying(true);
      }
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const openCreatorChannel = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      setActiveChannelUser(user);
      setActiveTab('channel');
    }
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;

    setCommentsList(prev => ({
      ...prev,
      [currentReel.id]: [...(prev[currentReel.id] || []), commentInput.trim()],
    }));
    setCommentInput('');
  };

  if (!currentReel) {
    return (
      <div className="flex items-center justify-center h-[70vh] text-zinc-400">
        No reels available.
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-sm md:max-w-md mx-auto h-[82vh] max-h-[760px] my-1 rounded-3xl overflow-hidden bg-black shadow-2xl flex flex-col justify-between select-none">
      {/* Background Video / Animated Poster */}
      <div
        className="absolute inset-0 z-0 cursor-pointer overflow-hidden"
        onClick={togglePlay}
        onDoubleClick={handleDoubleTap}
      >
        <video
          ref={videoRef}
          src={currentReel.videoUrl}
          poster={currentReel.thumbnailUrl}
          autoPlay
          loop
          muted={isMuted}
          playsInline
          className="w-full h-full object-cover"
        />

        {/* Fallback image backdrop if video loads slowly */}
        <div className="absolute inset-0 -z-10">
          <img
            src={currentReel.thumbnailUrl}
            alt={currentReel.caption}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover blur-xs"
          />
        </div>

        {/* Measured dark scrim gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/90 pointer-events-none" />

        {/* Pause Overlay indicator */}
        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 pointer-events-none">
            <div className="w-16 h-16 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-white">
              <Play className="w-8 h-8 fill-white ml-1" />
            </div>
          </div>
        )}

        {/* Double-tap heart pop */}
        {showHeartBurst && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none animate-ping duration-300 z-30">
            <Heart className="w-28 h-28 text-rose-500 fill-rose-500 drop-shadow-2xl" />
          </div>
        )}
      </div>

      {/* Top Header Overlays: Title, Quality badge, Sound toggle */}
      <div className="relative z-20 p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-['Outfit'] font-bold text-lg text-white tracking-tight drop-shadow-md">
            {t('reels', 'reelsTitle')}
          </span>
          <span className="text-[11px] font-medium text-emerald-400 bg-black/40 backdrop-blur-md px-2 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1">
            <Sparkles className="w-2.5 h-2.5" />
            {watchSeconds}s watched
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Quality Selector */}
          <div className="relative">
            <button
              onClick={e => {
                e.stopPropagation();
                setShowQualityMenu(!showQualityMenu);
              }}
              className="p-2 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md text-white text-xs flex items-center gap-1 cursor-pointer"
            >
              <Sliders className="w-4 h-4" />
              <span className="text-[10px] hidden sm:inline">{selectedQuality.split(' ')[0]}</span>
            </button>

            {showQualityMenu && (
              <div className="absolute right-0 mt-1 w-40 bg-zinc-900 border border-zinc-800 rounded-xl shadow-xl p-1 z-50 text-xs">
                {currentReel.qualityOptions.map(opt => (
                  <button
                    key={opt}
                    onClick={() => {
                      setSelectedQuality(opt);
                      setShowQualityMenu(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
                      selectedQuality === opt ? 'bg-rose-500 text-white font-semibold' : 'text-zinc-300 hover:bg-zinc-800'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Mute Toggle */}
          <button
            onClick={e => {
              e.stopPropagation();
              setIsMuted(!isMuted);
            }}
            className="p-2 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md text-white cursor-pointer"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Up / Down Navigation Chevrons for Desktop / Mouse users */}
      <div className="absolute right-3 top-16 z-20 flex flex-col gap-1 hidden sm:flex">
        <button
          onClick={handlePrev}
          disabled={activeReelIndex === 0}
          className="w-8 h-8 rounded-full bg-black/40 hover:bg-black/70 disabled:opacity-30 text-white flex items-center justify-center cursor-pointer transition-colors"
        >
          <ChevronUp className="w-5 h-5" />
        </button>
        <button
          onClick={handleNext}
          disabled={activeReelIndex === reels.length - 1}
          className="w-8 h-8 rounded-full bg-black/40 hover:bg-black/70 disabled:opacity-30 text-white flex items-center justify-center cursor-pointer transition-colors"
        >
          <ChevronDown className="w-5 h-5" />
        </button>
      </div>

      {/* Right Action Column */}
      <div className="absolute right-3 bottom-24 z-20 flex flex-col items-center space-y-4">
        {/* Like */}
        <button
          onClick={e => {
            e.stopPropagation();
            likeReel(currentReel.id);
          }}
          className="flex flex-col items-center gap-1 cursor-pointer group"
        >
          <div className="w-11 h-11 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white group-active:scale-125 transition-transform">
            <Heart className={`w-6 h-6 ${currentReel.isLiked ? 'text-rose-500 fill-rose-500' : ''}`} />
          </div>
          <span className="text-[11px] font-semibold text-white tabular-nums drop-shadow">
            {currentReel.likesCount.toLocaleString()}
          </span>
        </button>

        {/* Comment */}
        <button
          onClick={e => {
            e.stopPropagation();
            setShowComments(!showComments);
          }}
          className="flex flex-col items-center gap-1 cursor-pointer group"
        >
          <div className="w-11 h-11 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white">
            <MessageCircle className="w-6 h-6" />
          </div>
          <span className="text-[11px] font-semibold text-white tabular-nums drop-shadow">
            {(currentReel.commentsCount + (commentsList[currentReel.id]?.length || 0)).toLocaleString()}
          </span>
        </button>

        {/* Share */}
        <button
          onClick={e => {
            e.stopPropagation();
            navigator.clipboard?.writeText(window.location.origin + `/#reel-${currentReel.id}`);
          }}
          className="flex flex-col items-center gap-1 cursor-pointer"
        >
          <div className="w-11 h-11 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white">
            <Share2 className="w-6 h-6" />
          </div>
          <span className="text-[11px] font-semibold text-white tabular-nums drop-shadow">
            {currentReel.sharesCount.toLocaleString()}
          </span>
        </button>

        {/* Save */}
        <button
          onClick={e => {
            e.stopPropagation();
            saveReel(currentReel.id);
          }}
          className="flex flex-col items-center gap-1 cursor-pointer"
        >
          <div className="w-11 h-11 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white">
            <Bookmark className={`w-6 h-6 ${currentReel.isSaved ? 'text-rose-500 fill-rose-500' : ''}`} />
          </div>
          <span className="text-[11px] font-semibold text-white tabular-nums drop-shadow">
            {currentReel.savesCount.toLocaleString()}
          </span>
        </button>

        {/* Spinning Vinyl Audio Disk */}
        <div className="relative pt-2">
          <div className="w-10 h-10 rounded-full bg-zinc-950 border-2 border-zinc-700 p-1 flex items-center justify-center animate-spin [animation-duration:4s]">
            <img
              src={currentReel.audioTrack.coverUrl || currentReel.thumbnailUrl}
              alt="Track Cover"
              referrerPolicy="no-referrer"
              className="w-full h-full rounded-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Bottom Creator Overlay Info */}
      <div className="relative z-20 p-4 space-y-2.5 max-w-[80%]">
        {/* Creator Identity & Follow */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => openCreatorChannel(currentReel.userId)}
            className="flex items-center gap-2 cursor-pointer focus:outline-none"
          >
            <img
              src={currentReel.userAvatar}
              alt={currentReel.username}
              referrerPolicy="no-referrer"
              className="w-10 h-10 rounded-full object-cover ring-2 ring-rose-500"
            />
            <span className="font-bold text-sm text-white drop-shadow hover:underline flex items-center gap-1">
              @{currentReel.username}
              {currentReel.isVerified && <CheckCircle2 className="w-3.5 h-3.5 text-rose-500 fill-rose-500/20" />}
            </span>
          </button>

          {currentReel.userId !== currentUser.id && (
            <button
              onClick={() => followUser(currentReel.userId)}
              className={`text-xs font-semibold px-3 py-1 rounded-full transition-colors cursor-pointer ${
                currentReel.isFollowing
                  ? 'bg-zinc-800 text-zinc-300'
                  : 'bg-rose-500 text-white hover:bg-rose-600'
              }`}
            >
              {currentReel.isFollowing ? t('reels', 'following') : t('reels', 'follow')}
            </button>
          )}
        </div>

        {/* Caption */}
        <p className="text-xs text-zinc-100 line-clamp-2 drop-shadow font-normal">
          {currentReel.caption}
        </p>

        {/* Audio Track Ticker */}
        <div className="flex items-center gap-2 text-xs text-zinc-300 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full w-fit">
          <Music className="w-3.5 h-3.5 text-rose-400 shrink-0 animate-pulse" />
          <span className="truncate max-w-[200px]">
            {currentReel.audioTrack.title} · {currentReel.audioTrack.artist}
          </span>
        </div>
      </div>

      {/* Comments Drawer Modal */}
      {showComments && (
        <div
          className="absolute inset-x-0 bottom-0 top-1/3 z-40 bg-zinc-950/95 backdrop-blur-md rounded-t-3xl border-t border-zinc-800 p-4 flex flex-col justify-between shadow-2xl animate-in slide-in-from-bottom duration-200"
          onClick={e => e.stopPropagation()}
        >
          <div>
            <div className="w-10 h-1 bg-zinc-700 rounded-full mx-auto mb-3" />
            <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
              <span className="text-sm font-bold text-white">Reel Comments</span>
              <button
                onClick={() => setShowComments(false)}
                className="text-xs text-zinc-400 hover:text-white cursor-pointer"
              >
                Close
              </button>
            </div>

            <div className="overflow-y-auto max-h-56 space-y-3 py-3">
              <div className="text-xs space-y-1">
                <span className="font-semibold text-rose-400">@priya_creations: </span>
                <span className="text-zinc-200">The composition and rhythm on this edit are top notch! 👏</span>
              </div>
              <div className="text-xs space-y-1">
                <span className="font-semibold text-rose-400">@chef_vikram: </span>
                <span className="text-zinc-200">Pure high octane energy 🔥 Love the soundtrack choice!</span>
              </div>
              {(commentsList[currentReel.id] || []).map((comm, idx) => (
                <div key={idx} className="text-xs space-y-1">
                  <span className="font-semibold text-white">@{currentUser.username}: </span>
                  <span className="text-zinc-200">{comm}</span>
                </div>
              ))}
            </div>
          </div>

          <form onSubmit={handleAddComment} className="flex items-center gap-2 pt-2 border-t border-zinc-800">
            <input
              type="text"
              placeholder="Add a comment to this reel..."
              value={commentInput}
              onChange={e => setCommentInput(e.target.value)}
              className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-rose-500"
            />
            <button
              type="submit"
              className="p-2 rounded-xl bg-rose-500 text-white hover:bg-rose-600 transition-colors cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
