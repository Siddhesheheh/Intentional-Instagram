import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ScreenTimeSettings } from '../types';

interface ScreenTimeContextType {
  settings: ScreenTimeSettings;
  todayUsageSeconds: number;
  sessionScrollSeconds: number;
  isAppExited: boolean;
  showDailyLimitPopup: boolean;
  showReopenDailyLimitModal: boolean;
  showTakeABreakPopup: boolean;
  isDailyLimitIgnoredToday: boolean;
  
  // Actions
  updateSettings: (newSettings: Partial<ScreenTimeSettings>) => void;
  handleContinueDailyLimit: () => void;
  handleIgnoreDailyLimitToday: () => void;
  handleUse15MinutesMore: () => void;
  handleExitApp: () => void;
  handleReopenApp: () => void;
  handleContinueTakeABreak: () => void;
  handleCloseTakeABreak: () => void;
  resetAllTimers: () => void;
  formatDuration: (seconds: number) => string;
  formatDetailedTime: (seconds: number) => string;
}

const STORAGE_KEYS = {
  SETTINGS: 'ig_screen_time_settings_v1',
  USAGE_SECONDS: 'ig_today_usage_seconds_v1',
  USAGE_DATE: 'ig_today_usage_date_v1',
  DAILY_LIMIT_DISMISSED: 'ig_daily_limit_dismissed_v1',
  DAILY_LIMIT_IGNORED_DATE: 'ig_daily_limit_ignored_date_v1',
  APP_EXITED: 'ig_app_exited_state_v1',
};

const DEFAULT_SETTINGS: ScreenTimeSettings = {
  dailyLimitEnabled: true,
  dailyLimitSeconds: 60, // 1 min (60s) as requested
  takeBreakEnabled: true,
  takeBreakSeconds: 30, // 30s continuous as requested
};

const ScreenTimeContext = createContext<ScreenTimeContextType | null>(null);

export const ScreenTimeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<ScreenTimeSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  const getTodayDateStr = () => new Date().toISOString().split('T')[0];

  const [todayUsageSeconds, setTodayUsageSeconds] = useState<number>(() => {
    try {
      const savedDate = localStorage.getItem(STORAGE_KEYS.USAGE_DATE);
      const today = getTodayDateStr();
      if (savedDate !== today) {
        localStorage.setItem(STORAGE_KEYS.USAGE_DATE, today);
        localStorage.setItem(STORAGE_KEYS.USAGE_SECONDS, '0');
        localStorage.removeItem(STORAGE_KEYS.DAILY_LIMIT_DISMISSED);
        return 0;
      }
      const savedSec = localStorage.getItem(STORAGE_KEYS.USAGE_SECONDS);
      return savedSec ? parseInt(savedSec, 10) : 0;
    } catch {
      return 0;
    }
  });

  const [sessionScrollSeconds, setSessionScrollSeconds] = useState<number>(0);
  const [isAppExited, setIsAppExited] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.APP_EXITED) === 'true';
    } catch {
      return false;
    }
  });

  // Flag if user already explicitly clicked "Continue" for daily limit during current session
  const [dailyLimitDismissed, setDailyLimitDismissed] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.DAILY_LIMIT_DISMISSED) === 'true';
    } catch {
      return false;
    }
  });

  // Flag if user chose "Ignore limit for today"
  const [dailyLimitIgnoredDate, setDailyLimitIgnoredDate] = useState<string | null>(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.DAILY_LIMIT_IGNORED_DATE);
    } catch {
      return null;
    }
  });

  const isDailyLimitIgnoredToday = dailyLimitIgnoredDate === getTodayDateStr();

  const [showDailyLimitPopup, setShowDailyLimitPopup] = useState<boolean>(false);
  const [showReopenDailyLimitModal, setShowReopenDailyLimitModal] = useState<boolean>(false);
  const [showTakeABreakPopup, setShowTakeABreakPopup] = useState<boolean>(false);

  // Check initial state on mount if app is being re-opened after already reaching limit
  useEffect(() => {
    if (
      !isAppExited &&
      settings.dailyLimitEnabled &&
      !isDailyLimitIgnoredToday &&
      todayUsageSeconds >= settings.dailyLimitSeconds
    ) {
      setShowReopenDailyLimitModal(true);
    }
  }, []);

  // Main active timer ticking every second
  useEffect(() => {
    if (isAppExited) return;

    const interval = setInterval(() => {
      // current scrolling session timer should only start when the toggle for it is on
      if (settings.takeBreakEnabled) {
        setSessionScrollSeconds((prev) => prev + 1);
      }

      // set screen time limit timer should only start when the toggle for it is on
      if (settings.dailyLimitEnabled) {
        setTodayUsageSeconds((prev) => {
          const next = prev + 1;
          try {
            localStorage.setItem(STORAGE_KEYS.USAGE_SECONDS, next.toString());
            localStorage.setItem(STORAGE_KEYS.USAGE_DATE, getTodayDateStr());
          } catch {
            // ignore
          }
          return next;
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isAppExited, settings.dailyLimitEnabled, settings.takeBreakEnabled]);

  // Monitor daily limit threshold
  useEffect(() => {
    if (isAppExited) return;

    if (
      settings.dailyLimitEnabled &&
      !isDailyLimitIgnoredToday &&
      todayUsageSeconds >= settings.dailyLimitSeconds &&
      !dailyLimitDismissed &&
      !showDailyLimitPopup &&
      !showReopenDailyLimitModal
    ) {
      setShowDailyLimitPopup(true);
    }
  }, [
    todayUsageSeconds,
    settings.dailyLimitEnabled,
    settings.dailyLimitSeconds,
    dailyLimitDismissed,
    isDailyLimitIgnoredToday,
    isAppExited,
    showDailyLimitPopup,
    showReopenDailyLimitModal,
  ]);

  // Monitor Take A Break threshold
  useEffect(() => {
    if (isAppExited) return;

    if (
      settings.takeBreakEnabled &&
      sessionScrollSeconds >= settings.takeBreakSeconds &&
      !showTakeABreakPopup &&
      !showDailyLimitPopup &&
      !showReopenDailyLimitModal
    ) {
      setShowTakeABreakPopup(true);
    }
  }, [
    sessionScrollSeconds,
    settings.takeBreakEnabled,
    settings.takeBreakSeconds,
    showTakeABreakPopup,
    showDailyLimitPopup,
    showReopenDailyLimitModal,
    isAppExited,
  ]);

  const updateSettings = useCallback((newSettings: Partial<ScreenTimeSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      try {
        localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });

    // If takeBreakEnabled is turned OFF or ON, reset the current scrolling session timer
    if (newSettings.takeBreakEnabled !== undefined) {
      setSessionScrollSeconds(0);
      if (!newSettings.takeBreakEnabled) {
        setShowTakeABreakPopup(false);
      }
    }

    // If dailyLimitEnabled is toggled (turned ON or OFF), reset the daily usage count and ignore state
    if (newSettings.dailyLimitEnabled !== undefined) {
      setTodayUsageSeconds(0);
      setDailyLimitDismissed(false);
      setDailyLimitIgnoredDate(null);
      try {
        localStorage.setItem(STORAGE_KEYS.USAGE_SECONDS, '0');
        localStorage.removeItem(STORAGE_KEYS.DAILY_LIMIT_DISMISSED);
        localStorage.removeItem(STORAGE_KEYS.DAILY_LIMIT_IGNORED_DATE);
      } catch {
        // ignore
      }
      setShowDailyLimitPopup(false);
      setShowReopenDailyLimitModal(false);
    }
  }, []);

  const handleContinueDailyLimit = useCallback(() => {
    setShowDailyLimitPopup(false);
    setShowReopenDailyLimitModal(false);
    setDailyLimitDismissed(true);
    try {
      localStorage.setItem(STORAGE_KEYS.DAILY_LIMIT_DISMISSED, 'true');
    } catch {
      // ignore
    }
  }, []);

  const handleIgnoreDailyLimitToday = useCallback(() => {
    const today = getTodayDateStr();
    setDailyLimitIgnoredDate(today);
    setShowDailyLimitPopup(false);
    setShowReopenDailyLimitModal(false);
    try {
      localStorage.setItem(STORAGE_KEYS.DAILY_LIMIT_IGNORED_DATE, today);
    } catch {
      // ignore
    }
  }, []);

  const handleUse15MinutesMore = useCallback(() => {
    setSettings((prev) => {
      const newLimit = Math.max(prev.dailyLimitSeconds, todayUsageSeconds) + 900;
      const updated = { ...prev, dailyLimitSeconds: newLimit };
      try {
        localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
    setShowDailyLimitPopup(false);
    setShowReopenDailyLimitModal(false);
  }, [todayUsageSeconds]);

  const handleExitApp = useCallback(() => {
    setShowDailyLimitPopup(false);
    setShowReopenDailyLimitModal(false);
    setShowTakeABreakPopup(false);
    setIsAppExited(true);
    // Take a break timer always resets when exiting the app
    setSessionScrollSeconds(0);
    // When exited, clear the session dismiss so next time app opens, it asks to continue or exit!
    setDailyLimitDismissed(false);
    try {
      localStorage.setItem(STORAGE_KEYS.APP_EXITED, 'true');
      localStorage.setItem(STORAGE_KEYS.DAILY_LIMIT_DISMISSED, 'false');
    } catch {
      // ignore
    }
  }, []);

  const handleReopenApp = useCallback(() => {
    setIsAppExited(false);
    // Reset take a break timer when re-entering app
    setSessionScrollSeconds(0);
    try {
      localStorage.setItem(STORAGE_KEYS.APP_EXITED, 'false');
    } catch {
      // ignore
    }

    // Check if limit was already consumed and NOT ignored for today
    if (
      settings.dailyLimitEnabled &&
      !isDailyLimitIgnoredToday &&
      todayUsageSeconds >= settings.dailyLimitSeconds
    ) {
      setShowReopenDailyLimitModal(true);
      setShowDailyLimitPopup(false);
    }
  }, [settings.dailyLimitEnabled, isDailyLimitIgnoredToday, todayUsageSeconds, settings.dailyLimitSeconds]);

  const handleContinueTakeABreak = useCallback(() => {
    setShowTakeABreakPopup(false);
    // Reset session scroll seconds to 0 so next 30s will trigger again
    setSessionScrollSeconds(0);
  }, []);

  const handleCloseTakeABreak = useCallback(() => {
    setShowTakeABreakPopup(false);
    setSessionScrollSeconds(0);
  }, []);

  const resetAllTimers = useCallback(() => {
    setTodayUsageSeconds(0);
    setSessionScrollSeconds(0);
    setDailyLimitDismissed(false);
    setDailyLimitIgnoredDate(null);
    setShowDailyLimitPopup(false);
    setShowReopenDailyLimitModal(false);
    setShowTakeABreakPopup(false);
    try {
      localStorage.setItem(STORAGE_KEYS.USAGE_SECONDS, '0');
      localStorage.setItem(STORAGE_KEYS.DAILY_LIMIT_DISMISSED, 'false');
      localStorage.removeItem(STORAGE_KEYS.DAILY_LIMIT_IGNORED_DATE);
    } catch {
      // ignore
    }
  }, []);

  const formatDuration = useCallback((seconds: number): string => {
    if (seconds < 60) {
      return `${seconds}s`;
    }
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (secs === 0) {
      return `${mins}min`;
    }
    return `${mins}min ${secs}s`;
  }, []);

  const formatDetailedTime = useCallback((seconds: number): string => {
    if (seconds <= 0) return '0 seconds';
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      if (mins > 0) {
        return `${hours} hour${hours > 1 ? 's' : ''}, ${mins} minute${mins > 1 ? 's' : ''}`;
      }
      return `${hours} hour${hours > 1 ? 's' : ''}`;
    }

    if (mins > 0) {
      if (secs > 0) {
        return `${mins} minute${mins > 1 ? 's' : ''}, ${secs} second${secs > 1 ? 's' : ''}`;
      }
      return `${mins} minute${mins > 1 ? 's' : ''}`;
    }

    return `${secs} second${secs !== 1 ? 's' : ''}`;
  }, []);

  return (
    <ScreenTimeContext.Provider
      value={{
        settings,
        todayUsageSeconds,
        sessionScrollSeconds,
        isAppExited,
        showDailyLimitPopup,
        showReopenDailyLimitModal,
        showTakeABreakPopup,
        isDailyLimitIgnoredToday,
        updateSettings,
        handleContinueDailyLimit,
        handleIgnoreDailyLimitToday,
        handleUse15MinutesMore,
        handleExitApp,
        handleReopenApp,
        handleContinueTakeABreak,
        handleCloseTakeABreak,
        resetAllTimers,
        formatDuration,
        formatDetailedTime,
      }}
    >
      {children}
    </ScreenTimeContext.Provider>
  );
};

export const useScreenTime = () => {
  const context = useContext(ScreenTimeContext);
  if (!context) {
    throw new Error('useScreenTime must be used within a ScreenTimeProvider');
  }
  return context;
};
