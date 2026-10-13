import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Heart, MessageCircle, Send, Bookmark, Music, Volume2, VolumeX, Play } from 'lucide-react';
import { Reel } from '../types';

interface SingleReelViewerProps {
  reel: Reel;
  onClose: () => void;
}

export const SingleReelViewer: React.FC<SingleReelViewerProps> = ({ reel, onClose }) => {
  const [isLiked, setIsLiked] = useState(reel.isLiked);
  const [likesCount, setLikesCount] = useState(reel.likesCount);
  const [isSaved, setIsSaved] = useState(reel.isSaved);
  const [isFollowing, setIsFollowing] = useState(reel.isFollowing ?? false);
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showHeartAnim, setShowHeartAnim] = useState(false);

  const handleToggleLike = () => {
    if (!isLiked) {
      setLikesCount((prev) => prev + 1);
      setIsLiked(true);
      setShowHeartAnim(true);
      setTimeout(() => setShowHeartAnim(false), 800);
    } else {
      setLikesCount((prev) => prev - 1);
      setIsLiked(false);
    }
  };

  const handleDoubleTap = () => {
    if (!isLiked) {
      setLikesCount((prev) => prev + 1);
      setIsLiked(true);
    }
    setShowHeartAnim(true);
    setTimeout(() => setShowHeartAnim(false), 800);
  };

  return (
    <div
      id="single-non-scrollable-reel-viewer"
      className="fixed inset-0 z-50 bg-black flex flex-col justify-between overflow-hidden select-none"
      style={{ touchAction: 'none' }} // explicitly non-scrollable as requested
    >
      {/* Background Media (Non-scrollable single reel) */}
      <div
        className="absolute inset-0 z-0 flex items-center justify-center overflow-hidden cursor-pointer"
        onClick={() => setIsPlaying(!isPlaying)}
        onDoubleClick={handleDoubleTap}
      >
        <img
          src={reel.posterUrl}
          alt={reel.caption}
          className="w-full h-full object-cover"
        />

        {/* Subtle dark gradient overlay for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/80 pointer-events-none" />

        {/* Play / Pause indicator */}
        {!isPlaying && (
          <div className="absolute z-10 w-16 h-16 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white">
            <Play className="w-8 h-8 fill-white translate-x-0.5" />
          </div>
        )}

        {/* Double tap heart animation */}
        <AnimatePresence>
          {showHeartAnim && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1.2, opacity: 1 }}
              exit={{ scale: 1.4, opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="absolute z-20 pointer-events-none"
            >
              <Heart className="w-24 h-24 text-red-500 fill-red-500 drop-shadow-2xl" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Top Bar Header */}
      <div className="relative z-10 flex items-center justify-between p-4 pt-5 text-white">
        <button
          id="btn-close-single-reel"
          onClick={onClose}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md text-white text-sm font-medium hover:bg-black/60 transition cursor-pointer border border-white/10"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Chat</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 text-[11px] font-semibold bg-white/20 backdrop-blur-md rounded-full text-white/90">
            Shared Reel (Single View)
          </span>
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white cursor-pointer hover:bg-black/60"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Bottom Content Area */}
      <div className="relative z-10 p-4 pb-6 flex items-end justify-between gap-4 text-white">
        {/* Left info: creator, caption, audio */}
        <div className="space-y-3 max-w-[75%]">
          {/* Creator Profile */}
          <div className="flex items-center gap-2.5">
            <img
              src={reel.userAvatar}
              alt={reel.username}
              className="w-9 h-9 rounded-full object-cover border border-white/40"
            />
            <span className="font-semibold text-sm text-white drop-shadow">
              {reel.username}
            </span>
            <button
              onClick={() => setIsFollowing(!isFollowing)}
              className={`text-xs px-2.5 py-1 rounded-lg font-medium transition cursor-pointer ${
                isFollowing
                  ? 'bg-white/20 text-white border border-white/30'
                  : 'bg-white text-black hover:bg-neutral-200'
              }`}
            >
              {isFollowing ? 'Following' : 'Follow'}
            </button>
          </div>

          {/* Caption */}
          <p className="text-xs text-white/95 leading-relaxed line-clamp-3 drop-shadow">
            {reel.caption}
          </p>

          {/* Audio track */}
          <div className="flex items-center gap-2 text-xs text-white/90">
            <Music className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '4s' }} />
            <span className="truncate max-w-[200px]">{reel.audioTrack}</span>
          </div>
        </div>

        {/* Right action bar: Like, Comment, Share, Bookmark */}
        <div className="flex flex-col items-center gap-5 pb-1">
          {/* Like */}
          <button
            onClick={handleToggleLike}
            className="flex flex-col items-center gap-1 group cursor-pointer"
          >
            <motion.div whileTap={{ scale: 1.3 }}>
              <Heart
                className={`w-7 h-7 drop-shadow-md transition ${
                  isLiked ? 'text-red-500 fill-red-500' : 'text-white group-hover:scale-110'
                }`}
              />
            </motion.div>
            <span className="text-[11px] font-semibold text-white drop-shadow">
              {likesCount > 1000 ? `${(likesCount / 1000).toFixed(1)}K` : likesCount}
            </span>
          </button>

          {/* Comment */}
          <button className="flex flex-col items-center gap-1 group cursor-pointer">
            <MessageCircle className="w-7 h-7 text-white group-hover:scale-110 drop-shadow-md" />
            <span className="text-[11px] font-semibold text-white drop-shadow">
              {reel.commentsCount}
            </span>
          </button>

          {/* Share */}
          <button className="flex flex-col items-center gap-1 group cursor-pointer">
            <Send className="w-6 h-6 text-white group-hover:scale-110 drop-shadow-md -rotate-12" />
            <span className="text-[11px] font-semibold text-white drop-shadow">
              {reel.sharesCount > 1000 ? `${(reel.sharesCount / 1000).toFixed(1)}K` : reel.sharesCount}
            </span>
          </button>

          {/* Bookmark */}
          <button
            onClick={() => setIsSaved(!isSaved)}
            className="flex flex-col items-center gap-1 group cursor-pointer"
          >
            <Bookmark
              className={`w-6 h-6 drop-shadow-md ${
                isSaved ? 'text-white fill-white' : 'text-white group-hover:scale-110'
              }`}
            />
          </button>

          {/* Rotating Audio disc */}
          <div className="w-7 h-7 rounded-full border-2 border-white/60 overflow-hidden animate-spin shadow-lg" style={{ animationDuration: '3s' }}>
            <img src={reel.posterUrl} alt="audio disc" className="w-full h-full object-cover" />
          </div>
        </div>
      </div>
    </div>
  );
};
