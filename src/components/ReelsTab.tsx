import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  Music,
  Camera,
  ChevronDown,
  ChevronUp,
  Volume2,
  VolumeX,
  Play,
  Repeat,
} from 'lucide-react';
import { Reel } from '../types';
import { INITIAL_REELS } from '../data/mockData';

export const ReelsTab: React.FC = () => {
  const [reels, setReels] = useState<Reel[]>(INITIAL_REELS);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [heartAnim, setHeartAnim] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentReel = reels[activeIndex];

  const handleNextReel = () => {
    if (activeIndex < reels.length - 1) {
      setActiveIndex((prev) => prev + 1);
    } else {
      setActiveIndex(0); // loop back
    }
  };

  const handlePrevReel = () => {
    if (activeIndex > 0) {
      setActiveIndex((prev) => prev - 1);
    }
  };

  const handleToggleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setReels((prev) =>
      prev.map((reel, idx) => {
        if (idx === activeIndex) {
          const newLiked = !reel.isLiked;
          if (newLiked) {
            setHeartAnim(true);
            setTimeout(() => setHeartAnim(false), 800);
          }
          return {
            ...reel,
            isLiked: newLiked,
            likesCount: newLiked ? reel.likesCount + 1 : reel.likesCount - 1,
          };
        }
        return reel;
      })
    );
  };

  const handleDoubleTap = () => {
    setReels((prev) =>
      prev.map((reel, idx) => {
        if (idx === activeIndex) {
          return {
            ...reel,
            isLiked: true,
            likesCount: reel.isLiked ? reel.likesCount : reel.likesCount + 1,
          };
        }
        return reel;
      })
    );
    setHeartAnim(true);
    setTimeout(() => setHeartAnim(false), 800);
  };

  const handleToggleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    setReels((prev) =>
      prev.map((reel, idx) => {
        if (idx === activeIndex) {
          return { ...reel, isSaved: !reel.isSaved };
        }
        return reel;
      })
    );
  };

  const handleToggleFollow = (e: React.MouseEvent) => {
    e.stopPropagation();
    setReels((prev) =>
      prev.map((reel, idx) => {
        if (idx === activeIndex) {
          return { ...reel, isFollowing: !reel.isFollowing };
        }
        return reel;
      })
    );
  };

  return (
    <div
      id="reels-scrollable-container"
      ref={containerRef}
      className="relative w-full h-full bg-black text-white select-none overflow-hidden flex flex-col"
    >
      {/* Top Floating Header */}
      <div className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between p-4 pt-3 text-white">
        <h1 className="text-lg font-bold tracking-tight drop-shadow-md">Reels</h1>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white cursor-pointer hover:bg-black/60 transition"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
          <button className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white cursor-pointer hover:bg-black/60 transition">
            <Camera className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Floating Scroll navigation shortcuts for desktop/web preview */}
      <div className="absolute right-3 top-16 z-30 flex flex-col gap-2">
        <button
          onClick={handlePrevReel}
          disabled={activeIndex === 0}
          className="w-7 h-7 rounded-full bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center text-white disabled:opacity-30 hover:bg-black/70 cursor-pointer"
          title="Previous Reel"
        >
          <ChevronUp className="w-4 h-4" />
        </button>
        <button
          onClick={handleNextReel}
          className="w-7 h-7 rounded-full bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-black/70 cursor-pointer"
          title="Next Reel"
        >
          <ChevronDown className="w-4 h-4" />
        </button>
      </div>

      {/* Main Active Reel Display with Vertical Scroll Animation */}
      <div
        className="relative flex-1 w-full h-full cursor-pointer overflow-hidden"
        onClick={() => setIsPlaying(!isPlaying)}
        onDoubleClick={handleDoubleTap}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentReel.id}
            initial={{ opacity: 0.8, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0.8, y: -50 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="absolute inset-0"
          >
            <img
              src={currentReel.posterUrl}
              alt={currentReel.caption}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/85" />
          </motion.div>
        </AnimatePresence>

        {/* Play/Pause icon */}
        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
            <div className="w-16 h-16 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white">
              <Play className="w-8 h-8 fill-white translate-x-0.5" />
            </div>
          </div>
        )}

        {/* Double tap heart animation */}
        <AnimatePresence>
          {heartAnim && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1.3, opacity: 1 }}
              exit={{ scale: 1.5, opacity: 0 }}
              transition={{ duration: 0.35 }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none z-20"
            >
              <Heart className="w-28 h-28 text-white fill-white drop-shadow-2xl" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom Details (User info, caption, music) positioned comfortably above floating dock */}
        <div className="absolute bottom-20 left-4 right-16 z-20 space-y-2 text-white">
          <div className="flex items-center gap-2">
            <div className="p-0.5 bg-gradient-to-tr from-amber-400 to-pink-500 rounded-full">
              <img
                src={currentReel.userAvatar}
                alt={currentReel.username}
                className="w-7 h-7 rounded-full object-cover border border-black"
              />
            </div>
            <div className="flex items-center gap-1">
              <span className="font-semibold text-xs drop-shadow">{currentReel.username}</span>
              <span className="w-3.5 h-3.5 bg-sky-500 rounded-full flex items-center justify-center text-[9px] text-white font-bold">✓</span>
            </div>
            <button
              onClick={handleToggleFollow}
              className={`text-[11px] px-2.5 py-0.5 rounded-md font-semibold transition cursor-pointer ${
                currentReel.isFollowing
                  ? 'bg-white/20 text-white border border-white/30'
                  : 'bg-white text-black hover:bg-neutral-200'
              }`}
            >
              {currentReel.isFollowing ? 'Following' : 'Follow'}
            </button>
          </div>

          <p className="text-xs text-white/95 line-clamp-2 leading-relaxed drop-shadow">
            {currentReel.caption}
          </p>

          <div className="flex items-center gap-2 text-[11px] text-white/80">
            <Music className="w-3 h-3 animate-spin" style={{ animationDuration: '4s' }} />
            <span className="truncate max-w-[200px]">{currentReel.audioTrack}</span>
          </div>
        </div>

        {/* Action Sidebar (Right side: Like, Comment, Repost, Share, Audio Disc) positioned above dock */}
        <div className="absolute bottom-20 right-3 z-20 flex flex-col items-center gap-4">
          {/* Like */}
          <button
            onClick={handleToggleLike}
            className="flex flex-col items-center gap-0.5 group cursor-pointer"
          >
            <motion.div whileTap={{ scale: 1.3 }}>
              <Heart
                className={`w-7 h-7 drop-shadow-md transition ${
                  currentReel.isLiked
                    ? 'text-red-500 fill-red-500'
                    : 'text-white group-hover:scale-110'
                }`}
              />
            </motion.div>
            <span className="text-[10px] font-semibold text-white drop-shadow">
              {currentReel.likesCount > 1000
                ? `${(currentReel.likesCount / 1000).toFixed(1)}K`
                : currentReel.likesCount}
            </span>
          </button>

          {/* Comment */}
          <button className="flex flex-col items-center gap-0.5 group cursor-pointer">
            <MessageCircle className="w-7 h-7 text-white drop-shadow-md group-hover:scale-110" />
            <span className="text-[10px] font-semibold text-white drop-shadow">
              {currentReel.commentsCount}
            </span>
          </button>

          {/* Repost (matching Image 2) */}
          <button className="flex flex-col items-center gap-0.5 group cursor-pointer text-white">
            <Repeat className="w-6 h-6 drop-shadow-md group-hover:scale-110" />
            <span className="text-[10px] font-semibold text-white drop-shadow">
              10
            </span>
          </button>

          {/* Share */}
          <button className="flex flex-col items-center gap-0.5 group cursor-pointer">
            <Send className="w-6 h-6 text-white drop-shadow-md -rotate-6 group-hover:scale-110" />
            <span className="text-[10px] font-semibold text-white drop-shadow">
              Share
            </span>
          </button>

          {/* Audio Disc */}
          <div
            className="w-7 h-7 rounded-full border-2 border-white/60 overflow-hidden animate-spin shadow-lg mt-1"
            style={{ animationDuration: '3s' }}
          >
            <img
              src={currentReel.posterUrl}
              alt="disc"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
