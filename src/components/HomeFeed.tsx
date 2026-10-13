import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Heart,
  MessageCircle,
  Repeat2,
  Send,
  Bookmark,
  MoreHorizontal,
  Plus,
  ChevronDown,
  CheckCircle2,
} from 'lucide-react';
import { Post, Story } from '../types';
import { INITIAL_FEED_POSTS, INITIAL_STORIES } from '../data/mockData';
import { StoryViewerModal } from './StoryViewerModal';

interface HomeFeedProps {
  onOpenDMs: () => void;
}

export const HomeFeed: React.FC<HomeFeedProps> = ({ onOpenDMs }) => {
  const [posts, setPosts] = useState<Post[]>(INITIAL_FEED_POSTS);
  const [stories] = useState<Story[]>(INITIAL_STORIES);
  const [activeStoryIndex, setActiveStoryIndex] = useState<number | null>(null);
  const [heartAnimPostId, setHeartAnimPostId] = useState<string | null>(null);
  const [commentInputPostId, setCommentInputPostId] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [repostedMap, setRepostedMap] = useState<Record<string, boolean>>({});

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleToggleLike = (postId: string) => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          const newLiked = !post.isLiked;
          return {
            ...post,
            isLiked: newLiked,
            likesCount: newLiked ? post.likesCount + 1 : post.likesCount - 1,
          };
        }
        return post;
      })
    );
  };

  const handleDoubleTap = (postId: string) => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            isLiked: true,
            likesCount: post.isLiked ? post.likesCount : post.likesCount + 1,
          };
        }
        return post;
      })
    );
    setHeartAnimPostId(postId);
    setTimeout(() => setHeartAnimPostId(null), 800);
  };

  const handleToggleSave = (postId: string) => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          const newSaved = !post.isSaved;
          showToast(newSaved ? 'Saved to collection' : 'Removed from saved');
          return { ...post, isSaved: newSaved };
        }
        return post;
      })
    );
  };

  const handleToggleRepost = (postId: string) => {
    setRepostedMap((prev) => {
      const current = !!prev[postId];
      showToast(!current ? 'Reposted to your profile' : 'Removed repost');
      return { ...prev, [postId]: !current };
    });
  };

  const handleAddComment = (postId: string) => {
    if (!commentText.trim()) return;

    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            commentsCount: post.commentsCount + 1,
            comments: [
              ...post.comments,
              {
                id: `c-${Date.now()}`,
                username: 'alex_visuals',
                avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80',
                text: commentText.trim(),
                timeAgo: 'Just now',
                likes: 0,
              },
            ],
          };
        }
        return post;
      })
    );

    setCommentText('');
    setCommentInputPostId(null);
    showToast('Comment posted');
  };

  return (
    <div
      id="home-feed-container"
      className="flex flex-col h-full bg-black text-white overflow-y-auto no-scrollbar"
    >
      {/* Toast notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-14 left-1/2 -translate-x-1/2 z-50 bg-neutral-900/95 text-white text-xs px-4 py-2 rounded-full shadow-lg border border-neutral-700/50 backdrop-blur-md"
          >
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Header matching Image 1: Plus on left, Instagram ⌵ center, Heart on right */}
      <header className="flex items-center justify-between px-4 py-2 bg-black/95 backdrop-blur-md sticky top-0 z-30 border-b border-neutral-900/50 shrink-0">
        <button
          onClick={() => showToast('Create post/story')}
          className="p-1 text-white hover:text-neutral-400 transition cursor-pointer"
          title="New post or story"
          aria-label="New post"
        >
          <Plus className="w-6 h-6 stroke-[2]" />
        </button>

        <div className="flex items-center gap-1 cursor-pointer">
          <span className="font-instagram-logo text-3xl tracking-tight text-white select-none">
            Instagram
          </span>
          <ChevronDown className="w-4 h-4 text-white/80 -translate-y-0.5" />
        </div>

        <button
          onClick={() => showToast('No new notifications')}
          className="p-1 text-white hover:text-neutral-400 transition cursor-pointer relative"
          title="Notifications"
          aria-label="Notifications"
        >
          <Heart className="w-6 h-6" />
        </button>
      </header>

      {/* Stories Section (Top horizontal carousel) - shrink-0 ensures full visibility */}
      <section
        aria-label="Stories tray"
        className="py-3 px-3 border-b border-neutral-900 overflow-x-auto no-scrollbar flex items-center gap-3.5 shrink-0 w-full bg-black min-h-[110px]"
      >
        {stories.map((story, idx) => (
          <div
            key={story.id}
            onClick={() => setActiveStoryIndex(idx)}
            className="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer group select-none"
          >
            <div
              className={`p-[2.5px] rounded-full transition transform group-hover:scale-105 shrink-0 ${
                idx === 0
                  ? 'p-0 relative'
                  : story.isViewed
                  ? 'bg-neutral-800'
                  : 'bg-gradient-to-tr from-amber-400 via-pink-500 to-purple-600'
              }`}
            >
              <div className="p-0.5 bg-black rounded-full shrink-0">
                <img
                  src={story.avatar}
                  alt={story.username}
                  className="w-16 h-16 rounded-full object-cover shrink-0 block"
                />
              </div>

              {idx === 0 && (
                <div className="absolute bottom-0 right-0 w-5 h-5 bg-white text-black rounded-full flex items-center justify-center border-2 border-black font-bold shadow">
                  <Plus className="w-3.5 h-3.5 stroke-[3]" />
                </div>
              )}
            </div>

            <span className="text-[11px] font-medium text-neutral-300 max-w-[68px] truncate text-center leading-tight">
              {story.username}
            </span>
          </div>
        ))}
      </section>

      {/* Posts Feed (Scrolling) */}
      <div className="divide-y divide-neutral-900 pb-28">
        {posts.map((post, postIdx) => (
          <article key={post.id} className="pb-3 pt-1">
            {/* Post Header */}
            <div className="flex items-center justify-between px-3.5 py-2">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full overflow-hidden border border-neutral-800">
                  <img
                    src={post.userAvatar}
                    alt={post.username}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex items-center gap-1.5">
                  <h2 className="text-xs font-semibold leading-none text-white">
                    {post.username}
                  </h2>
                  <CheckCircle2 className="w-3.5 h-3.5 fill-sky-500 text-black inline" />
                </div>
              </div>

              <button
                onClick={() => showToast('Post options')}
                className="text-neutral-400 hover:text-white p-1 cursor-pointer"
                aria-label="Post options"
              >
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </div>

            {/* Post Media with Double Tap Heart */}
            <div
              className="relative aspect-square w-full bg-neutral-900 overflow-hidden cursor-pointer select-none"
              onDoubleClick={() => handleDoubleTap(post.id)}
            >
              <img
                src={post.mediaUrl}
                alt={post.caption}
                className="w-full h-full object-cover"
              />

              {/* Double tap heart animation */}
              <AnimatePresence>
                {heartAnimPostId === post.id && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1.25, opacity: 1 }}
                    exit={{ scale: 1.5, opacity: 0 }}
                    transition={{ duration: 0.35 }}
                    className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
                  >
                    <Heart className="w-24 h-24 text-white fill-white drop-shadow-2xl" />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Carousel indicator dots as seen in Image 1 */}
              <div className="absolute bottom-2 left-0 right-0 flex items-center justify-center gap-1 pointer-events-none">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
                <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
                <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
                <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
              </div>
            </div>

            {/* Action Bar matching Image 1: Heart, Comment (count), Repost (count), Send, Bookmark */}
            <div className="flex items-center justify-between px-3.5 pt-2.5 pb-1 text-white">
              <div className="flex items-center gap-4">
                {/* Like */}
                <button
                  onClick={() => handleToggleLike(post.id)}
                  className="cursor-pointer transition transform active:scale-125"
                  aria-label="Like post"
                >
                  <motion.div whileTap={{ scale: 1.25 }}>
                    <Heart
                      className={`w-6 h-6 transition ${
                        post.isLiked
                          ? 'text-red-500 fill-red-500'
                          : 'text-white hover:text-neutral-400'
                      }`}
                    />
                  </motion.div>
                </button>

                {/* Comment with count as in Image 1 */}
                <button
                  onClick={() =>
                    setCommentInputPostId(
                      commentInputPostId === post.id ? null : post.id
                    )
                  }
                  className="cursor-pointer text-white hover:text-neutral-400 transition flex items-center gap-1"
                  aria-label="Comments"
                >
                  <MessageCircle className="w-6 h-6" />
                  <span className="text-xs font-semibold">{post.commentsCount}</span>
                </button>

                {/* Repost / Recycle with count as in Image 1 */}
                <button
                  onClick={() => handleToggleRepost(post.id)}
                  className={`cursor-pointer transition flex items-center gap-1 ${
                    repostedMap[post.id] ? 'text-emerald-400' : 'text-white hover:text-neutral-400'
                  }`}
                  aria-label="Repost"
                >
                  <Repeat2 className="w-6 h-6" />
                  <span className="text-xs font-semibold">
                    {repostedMap[post.id] ? 21 : 20}
                  </span>
                </button>

                {/* Share */}
                <button
                  onClick={() => showToast('Share link copied')}
                  className="cursor-pointer text-white hover:text-neutral-400 transition -rotate-6"
                  aria-label="Share post"
                >
                  <Send className="w-6 h-6" />
                </button>
              </div>

              {/* Bookmark */}
              <button
                onClick={() => handleToggleSave(post.id)}
                className="cursor-pointer transition transform active:scale-110 text-white hover:text-neutral-400"
                aria-label="Save post"
              >
                <Bookmark
                  className={`w-6 h-6 ${
                    post.isSaved ? 'fill-white' : ''
                  }`}
                />
              </button>
            </div>

            {/* Likes count info matching Image 1: "Liked by muraliac38 and others" */}
            <div className="px-3.5 py-0.5 text-xs text-white">
              <span>Liked by </span>
              <strong className="font-semibold cursor-pointer">muraliac38</strong>
              <span> and </span>
              <strong className="font-semibold cursor-pointer">others</strong>
            </div>

            {/* Caption */}
            <div className="px-3.5 py-0.5 text-xs text-neutral-200">
              <span className="font-semibold mr-1.5 text-white">{post.username}</span>
              <span>{post.caption}</span>
            </div>

            {/* Time ago */}
            <div className="px-3.5 py-0.5 text-[11px] text-neutral-500">
              {post.timeAgo}
            </div>

            {/* Inline comment drawer if toggled */}
            {commentInputPostId === post.id && (
              <div className="px-3.5 py-2 space-y-2 bg-neutral-900/60 rounded-xl my-1 mx-3 border border-neutral-800">
                {post.comments.map((c) => (
                  <div key={c.id} className="text-xs flex items-baseline gap-1.5">
                    <span className="font-semibold text-neutral-200">
                      {c.username}
                    </span>
                    <span className="text-neutral-400 flex-1">
                      {c.text}
                    </span>
                    <span className="text-[10px] text-neutral-500">{c.timeAgo}</span>
                  </div>
                ))}

                {/* Add comment input */}
                <div className="flex items-center gap-2 pt-1 border-t border-neutral-800">
                  <input
                    type="text"
                    placeholder="Add a comment..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddComment(post.id)}
                    className="flex-1 bg-transparent text-xs text-white placeholder-neutral-500 outline-none"
                  />
                  <button
                    onClick={() => handleAddComment(post.id)}
                    disabled={!commentText.trim()}
                    className="text-xs font-semibold text-sky-400 disabled:opacity-40 hover:text-sky-300 cursor-pointer"
                  >
                    Post
                  </button>
                </div>
              </div>
            )}

            {/* Sponsored ad card after post 1 matching Image 1 */}
            {postIdx === 0 && (
              <div className="mt-3 pt-3 border-t border-neutral-900 px-3.5 pb-2">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center font-bold text-black text-sm">
                      a
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-semibold text-white">amazondotin</span>
                        <CheckCircle2 className="w-3.5 h-3.5 fill-sky-500 text-black" />
                      </div>
                      <span className="text-[10px] text-neutral-400">Ad</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button className="text-xs font-semibold bg-neutral-800 text-white hover:bg-neutral-700 px-3 py-1 rounded-md cursor-pointer transition">
                      Follow
                    </button>
                    <button className="text-neutral-400 hover:text-white">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </article>
        ))}
      </div>

      {/* Story Viewer Modal */}
      {activeStoryIndex !== null && (
        <StoryViewerModal
          stories={stories}
          initialIndex={activeStoryIndex}
          onClose={() => setActiveStoryIndex(null)}
        />
      )}
    </div>
  );
};
