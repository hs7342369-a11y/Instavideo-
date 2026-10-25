/**
 * Home Feed Component
 * Features personalized tabs (For You, Following, Trending), stories tray,
 * carousels, double-tap like gesture, comment drawers, reposts, and bookmarking.
 */
import React, { useState } from 'react';
import {
  Heart, MessageCircle, Repeat2, Bookmark, Share2, MoreHorizontal,
  CheckCircle2, ChevronLeft, ChevronRight, Send, Sparkles, MapPin
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Post } from '../types';
import { StoriesTray } from './StoriesTray';

export const HomeFeed: React.FC = () => {
  const {
    posts, likePost, savePost, repostPost, addComment, likeComment,
    followUser, users, currentUser, setActiveChannelUser, setActiveTab, t
  } = useApp();

  const [feedFilter, setFeedFilter] = useState<'forYou' | 'following' | 'trending'>('forYou');
  const [activeCommentPostId, setActiveCommentPostId] = useState<string | null>(null);
  const [commentInput, setCommentInput] = useState('');
  const [shareToast, setShareToast] = useState<string | null>(null);
  const [repostQuoteModal, setRepostQuoteModal] = useState<Post | null>(null);
  const [quoteText, setQuoteText] = useState('');

  // Carousel index tracker { [postId]: number }
  const [carouselIndices, setCarouselIndices] = useState<{ [postId: string]: number }>({});

  // Double-tap heart visual animation tracker { [postId]: boolean }
  const [heartAnim, setHeartAnim] = useState<{ [postId: string]: boolean }>({});

  // Filter posts based on selected tab
  const filteredPosts = posts.filter(post => {
    if (feedFilter === 'following') {
      return post.userId === currentUser.id || post.userId === 'user_priya' || post.userId === 'user_chef_vikram';
    }
    if (feedFilter === 'trending') {
      return post.likesCount > 20000 || post.category === 'Food';
    }
    return true; // forYou
  });

  const handleDoubleTap = (postId: string) => {
    likePost(postId);
    setHeartAnim(prev => ({ ...prev, [postId]: true }));
    setTimeout(() => {
      setHeartAnim(prev => ({ ...prev, [postId]: false }));
    }, 700);
  };

  const handleNextPhoto = (postId: string, max: number) => {
    setCarouselIndices(prev => ({
      ...prev,
      [postId]: Math.min((prev[postId] || 0) + 1, max - 1)
    }));
  };

  const handlePrevPhoto = (postId: string) => {
    setCarouselIndices(prev => ({
      ...prev,
      [postId]: Math.max((prev[postId] || 0) - 1, 0)
    }));
  };

  const handleShare = (post: Post) => {
    navigator.clipboard?.writeText(window.location.origin + `/#post-${post.id}`);
    setShareToast(t('common', 'linkCopied'));
    setTimeout(() => setShareToast(null), 2500);
  };

  const submitComment = (postId: string) => {
    if (!commentInput.trim()) return;
    addComment(postId, commentInput.trim());
    setCommentInput('');
  };

  const openCreatorChannel = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      setActiveChannelUser(user);
      setActiveTab('channel');
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto pb-24 pt-2">
      {/* Stories Tray */}
      <StoriesTray />

      {/* Feed Tabs: Segmented Filter Control */}
      <div className="flex items-center justify-between mb-4 px-2">
        <div className="flex items-center gap-1 p-1 bg-zinc-900 border border-zinc-800 rounded-xl">
          <button
            onClick={() => setFeedFilter('forYou')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              feedFilter === 'forYou'
                ? 'bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            {t('feed', 'forYou')}
          </button>
          <button
            onClick={() => setFeedFilter('following')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              feedFilter === 'following'
                ? 'bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            {t('feed', 'following')}
          </button>
          <button
            onClick={() => setFeedFilter('trending')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              feedFilter === 'trending'
                ? 'bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            {t('feed', 'trending')}
          </button>
        </div>

        {/* Suggested Creators Quick Filter */}
        <div className="hidden sm:flex items-center gap-1 text-xs text-zinc-400">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Curated for India & Global</span>
        </div>
      </div>

      {/* Share Toast Feedback */}
      {shareToast && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-zinc-800 text-white px-4 py-2 rounded-full shadow-lg border border-zinc-700 text-xs font-medium animate-in fade-in duration-150">
          {shareToast}
        </div>
      )}

      {/* Posts Stream */}
      <div className="space-y-6">
        {filteredPosts.length === 0 ? (
          <div className="text-center py-16 bg-zinc-900/40 rounded-2xl border border-zinc-800/80 p-8">
            <p className="text-zinc-400 text-sm mb-4">{t('feed', 'noPosts')}</p>
            <button
              onClick={() => setFeedFilter('forYou')}
              className="px-4 py-2 bg-rose-500 text-white text-xs font-semibold rounded-lg cursor-pointer"
            >
              Reset to For You
            </button>
          </div>
        ) : (
          filteredPosts.map(post => {
            const currentImgIdx = carouselIndices[post.id] || 0;
            const isDoubleTapped = heartAnim[post.id];

            return (
              <article
                key={post.id}
                className="bg-zinc-900/70 border border-zinc-800/90 rounded-2xl overflow-hidden shadow-lg transition-all hover:border-zinc-700/80"
              >
                {/* Post Header */}
                <div className="flex items-center justify-between p-3.5">
                  <div className="flex items-center gap-2.5">
                    <button
                      onClick={() => openCreatorChannel(post.userId)}
                      className="cursor-pointer focus:outline-none"
                    >
                      <img
                        src={post.userAvatar}
                        alt={post.username}
                        referrerPolicy="no-referrer"
                        className="w-10 h-10 rounded-full object-cover ring-1 ring-zinc-700"
                      />
                    </button>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => openCreatorChannel(post.userId)}
                          className="font-bold text-sm text-zinc-100 hover:text-rose-400 transition-colors cursor-pointer"
                        >
                          @{post.username}
                        </button>
                        {post.isVerified && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-rose-500 fill-rose-500/20" />
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-zinc-400">
                        {post.location && (
                          <span className="flex items-center gap-0.5">
                            <MapPin className="w-3 h-3 text-zinc-500" />
                            {post.location}
                          </span>
                        )}
                        <span aria-hidden="true">·</span>
                        <span>{post.timestamp}</span>
                      </div>
                    </div>
                  </div>

                  {/* Creator Follow / More */}
                  <div className="flex items-center gap-2">
                    {post.userId !== currentUser.id && (
                      <button
                        onClick={() => followUser(post.userId)}
                        className="text-xs font-semibold text-rose-400 hover:text-rose-300 px-2.5 py-1 rounded-md hover:bg-rose-500/10 transition-colors cursor-pointer"
                      >
                        {t('feed', 'follow')}
                      </button>
                    )}
                    <button
                      onClick={() => handleShare(post)}
                      className="text-zinc-400 hover:text-white p-1 cursor-pointer"
                    >
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Media Container with Double-tap Heart Animation */}
                <div
                  className="relative aspect-4/3 w-full bg-zinc-950 overflow-hidden cursor-pointer select-none"
                  onDoubleClick={() => handleDoubleTap(post.id)}
                >
                  <img
                    src={post.mediaUrls[currentImgIdx] || post.mediaUrls[0]}
                    alt={post.caption}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />

                  {/* Double tap heart pop */}
                  {isDoubleTapped && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none animate-ping duration-300">
                      <Heart className="w-24 h-24 text-rose-500 fill-rose-500 drop-shadow-xl" />
                    </div>
                  )}

                  {/* Carousel Left/Right Buttons */}
                  {post.mediaUrls.length > 1 && (
                    <>
                      {currentImgIdx > 0 && (
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            handlePrevPhoto(post.id);
                          }}
                          className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center cursor-pointer transition-colors"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                      )}
                      {currentImgIdx < post.mediaUrls.length - 1 && (
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            handleNextPhoto(post.id, post.mediaUrls.length);
                          }}
                          className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center cursor-pointer transition-colors"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      )}

                      {/* Dots pagination */}
                      <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-black/50 backdrop-blur-xs px-2.5 py-1 rounded-full pointer-events-none">
                        {post.mediaUrls.map((_, idx) => (
                          <div
                            key={idx}
                            className={`w-1.5 h-1.5 rounded-full transition-all ${
                              idx === currentImgIdx ? 'w-3 bg-white' : 'bg-white/40'
                            }`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>

                {/* Engagement Action Bar */}
                <div className="p-3.5 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {/* Like */}
                      <button
                        onClick={() => likePost(post.id)}
                        className={`flex items-center gap-1.5 transition-transform active:scale-125 cursor-pointer ${
                          post.isLiked ? 'text-rose-500' : 'text-zinc-300 hover:text-white'
                        }`}
                      >
                        <Heart className={`w-5 h-5 ${post.isLiked ? 'fill-rose-500' : ''}`} />
                        <span className="text-xs font-semibold tabular-nums">
                          {post.likesCount.toLocaleString()}
                        </span>
                      </button>

                      {/* Comment */}
                      <button
                        onClick={() =>
                          setActiveCommentPostId(activeCommentPostId === post.id ? null : post.id)
                        }
                        className="flex items-center gap-1.5 text-zinc-300 hover:text-white transition-colors cursor-pointer"
                      >
                        <MessageCircle className="w-5 h-5" />
                        <span className="text-xs font-semibold tabular-nums">
                          {post.commentsCount.toLocaleString()}
                        </span>
                      </button>

                      {/* Repost */}
                      <button
                        onClick={() => setRepostQuoteModal(post)}
                        className={`flex items-center gap-1.5 text-zinc-300 hover:text-emerald-400 transition-colors cursor-pointer ${
                          post.isReposted ? 'text-emerald-400' : ''
                        }`}
                      >
                        <Repeat2 className="w-5 h-5" />
                        <span className="text-xs font-semibold tabular-nums">
                          {post.sharesCount.toLocaleString()}
                        </span>
                      </button>

                      {/* Share */}
                      <button
                        onClick={() => handleShare(post)}
                        className="text-zinc-300 hover:text-white transition-colors cursor-pointer"
                        title="Share link"
                      >
                        <Share2 className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Bookmark / Save */}
                    <button
                      onClick={() => savePost(post.id)}
                      className={`transition-colors cursor-pointer ${
                        post.isSaved ? 'text-rose-500' : 'text-zinc-300 hover:text-white'
                      }`}
                    >
                      <Bookmark className={`w-5 h-5 ${post.isSaved ? 'fill-rose-500' : ''}`} />
                    </button>
                  </div>

                  {/* Caption & Hashtags */}
                  <div className="text-sm text-zinc-200 leading-relaxed">
                    <button
                      onClick={() => openCreatorChannel(post.userId)}
                      className="font-bold mr-2 text-white hover:text-rose-400 cursor-pointer"
                    >
                      @{post.username}
                    </button>
                    <span>{post.caption}</span>
                  </div>

                  {/* Clickable Hashtags */}
                  {post.hashtags && post.hashtags.length > 0 && (
                    <div className="flex flex-wrap gap-2 text-xs text-rose-400 font-medium pt-0.5">
                      {post.hashtags.map(tag => (
                        <span key={tag} className="hover:underline cursor-pointer">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* View all comments link */}
                  {post.comments.length > 0 && (
                    <button
                      onClick={() =>
                        setActiveCommentPostId(activeCommentPostId === post.id ? null : post.id)
                      }
                      className="text-xs text-zinc-400 hover:text-zinc-200 cursor-pointer block pt-1"
                    >
                      {activeCommentPostId === post.id
                        ? 'Hide comments'
                        : `${t('feed', 'viewAllComments')} ${post.commentsCount} ${t('feed', 'comments')}`}
                    </button>
                  )}

                  {/* Expandable Comments Drawer */}
                  {activeCommentPostId === post.id && (
                    <div className="mt-3 pt-3 border-t border-zinc-800 space-y-3">
                      <div className="max-h-56 overflow-y-auto space-y-2.5 pr-1">
                        {post.comments.map(c => (
                          <div key={c.id} className="text-xs space-y-1">
                            <div className="flex items-start justify-between">
                              <div className="flex items-start gap-2">
                                <img
                                  src={c.userAvatar}
                                  alt={c.username}
                                  referrerPolicy="no-referrer"
                                  className="w-6 h-6 rounded-full object-cover shrink-0 mt-0.5"
                                />
                                <div>
                                  <span className="font-semibold text-white mr-1.5">
                                    @{c.username}
                                  </span>
                                  <span className="text-zinc-300">{c.text}</span>
                                  <div className="flex items-center gap-3 text-[10px] text-zinc-500 mt-0.5">
                                    <span>{c.timestamp}</span>
                                    <button
                                      onClick={() => setCommentInput(`@${c.username} `)}
                                      className="hover:text-zinc-300 cursor-pointer"
                                    >
                                      Reply
                                    </button>
                                  </div>
                                </div>
                              </div>
                              <button
                                onClick={() => likeComment(post.id, c.id)}
                                className={`p-1 cursor-pointer ${
                                  c.isLiked ? 'text-rose-500' : 'text-zinc-500 hover:text-zinc-300'
                                }`}
                              >
                                <Heart className={`w-3.5 h-3.5 ${c.isLiked ? 'fill-rose-500' : ''}`} />
                              </button>
                            </div>

                            {/* Comment Replies */}
                            {c.replies && c.replies.length > 0 && (
                              <div className="ml-8 pl-2 border-l border-zinc-800 space-y-2 mt-1">
                                {c.replies.map(rep => (
                                  <div key={rep.id} className="flex items-start gap-2 text-xs">
                                    <img
                                      src={rep.userAvatar}
                                      alt={rep.username}
                                      referrerPolicy="no-referrer"
                                      className="w-5 h-5 rounded-full object-cover shrink-0 mt-0.5"
                                    />
                                    <div>
                                      <span className="font-semibold text-white mr-1.5">
                                        @{rep.username}
                                      </span>
                                      <span className="text-zinc-300">{rep.text}</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>

                      {/* Add Comment Input */}
                      <div className="flex items-center gap-2 pt-1">
                        <input
                          type="text"
                          placeholder={t('feed', 'writeComment')}
                          value={commentInput}
                          onChange={e => setCommentInput(e.target.value)}
                          onKeyDown={e => {
                            if (e.key === 'Enter') submitComment(post.id);
                          }}
                          className="flex-1 bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-rose-500"
                        />
                        <button
                          onClick={() => submitComment(post.id)}
                          className="px-3 py-1.5 bg-rose-500 hover:bg-rose-600 text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors"
                        >
                          {t('feed', 'postComment')}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </article>
            );
          })
        )}
      </div>

      {/* Repost & Quote Modal */}
      {repostQuoteModal && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={() => setRepostQuoteModal(null)}
        >
          <div
            className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl p-5 shadow-2xl space-y-4"
            onClick={e => e.stopPropagation()}
          >
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Repeat2 className="w-5 h-5 text-emerald-400" />
              {t('feed', 'repost')} or {t('feed', 'quotePost')}
            </h3>

            <div className="p-3 rounded-xl bg-zinc-950/70 border border-zinc-800 text-xs text-zinc-300">
              <p className="font-semibold text-white">@{repostQuoteModal.username}</p>
              <p className="truncate mt-1">{repostQuoteModal.caption}</p>
            </div>

            <textarea
              placeholder="Add your thoughts to this repost (optional)..."
              value={quoteText}
              onChange={e => setQuoteText(e.target.value)}
              className="w-full h-24 bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-rose-500 resize-none"
            />

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setRepostQuoteModal(null)}
                className="px-4 py-2 text-xs font-medium text-zinc-400 hover:text-white cursor-pointer"
              >
                {t('common', 'cancel')}
              </button>
              <button
                onClick={() => {
                  repostPost(repostQuoteModal.id);
                  setRepostQuoteModal(null);
                  setQuoteText('');
                }}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg cursor-pointer transition-colors"
              >
                Instant Repost
              </button>
              <button
                onClick={() => {
                  repostPost(repostQuoteModal.id, quoteText);
                  setRepostQuoteModal(null);
                  setQuoteText('');
                }}
                className="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white text-xs font-semibold rounded-lg cursor-pointer transition-colors"
              >
                {t('feed', 'quotePost')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
