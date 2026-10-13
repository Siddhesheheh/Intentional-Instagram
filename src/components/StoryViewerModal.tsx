import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { X, Heart, Send } from 'lucide-react';
import { Story } from '../types';

interface StoryViewerModalProps {
  stories: Story[];
  initialStoryIndex: number;
  onClose: () => void;
}

export const StoryViewerModal: React.FC<StoryViewerModalProps> = ({
  stories,
  initialStoryIndex,
  onClose,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialStoryIndex);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const currentStory = stories[currentIndex];

  useEffect(() => {
    setProgress(0);
    setIsLiked(false);
  }, [currentIndex]);

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          if (currentIndex < stories.length - 1) {
            setCurrentIndex((c) => c + 1);
            return 0;
          } else {
            onClose();
            return 100;
          }
        }
        return prev + 2;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [currentIndex, isPaused, stories.length, onClose]);

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentIndex < stories.length - 1) {
      setCurrentIndex((c) => c + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentIndex > 0) {
      setCurrentIndex((c) => c - 1);
    }
  };

  return (
    <div
      id="story-viewer-modal"
      className="fixed inset-0 z-50 bg-black flex flex-col justify-between select-none"
      onMouseDown={() => setIsPaused(true)}
      onMouseUp={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
    >
      {/* Background Story Media */}
      <div className="absolute inset-0 z-0">
        <img
          src={currentStory.mediaUrl}
          alt={currentStory.username}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/70 pointer-events-none" />
      </div>

      {/* Tap targets for prev / next */}
      <div className="absolute inset-0 z-10 flex">
        <div className="w-1/3 h-full cursor-pointer" onClick={handlePrev} />
        <div className="w-2/3 h-full cursor-pointer" onClick={handleNext} />
      </div>

      {/* Story Top Progress Bars & User info */}
      <div className="relative z-20 p-3 pt-4 space-y-2">
        {/* Progress bars */}
        <div className="flex items-center gap-1.5 w-full">
          {stories.map((s, idx) => (
            <div
              key={s.id}
              className="h-0.5 flex-1 bg-white/30 rounded-full overflow-hidden"
            >
              <div
                className="h-full bg-white transition-all duration-75"
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

        {/* User Info & Close */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img
              src={currentStory.avatar}
              alt={currentStory.username}
              className="w-8 h-8 rounded-full object-cover border border-white/40"
            />
            <span className="text-white text-xs font-semibold drop-shadow">
              {currentStory.username}
            </span>
            <span className="text-white/60 text-xs">{currentStory.timeAgo}</span>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-full text-white hover:bg-white/20 transition cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Bottom Reply Bar */}
      <div className="relative z-20 p-4 pb-6 flex items-center gap-3">
        <div className="flex-1 bg-black/40 backdrop-blur-md rounded-full px-4 py-2.5 border border-white/20 flex items-center">
          <input
            type="text"
            placeholder={`Send message to ${currentStory.username}...`}
            className="w-full bg-transparent text-xs text-white placeholder-white/60 focus:outline-none"
            onClick={(e) => e.stopPropagation()}
          />
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsLiked(!isLiked);
          }}
          className="p-2 cursor-pointer transition transform active:scale-125"
        >
          <motion.div whileTap={{ scale: 1.3 }}>
            <Heart
              className={`w-6 h-6 transition ${
                isLiked ? 'text-red-500 fill-red-500' : 'text-white'
              }`}
            />
          </motion.div>
        </button>

        <button
          onClick={(e) => e.stopPropagation()}
          className="p-2 text-white cursor-pointer -rotate-12"
        >
          <Send className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};
