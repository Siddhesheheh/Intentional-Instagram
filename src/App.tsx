import React, { useState, useEffect } from 'react';
import { ScreenTimeProvider, useScreenTime } from './context/ScreenTimeContext';
import { HomeFeed } from './components/HomeFeed';
import { ReelsTab } from './components/ReelsTab';
import { ExploreTab } from './components/ExploreTab';
import { DirectMessagesTab } from './components/DirectMessagesTab';
import { ProfileTab } from './components/ProfileTab';
import { SettingsScreen } from './components/SettingsScreen';
import { SingleReelViewer } from './components/SingleReelViewer';
import { ScreenTimeModals } from './components/ScreenTimeModals';
import { SimulatedHomeScreen } from './components/SimulatedHomeScreen';
import { BottomNav, TabType } from './components/BottomNav';
import { INITIAL_USER_PROFILE } from './data/mockData';
import { Reel } from './types';
import { Wifi, BatteryMedium, Signal, Clock, Maximize2, Minimize2, Smartphone } from 'lucide-react';

function InstagramMobileApp() {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [singleReelView, setSingleReelView] = useState<Reel | null>(null);
  const [isFullScreenView, setIsFullScreenView] = useState(false);
  const [clockTime, setClockTime] = useState('09:41');

  const {
    isAppExited,
    todayUsageSeconds,
    sessionScrollSeconds,
    settings,
    isDailyLimitIgnoredToday,
    formatDuration,
    resetAllTimers,
    handleExitApp,
  } = useScreenTime();

  // Keep phone status bar time updated
  useEffect(() => {
    const update = () => {
      const d = new Date();
      setClockTime(
        d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
      );
    };
    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, []);

  // If the app is exited (e.g. user clicked "Exit App" from modal or settings),
  // show the mobile phone home screen where user can tap the Instagram icon to re-open.
  if (isAppExited) {
    return (
      <div className="w-full min-h-screen bg-neutral-950 flex items-center justify-center p-0 sm:p-4">
        <div className="w-full max-w-[420px] h-[100dvh] sm:h-[860px] max-h-[100dvh] bg-black rounded-none sm:rounded-[44px] shadow-2xl overflow-hidden border-0 sm:border-8 sm:border-neutral-800 flex flex-col relative">
          <SimulatedHomeScreen />
          <ScreenTimeModals />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-neutral-950 flex flex-col items-center justify-center p-0 sm:p-4 font-sans antialiased text-neutral-900 select-none">
      {/* Top Floating Helper Controls for previewers on desktop */}
      <aside aria-label="Demo timer panel" className="hidden sm:flex items-center gap-3 mb-2 px-4 py-1.5 bg-neutral-900/90 backdrop-blur-md rounded-full border border-neutral-800 text-xs text-neutral-300 shadow-lg">
        <div className="flex items-center gap-2">
          <Clock className="w-3.5 h-3.5 text-amber-400" />
          <span>
            Daily:{' '}
            <strong className="text-white">
              {!settings.dailyLimitEnabled
                ? 'Off'
                : isDailyLimitIgnoredToday
                ? `${todayUsageSeconds}s (Ignored)`
                : `${todayUsageSeconds}s`}
            </strong>{' '}
            / {settings.dailyLimitSeconds}s
          </span>
          <span className="text-neutral-600">|</span>
          <span>
            Break: <strong className="text-indigo-400">{settings.takeBreakEnabled ? `${sessionScrollSeconds}s` : 'Off'}</strong> / {settings.takeBreakSeconds}s
          </span>
        </div>

        <button
          onClick={resetAllTimers}
          className="text-[11px] font-semibold text-sky-400 hover:text-sky-300 bg-sky-500/10 px-2 py-0.5 rounded-full cursor-pointer ml-1"
          title="Reset timers to 0s to re-test the popups"
        >
          Reset Timers
        </button>

        <button
          onClick={() => setIsFullScreenView(!isFullScreenView)}
          className="text-neutral-400 hover:text-white p-1 cursor-pointer"
          title={isFullScreenView ? 'Switch to Phone Frame' : 'Switch to Full Width'}
        >
          {isFullScreenView ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
        </button>
      </aside>

      {/* Main Mobile App Container */}
      <main
        className={`w-full ${
          isFullScreenView
            ? 'max-w-4xl h-[100dvh] sm:h-[90vh] rounded-2xl'
            : 'max-w-[420px] h-[100dvh] sm:h-[860px] rounded-none sm:rounded-[44px]'
        } bg-white dark:bg-black shadow-2xl overflow-hidden border-0 sm:border-8 sm:border-neutral-800 flex flex-col relative transition-all duration-300`}
      >
        {/* Mobile Device Status Bar */}
        <div
          className={`h-10 px-6 pt-1 flex items-center justify-between text-xs font-semibold z-40 shrink-0 transition-colors ${
            activeTab === 'reels' || singleReelView
              ? 'bg-black text-white'
              : 'bg-white dark:bg-black text-neutral-900 dark:text-white'
          }`}
        >
          <span>{clockTime}</span>

          {/* Dynamic Island / Speaker Pill */}
          <div className="w-20 h-4 bg-black rounded-full mx-auto hidden sm:block shadow-inner" />

          <div className="flex items-center gap-1.5">
            <Signal className="w-3.5 h-3.5" />
            <Wifi className="w-3.5 h-3.5" />
            <BatteryMedium className="w-4 h-4" />
          </div>
        </div>

        {/* Tab Content Viewport */}
        <div className="flex-1 overflow-hidden relative">
          {/* Settings Screen overlay */}
          {isSettingsOpen ? (
            <SettingsScreen onBack={() => setIsSettingsOpen(false)} />
          ) : (
            <>
              {/* 1. Home Feed */}
              {activeTab === 'home' && (
                <HomeFeed onOpenDMs={() => setActiveTab('messages')} />
              )}

              {/* 2. Explore Tab */}
              {activeTab === 'explore' && <ExploreTab />}

              {/* 3. Reels Tab (Scrolling vertical reels) */}
              {activeTab === 'reels' && <ReelsTab />}

              {/* 4. Direct Messages Tab (Chats + Received Reels) */}
              {activeTab === 'messages' && (
                <DirectMessagesTab
                  onOpenSingleReel={(reel) => setSingleReelView(reel)}
                  onBackToHome={() => setActiveTab('home')}
                />
              )}

              {/* 5. Profile Management Section */}
              {activeTab === 'profile' && (
                <ProfileTab onOpenSettings={() => setIsSettingsOpen(true)} />
              )}
            </>
          )}

          {/* Non-scrollable Single Reel Viewer when a received reel is clicked from DM */}
          {singleReelView && (
            <SingleReelViewer
              reel={singleReelView}
              onClose={() => setSingleReelView(null)}
            />
          )}
        </div>

        {/* Floating Bottom Navigation Dock matching Image 1, 2, 3 */}
        {!isSettingsOpen && !singleReelView && (
          <div className="absolute bottom-8 left-0 right-0 z-40 px-4 flex justify-center pointer-events-none">
            <div className="pointer-events-auto w-full max-w-[370px]">
              <BottomNav
                activeTab={activeTab}
                onSelectTab={(tab) => {
                  setActiveTab(tab);
                  setIsSettingsOpen(false);
                }}
                userProfile={INITIAL_USER_PROFILE}
              />
            </div>
          </div>
        )}

        {/* Phone Bottom Home Bar Indicator (Click to Exit App matching Image 4) */}
        <button
          type="button"
          id="phone-home-indicator-exit"
          onClick={handleExitApp}
          className="h-7 w-full shrink-0 flex items-center justify-center cursor-pointer bg-black group transition-all duration-150 active:scale-95 select-none z-50 hover:bg-neutral-900/60"
          title="Click this bar to exit the app"
          aria-label="Exit app to home screen"
        >
          <div className="w-36 h-1 bg-neutral-400/80 rounded-full group-hover:bg-white group-hover:h-1.5 group-active:bg-white transition-all duration-150 shadow-sm" />
        </button>

        {/* Screen Time Limit Popups and Reminders */}
        <ScreenTimeModals />
      </main>
    </div>
  );
}

export default function App() {
  return (
    <ScreenTimeProvider>
      <InstagramMobileApp />
    </ScreenTimeProvider>
  );
}
