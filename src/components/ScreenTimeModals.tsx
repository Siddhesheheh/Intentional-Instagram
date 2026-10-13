import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Coffee, X, Clock, AlertTriangle, ShieldCheck, ChevronRight } from 'lucide-react';
import { useScreenTime } from '../context/ScreenTimeContext';

/**
 * Sun radiating rays around circle with pause icon inside, matching Image 1 exactly.
 */
export const InstagramLimitSunIcon: React.FC<{ className?: string }> = ({ className = 'w-20 h-20' }) => {
  const rays = [
    { angle: 0, color: '#F59E0B' },   // 12 o'clock - Yellow/Amber
    { angle: 30, color: '#F97316' },  // 1 o'clock - Orange
    { angle: 60, color: '#FB7185' },  // 2 o'clock - Coral Rose
    { angle: 90, color: '#F43F5E' },  // 3 o'clock - Red/Pink
    { angle: 120, color: '#EC4899' }, // 4 o'clock - Magenta
    { angle: 150, color: '#D946EF' }, // 5 o'clock - Fuchsia
    { angle: 180, color: '#A855F7' }, // 6 o'clock - Purple
    { angle: 210, color: '#9333EA' }, // 7 o'clock - Deep Violet
    { angle: 240, color: '#7C3AED' }, // 8 o'clock - Violet
    { angle: 270, color: '#6366F1' }, // 9 o'clock - Indigo
    { angle: 300, color: '#EC4899' }, // 10 o'clock - Pink
    { angle: 330, color: '#F59E0B' }, // 11 o'clock - Amber
  ];

  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Daily limit reached icon"
    >
      {/* 12 radial rays */}
      {rays.map((ray, i) => {
        const rad = (ray.angle * Math.PI) / 180;
        const r1 = 30;
        const r2 = 37.5;
        const x1 = 50 + r1 * Math.sin(rad);
        const y1 = 50 - r1 * Math.cos(rad);
        const x2 = 50 + r2 * Math.sin(rad);
        const y2 = 50 - r2 * Math.cos(rad);
        return (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke={ray.color}
            strokeWidth="3.4"
            strokeLinecap="round"
          />
        );
      })}

      {/* Main inner gradient circle */}
      <circle
        cx="50"
        cy="50"
        r="19"
        stroke="url(#ig-sun-gradient)"
        strokeWidth="3.2"
        fill="none"
      />

      {/* Pause bars || inside circle in pink/magenta */}
      <rect x="44.2" y="42.5" width="3.2" height="15" rx="1.6" fill="#F43F5E" />
      <rect x="52.6" y="42.5" width="3.2" height="15" rx="1.6" fill="#F43F5E" />

      <defs>
        <linearGradient
          id="ig-sun-gradient"
          x1="25"
          y1="25"
          x2="75"
          y2="75"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#F59E0B" />
          <stop offset="35%" stopColor="#F43F5E" />
          <stop offset="70%" stopColor="#EC4899" />
          <stop offset="100%" stopColor="#9333EA" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export const ScreenTimeModals: React.FC = () => {
  const {
    settings,
    todayUsageSeconds,
    showDailyLimitPopup,
    showReopenDailyLimitModal,
    showTakeABreakPopup,
    isDailyLimitIgnoredToday,
    handleContinueDailyLimit,
    handleIgnoreDailyLimitToday,
    handleUse15MinutesMore,
    handleExitApp,
    handleContinueTakeABreak,
    formatDuration,
    formatDetailedTime,
    updateSettings,
  } = useScreenTime();

  const [showMoreOptions, setShowMoreOptions] = useState(false);

  // Is full-screen daily limit screen currently showing?
  const isDailyLimitActive =
    (showDailyLimitPopup || showReopenDailyLimitModal) &&
    settings.dailyLimitEnabled &&
    !isDailyLimitIgnoredToday;

  // True ONLY when app is opened/re-opened after limit was already reached
  const isReopenedAfterLimit = showReopenDailyLimitModal && !showDailyLimitPopup;

  return (
    <AnimatePresence>
      {/* 1. FULL-SCREEN DAILY LIMIT REACHED SCREEN (Matches Image 1 exactly) */}
      {isDailyLimitActive && (
        <motion.div
          id="daily-limit-fullscreen-screen"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="absolute inset-0 z-50 flex flex-col justify-between items-center px-6 pt-16 pb-6 select-none bg-gradient-to-b from-[#1b1a20] via-[#100f14] to-[#121115] text-white overflow-hidden"
          style={{
            backgroundImage: `
              radial-gradient(circle at 85% 45%, rgba(180, 30, 80, 0.16), transparent 50%),
              radial-gradient(circle at 15% 25%, rgba(80, 80, 120, 0.12), transparent 45%),
              linear-gradient(to bottom, #1a191f, #0f0e13 60%, #111014)
            `,
          }}
        >
          {/* Top spacer */}
          <div className="h-2" />

          {/* Center Content Section matching Image 1 */}
          <div className="flex flex-col items-center text-center space-y-4 max-w-[340px] -mt-12">
            {/* Radiating sun pause glyph */}
            <div className="mb-2">
              <InstagramLimitSunIcon className="w-20 h-20 drop-shadow-md" />
            </div>

            {/* Headline: switches to "You have already reached your limit for today" when reopened */}
            <h1 className="text-2xl sm:text-[28px] font-bold text-white tracking-tight leading-snug">
              {isReopenedAfterLimit
                ? 'You have already reached your limit for today'
                : "You've reached your daily limit"}
            </h1>

            {/* Subtext with dynamic formatted duration */}
            <p className="text-white/85 text-[15px] sm:text-base leading-relaxed px-2 font-normal">
              You've been on Instagram for{' '}
              {formatDetailedTime(todayUsageSeconds || settings.dailyLimitSeconds)} today.
              Now's a good time to close the app.
            </p>
          </div>

          {/* Bottom Area matching Image 1: More options button + Home Indicator Bar */}
          <div className="w-full flex flex-col items-center space-y-5 pb-2">
            <button
              id="btn-daily-limit-more-options"
              onClick={() => setShowMoreOptions(true)}
              className="bg-[#3e3d43] hover:bg-[#4d4c54] active:scale-95 text-white font-semibold text-sm py-3 px-8 rounded-full transition cursor-pointer shadow-lg"
            >
              More options
            </button>

            {/* Home indicator bar (also clickable to exit app) */}
            <button
              type="button"
              onClick={handleExitApp}
              className="w-36 h-1 bg-white/90 hover:bg-white rounded-full transition cursor-pointer"
              title="Click bar to exit Instagram"
              aria-label="Exit app to home screen"
            />
          </div>

          {/* More Options Bottom Action Sheet */}
          <AnimatePresence>
            {showMoreOptions && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-50 bg-black/70 backdrop-blur-sm flex flex-col justify-end"
                onClick={() => setShowMoreOptions(false)}
              >
                <motion.div
                  initial={{ y: '100%' }}
                  animate={{ y: 0 }}
                  exit={{ y: '100%' }}
                  transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                  onClick={(e) => e.stopPropagation()}
                  className="bg-neutral-900 border-t border-neutral-800 rounded-t-3xl p-5 pb-8 space-y-2 text-white shadow-2xl"
                >
                  {/* Handle indicator */}
                  <div className="w-10 h-1 bg-neutral-700 rounded-full mx-auto mb-4" />

                  <h3 className="text-center font-bold text-sm text-neutral-300 pb-2">
                    Daily Limit Options
                  </h3>

                  <button
                    id="btn-daily-limit-close"
                    onClick={() => {
                      setShowMoreOptions(false);
                      handleExitApp();
                    }}
                    className="w-full py-3.5 px-4 bg-rose-600/20 hover:bg-rose-600/30 text-rose-400 font-semibold text-sm rounded-xl transition flex items-center justify-between cursor-pointer"
                  >
                    <span>Close Instagram</span>
                    <ChevronRight className="w-4 h-4 text-rose-400/80" />
                  </button>

                  <button
                    id="btn-daily-limit-ignore-today"
                    onClick={() => {
                      setShowMoreOptions(false);
                      handleIgnoreDailyLimitToday();
                    }}
                    className="w-full py-3.5 px-4 bg-neutral-800 hover:bg-neutral-700 text-white font-medium text-sm rounded-xl transition flex items-center justify-between cursor-pointer"
                  >
                    <span>Ignore limit for today</span>
                    <ChevronRight className="w-4 h-4 text-neutral-400" />
                  </button>

                  <button
                    id="btn-daily-limit-15-mins"
                    onClick={() => {
                      setShowMoreOptions(false);
                      handleUse15MinutesMore();
                    }}
                    className="w-full py-3.5 px-4 bg-neutral-800 hover:bg-neutral-700 text-white font-medium text-sm rounded-xl transition flex items-center justify-between cursor-pointer"
                  >
                    <span>{isReopenedAfterLimit ? 'Use Instagram for 15 min' : 'Add 15 more minutes'}</span>
                    <ChevronRight className="w-4 h-4 text-neutral-400" />
                  </button>

                  <button
                    onClick={() => setShowMoreOptions(false)}
                    className="w-full py-3 text-center text-sm font-semibold text-neutral-400 hover:text-white pt-2 cursor-pointer"
                  >
                    Cancel
                  </button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}

      {/* 2. TAKE A BREAK / CONTINUOUS SCROLLING REMINDER MODAL */}
      {showTakeABreakPopup && !isDailyLimitActive && settings.takeBreakEnabled && (
        <motion.div
          id="take-a-break-modal"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 30 }}
          className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-6"
        >
          <div className="w-full max-w-sm bg-neutral-900 border border-neutral-700/70 rounded-3xl p-6 text-center shadow-2xl text-white">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mb-4 ring-1 ring-indigo-500/40">
              <Coffee className="w-8 h-8" />
            </div>

            <span className="inline-block px-3 py-1 text-xs font-semibold uppercase tracking-wider text-indigo-400 bg-indigo-400/10 rounded-full mb-2">
              Time for a pause
            </span>

            <h2 className="text-xl font-bold text-white mb-2">Take a Break</h2>

            <p className="text-neutral-300 text-sm leading-relaxed mb-6">
              Take a break! You have been scrolling for{' '}
              <span className="font-semibold text-white">{settings.takeBreakSeconds}s</span>. Continue or
              exit the app?
            </p>

            <div className="space-y-3">
              <button
                id="btn-break-continue"
                onClick={handleContinueTakeABreak}
                className="w-full py-3.5 px-4 bg-white hover:bg-neutral-100 active:scale-[0.98] text-black font-semibold rounded-xl text-sm transition shadow cursor-pointer"
              >
                Continue Scrolling
              </button>

              <button
                id="btn-break-exit"
                onClick={handleExitApp}
                className="w-full py-3 px-4 bg-neutral-800 hover:bg-neutral-700 active:scale-[0.98] text-neutral-300 font-medium rounded-xl text-sm transition cursor-pointer"
              >
                Exit App
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
