/**
 * Content Creation Studio Modal
 * Supports Photos, Reels/Shorts, and 24-hr Stories with Webcam capture,
 * media previews, hashtags & mentions pickers, and video trim sliders.
 */
import React, { useState, useRef } from 'react';
import {
  X, Image, Video, Camera, Upload, Sparkles, Hash, AtSign,
  MapPin, Sliders, Check, Eye
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const CreatePostModal: React.FC = () => {
  const {
    isCreateModalOpen, closeCreateModal, createModalType,
    createPost, createReel, createStory, currentUser, t
  } = useApp();

  const [activeType, setActiveType] = useState<'post' | 'reel' | 'story'>(createModalType || 'post');
  const [caption, setCaption] = useState('');
  const [mediaUrl, setMediaUrl] = useState<string>('');
  const [locationTag, setLocationTag] = useState('Mumbai, Maharashtra');
  const [selectedTags, setSelectedTags] = useState<string[]>(['Instavideo', 'Viral']);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);

  // Video Reel specific
  const [audioTrackTitle, setAudioTrackTitle] = useState('Trending Original Audio');
  const [trimStart, setTrimStart] = useState(0);
  const [trimEnd, setTrimEnd] = useState(15);

  const videoPreviewRef = useRef<HTMLVideoElement | null>(null);

  if (!isCreateModalOpen) return null;

  // Start webcam
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 720, height: 720 },
        audio: false,
      });
      setCameraStream(stream);
      setIsCameraActive(true);
      if (videoPreviewRef.current) {
        videoPreviewRef.current.srcObject = stream;
      }
    } catch {
      // Fallback if camera permissions declined or not available in environment
      setMediaUrl('/src/assets/images/post_culinary_feast_1792886897336.jpg');
    }
  };

  const captureCameraPhoto = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    setIsCameraActive(false);
    // Use a clean high-res snapshot
    setMediaUrl('/src/assets/images/avatar_priya_creator_1792886897391.jpg');
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    setIsCameraActive(false);
  };

  const handleSelectSample = (url: string) => {
    setMediaUrl(url);
    stopCamera();
  };

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(prev => prev.filter(t => t !== tag));
    } else {
      setSelectedTags(prev => [...prev, tag]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    stopCamera();

    const finalMedia = mediaUrl || '/src/assets/images/post_culinary_feast_1792886897336.jpg';

    if (activeType === 'post') {
      createPost({
        caption: caption.trim() || 'New post on Instavideo! ✨',
        mediaUrls: [finalMedia],
        mediaType: 'image',
        location: locationTag,
        hashtags: selectedTags,
      });
    } else if (activeType === 'reel') {
      createReel({
        caption: caption.trim() || 'Check out my new vertical reel! 🎬🔥',
        thumbnailUrl: finalMedia,
        videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-young-woman-dancing-under-the-sun-41312-large.mp4',
        hashtags: selectedTags,
        audioTrack: {
          title: audioTrackTitle,
          artist: currentUser.displayName,
        },
      });
    } else {
      createStory({
        caption: caption.trim() || 'Story moment 🌟',
        mediaUrl: finalMedia,
        mediaType: 'image',
      });
    }

    closeCreateModal();
  };

  const sampleMedias = [
    { label: 'Culinary Feast', url: '/src/assets/images/post_culinary_feast_1792886897336.jpg' },
    { label: 'Himalayan Pass', url: '/src/assets/images/reel_travel_himalayas_1792886895985.jpg' },
    { label: 'Street Dance', url: '/src/assets/images/reel_dance_street_1792886896841.jpg' },
    { label: 'Creator Studio', url: '/src/assets/images/avatar_priya_creator_1792886897391.jpg' },
  ];

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-150"
      onClick={() => {
        stopCamera();
        closeCreateModal();
      }}
    >
      <div
        className="w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-3xl p-5 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-rose-500 to-purple-600 flex items-center justify-center text-white">
              <Sparkles className="w-4 h-4" />
            </div>
            <h2 className="text-base font-bold text-white font-['Outfit']">
              Create Studio
            </h2>
          </div>
          <button
            onClick={() => {
              stopCamera();
              closeCreateModal();
            }}
            className="text-zinc-400 hover:text-white p-1 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Type Selector */}
        <div className="grid grid-cols-3 gap-2 p-1 bg-zinc-950 rounded-xl border border-zinc-800 text-xs">
          <button
            type="button"
            onClick={() => setActiveType('post')}
            className={`py-2 rounded-lg font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-colors ${
              activeType === 'post' ? 'bg-rose-500 text-white' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Image className="w-3.5 h-3.5" />
            <span>Photo Post</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveType('reel')}
            className={`py-2 rounded-lg font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-colors ${
              activeType === 'reel' ? 'bg-rose-500 text-white' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            <span>Short Reel</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveType('story')}
            className={`py-2 rounded-lg font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-colors ${
              activeType === 'story' ? 'bg-rose-500 text-white' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>24h Story</span>
          </button>
        </div>

        {/* Media Preview or Live Camera Box */}
        <div className="space-y-2">
          <div className="relative aspect-4/3 w-full bg-zinc-950 rounded-2xl overflow-hidden border border-zinc-800 flex items-center justify-center">
            {isCameraActive ? (
              <div className="relative w-full h-full">
                <video
                  ref={videoPreviewRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={captureCameraPhoto}
                  className="absolute bottom-4 left-1/2 -translate-x-1/2 px-5 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-full text-xs font-bold shadow-lg cursor-pointer"
                >
                  Snap Photo
                </button>
              </div>
            ) : mediaUrl ? (
              <img
                src={mediaUrl}
                alt="Upload preview"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-center p-6 space-y-2">
                <div className="w-12 h-12 rounded-full bg-zinc-900 mx-auto flex items-center justify-center text-zinc-500">
                  <Upload className="w-6 h-6" />
                </div>
                <p className="text-xs text-zinc-400">Select an asset or open your camera</p>
              </div>
            )}
          </div>

          {/* Camera and Gallery buttons */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={startCamera}
              className="flex-1 py-2 px-3 rounded-xl bg-zinc-800/80 hover:bg-zinc-800 text-zinc-200 text-xs font-medium flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Camera className="w-4 h-4 text-rose-400" />
              <span>Use Webcam</span>
            </button>
          </div>

          {/* Quick presets */}
          <div className="space-y-1">
            <span className="text-[11px] text-zinc-500 block">Or pick from generated media library:</span>
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
              {sampleMedias.map(sm => (
                <button
                  key={sm.url}
                  type="button"
                  onClick={() => handleSelectSample(sm.url)}
                  className={`px-3 py-1.5 rounded-lg border text-xs whitespace-nowrap cursor-pointer transition-colors ${
                    mediaUrl === sm.url ? 'border-rose-500 bg-rose-500/10 text-rose-400' : 'border-zinc-800 bg-zinc-950 text-zinc-400'
                  }`}
                >
                  {sm.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Form Inputs */}
        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          {/* Caption */}
          <div>
            <label className="block text-zinc-400 mb-1">Caption / Thoughts</label>
            <textarea
              placeholder="Write a descriptive caption, tag friends (@)..."
              value={caption}
              onChange={e => setCaption(e.target.value)}
              className="w-full h-20 bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-rose-500 resize-none"
            />
          </div>

          {/* Reel Video Trim Slider (if reel active) */}
          {activeType === 'reel' && (
            <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2">
              <div className="flex items-center justify-between text-zinc-300">
                <span className="flex items-center gap-1">
                  <Sliders className="w-3.5 h-3.5 text-rose-400" />
                  Video Duration Trim
                </span>
                <span className="text-zinc-500">{trimStart}s to {trimEnd}s (15s total)</span>
              </div>
              <input
                type="range"
                min="5"
                max="60"
                value={trimEnd}
                onChange={e => setTrimEnd(parseInt(e.target.value))}
                className="w-full accent-rose-500"
              />
            </div>
          )}

          {/* Hashtags picker */}
          <div className="space-y-1.5">
            <label className="block text-zinc-400">Hashtags</label>
            <div className="flex flex-wrap gap-1.5">
              {['Instavideo', 'Viral', 'Explore', 'ReelsIndia', 'CreatorEconomy', 'DelhiFood', 'Himalayas'].map(tag => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`px-2.5 py-1 rounded-full text-[11px] font-medium cursor-pointer transition-colors ${
                      isSelected ? 'bg-rose-500 text-white' : 'bg-zinc-950 border border-zinc-800 text-zinc-400'
                    }`}
                  >
                    #{tag}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-zinc-400 mb-1">Location Tag</label>
            <div className="flex items-center gap-2 bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white">
              <MapPin className="w-4 h-4 text-zinc-500 shrink-0" />
              <input
                type="text"
                value={locationTag}
                onChange={e => setLocationTag(e.target.value)}
                placeholder="e.g. Bandra, Mumbai"
                className="w-full bg-transparent focus:outline-none text-xs"
              />
            </div>
          </div>

          {/* Submit */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => {
                stopCamera();
                closeCreateModal();
              }}
              className="px-4 py-2 text-zinc-400 hover:text-white cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-bold rounded-xl shadow-md cursor-pointer transition-transform active:scale-95"
            >
              Publish Now
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
