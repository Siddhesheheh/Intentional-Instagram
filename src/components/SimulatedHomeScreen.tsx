import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Wifi, BatteryMedium, Signal, RotateCcw } from 'lucide-react';
import { useScreenTime } from '../context/ScreenTimeContext';

export const SimulatedHomeScreen: React.FC = () => {
  const { handleReopenApp, resetAllTimers, todayUsageSeconds, formatDuration } = useScreenTime();
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-full min-h-[640px] flex flex-col justify-between p-6 bg-gradient-to-b from-slate-900 via-indigo-950 to-neutral-950 text-white select-none overflow-hidden font-sans">
      {/* Phone status bar */}
      <div className="flex items-center justify-between text-xs text-white/80 font-medium px-2 pt-1">
        <span>{currentTime || '12:00'}</span>
        <div className="flex items-center gap-1.5">
          <Signal className="w-3.5 h-3.5" />
          <Wifi className="w-3.5 h-3.5" />
          <BatteryMedium className="w-4 h-4" />
        </div>
      </div>

      {/* Center Clock Widget */}
      <div className="text-center my-auto space-y-2">
        <h1 className="text-6xl font-light tracking-tight text-white/90">
          {currentTime || '12:00'}
        </h1>
        <p className="text-sm font-medium text-white/60">
          {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
        </p>

        <div className="pt-6 inline-block">
          <div className="px-4 py-2 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-xs text-white/80">
            App closed • Usage today: <span className="font-semibold text-amber-300">{formatDuration(todayUsageSeconds)}</span>
          </div>
        </div>
      </div>

      {/* App Grid / Dock */}
      <div className="w-full max-w-xs mx-auto space-y-4 mb-4">
        <p className="text-center text-xs text-white/50 animate-pulse">
          Tap Instagram to re-open
        </p>

        <div className="flex items-center justify-around bg-white/10 backdrop-blur-xl border border-white/15 rounded-3xl p-4 shadow-xl">
          {/* Instagram App Icon */}
          <motion.button
            id="reopen-instagram-app-icon"
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.05 }}
            onClick={handleReopenApp}
            className="flex flex-col items-center gap-1.5 group cursor-pointer focus:outline-none"
          >
            <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 via-pink-500 to-purple-600 p-0.5 shadow-lg shadow-pink-500/30">
              <div className="w-full h-full rounded-[14px] bg-gradient-to-tr from-amber-400 via-pink-600 to-purple-700 flex items-center justify-center text-white">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-8 h-8"
                >
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
              </div>
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-[10px] font-bold text-white rounded-full flex items-center justify-center border-2 border-black">
                1
              </span>
            </div>
            <span className="text-[11px] font-medium text-white/90">Instagram</span>
          </motion.button>
        </div>

        {/* Quick Reset button for convenient testing */}
        <div className="text-center pt-2">
          <button
            onClick={resetAllTimers}
            className="inline-flex items-center gap-1.5 text-xs text-white/50 hover:text-white/90 transition px-3 py-1.5 rounded-full hover:bg-white/10 cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Timers to 0s (for test)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
