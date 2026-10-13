import React, { useState } from 'react';
import {
  ArrowLeft,
  Clock,
  Coffee,
  Hourglass,
  RotateCcw,
  Check,
  ShieldCheck,
  Bell,
  HelpCircle,
  LogOut,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { useScreenTime } from '../context/ScreenTimeContext';

interface SettingsScreenProps {
  onBack: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ onBack }) => {
  const {
    settings,
    updateSettings,
    todayUsageSeconds,
    sessionScrollSeconds,
    isDailyLimitIgnoredToday,
    resetAllTimers,
    handleExitApp,
    formatDuration,
  } = useScreenTime();

  const [activeSubTab, setActiveSubTab] = useState<'menu' | 'limit-usage'>('limit-usage');
  const [dailyInput, setDailyInput] = useState<number>(settings.dailyLimitSeconds);
  const [breakInput, setBreakInput] = useState<number>(settings.takeBreakSeconds);
  const [saveToast, setSaveToast] = useState(false);

  const handleSaveDailyLimit = (val: number) => {
    const valid = Math.max(5, val || 60);
    setDailyInput(valid);
    updateSettings({ dailyLimitSeconds: valid });
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2000);
  };

  const handleSaveBreakInterval = (val: number) => {
    const valid = Math.max(5, val || 30);
    setBreakInput(valid);
    updateSettings({ takeBreakSeconds: valid });
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2000);
  };

  return (
    <div
      id="settings-screen-container"
      className="flex flex-col h-full bg-neutral-50 dark:bg-black text-neutral-900 dark:text-white overflow-y-auto"
    >
      {/* Settings Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-200 dark:border-neutral-900 bg-white/95 dark:bg-black/95 backdrop-blur-md sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (activeSubTab === 'limit-usage') {
                setActiveSubTab('menu');
              } else {
                onBack();
              }
            }}
            className="p-1 -ml-1 text-neutral-800 dark:text-white hover:text-neutral-500 cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-sm font-bold">
            {activeSubTab === 'limit-usage' ? 'Limit Instagram Usage' : 'Settings'}
          </h1>
        </div>

        {saveToast && (
          <span className="text-[11px] font-medium text-emerald-500 flex items-center gap-1">
            <Check className="w-3.5 h-3.5" /> Saved
          </span>
        )}
      </div>

      {/* SUBTAB: Limit Instagram Usage */}
      {activeSubTab === 'limit-usage' ? (
        <div className="p-4 space-y-5 pb-20">
          {/* Live Activity & Timer Tracker Card */}
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-4 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-pink-500 to-amber-500 flex items-center justify-center text-white">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-semibold">Live Screen Time Ticker</h3>
                  <p className="text-[10px] text-neutral-400">Counting active seconds in real time</p>
                </div>
              </div>

              <button
                onClick={resetAllTimers}
                className="text-[11px] font-medium text-sky-500 hover:text-sky-600 flex items-center gap-1 bg-sky-500/10 px-2.5 py-1 rounded-full cursor-pointer"
                title="Reset usage to 0s to re-test limits"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset (0s)</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <div className="bg-neutral-50 dark:bg-neutral-800/60 p-3 rounded-xl border border-neutral-100 dark:border-neutral-800">
                <span className="text-[10px] text-neutral-400 block mb-1">Today's Usage</span>
                <span className={`text-lg font-bold ${settings.dailyLimitEnabled ? 'text-neutral-900 dark:text-white' : 'text-neutral-400'}`}>
                  {settings.dailyLimitEnabled ? `${todayUsageSeconds}s` : 'Off'}
                </span>
                <span className="text-[10px] text-neutral-400 block mt-0.5">
                  {settings.dailyLimitEnabled
                    ? isDailyLimitIgnoredToday
                      ? 'Ignored for today'
                      : `/ ${settings.dailyLimitSeconds}s limit`
                    : 'Toggle is off'}
                </span>
              </div>

              <div className="bg-neutral-50 dark:bg-neutral-800/60 p-3 rounded-xl border border-neutral-100 dark:border-neutral-800">
                <span className="text-[10px] text-neutral-400 block mb-1">Current Scrolling Session</span>
                <span className={`text-lg font-bold ${settings.takeBreakEnabled ? 'text-indigo-500 dark:text-indigo-400' : 'text-neutral-400'}`}>
                  {settings.takeBreakEnabled ? `${sessionScrollSeconds}s` : 'Off'}
                </span>
                <span className="text-[10px] text-neutral-400 block mt-0.5">
                  {settings.takeBreakEnabled ? `/ ${settings.takeBreakSeconds}s break` : 'Toggle is off'}
                </span>
              </div>
            </div>

            {/* Quick Test Action to Simulate Exit */}
            <button
              onClick={handleExitApp}
              className="w-full py-2 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-xs font-semibold text-neutral-700 dark:text-neutral-300 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Simulate Exit App (Tests Re-open State)</span>
            </button>
          </div>

          {/* SECTION 1: Daily Screen Time Limit */}
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-4 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                  <Hourglass className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-neutral-900 dark:text-white">
                    Set Daily Screen Time Limit
                  </h3>
                  <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                    Triggers a full-screen warning once reached
                  </p>
                </div>
              </div>

              {/* Toggle Switch */}
              <button
                id="toggle-daily-limit"
                onClick={() =>
                  updateSettings({ dailyLimitEnabled: !settings.dailyLimitEnabled })
                }
                className={`w-11 h-6 rounded-full transition-colors relative p-0.5 cursor-pointer ${
                  settings.dailyLimitEnabled ? 'bg-sky-500' : 'bg-neutral-300 dark:bg-neutral-700'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    settings.dailyLimitEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
              Set your maximum daily Instagram usage. In accordance with your settings, when you reach this limit (e.g. 1 min / 60s), a full-screen popup will appear asking if you want to continue or exit.
            </p>

            {/* Input in Seconds */}
            <div className="space-y-2 pt-1">
              <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 flex items-center justify-between">
                <span>Daily Limit Timer (in seconds)</span>
                <span className="text-sky-500 font-bold">
                  {formatDuration(dailyInput)}
                </span>
              </label>

              <div className="flex items-center gap-2">
                <input
                  id="input-daily-limit-seconds"
                  type="number"
                  min="5"
                  step="5"
                  value={dailyInput}
                  onChange={(e) => {
                    const val = parseInt(e.target.value, 10);
                    setDailyInput(val);
                    if (val > 0) handleSaveDailyLimit(val);
                  }}
                  className="w-full bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xl px-3.5 py-2 text-sm font-semibold text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
                <span className="text-xs font-medium text-neutral-500 shrink-0">seconds</span>
              </div>

              {/* Quick Presets for easy testing */}
              <div className="flex items-center gap-1.5 pt-1">
                <span className="text-[10px] text-neutral-400 mr-1">Presets:</span>
                {[30, 60, 120, 300].map((sec) => (
                  <button
                    key={sec}
                    onClick={() => handleSaveDailyLimit(sec)}
                    className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg transition cursor-pointer ${
                      dailyInput === sec
                        ? 'bg-neutral-900 text-white dark:bg-white dark:text-black'
                        : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                    }`}
                  >
                    {sec}s {sec === 60 ? '(1m)' : ''}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* SECTION 2 (Below Daily Screen Time Limit): Take a Break / Continuous Scrolling Reminder */}
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-4 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
                  <Coffee className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-neutral-900 dark:text-white">
                    Take a Break Reminder
                  </h3>
                  <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                    Continuous scrolling pause notification
                  </p>
                </div>
              </div>

              {/* Toggle Switch */}
              <button
                id="toggle-break-limit"
                onClick={() =>
                  updateSettings({ takeBreakEnabled: !settings.takeBreakEnabled })
                }
                className={`w-11 h-6 rounded-full transition-colors relative p-0.5 cursor-pointer ${
                  settings.takeBreakEnabled ? 'bg-indigo-500' : 'bg-neutral-300 dark:bg-neutral-700'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    settings.takeBreakEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
              After being on the app continuously for more than the specified seconds (default 30s), a popup appears saying: <em className="text-neutral-900 dark:text-white">"Take a break! You have been scrolling for 30s. Continue or exit the app."</em>
            </p>

            {/* Input in Seconds */}
            <div className="space-y-2 pt-1">
              <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 flex items-center justify-between">
                <span>Break Reminder Interval (in seconds)</span>
                <span className="text-indigo-500 font-bold">
                  {formatDuration(breakInput)}
                </span>
              </label>

              <div className="flex items-center gap-2">
                <input
                  id="input-break-interval-seconds"
                  type="number"
                  min="5"
                  step="5"
                  value={breakInput}
                  onChange={(e) => {
                    const val = parseInt(e.target.value, 10);
                    setBreakInput(val);
                    if (val > 0) handleSaveBreakInterval(val);
                  }}
                  className="w-full bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xl px-3.5 py-2 text-sm font-semibold text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <span className="text-xs font-medium text-neutral-500 shrink-0">seconds</span>
              </div>

              {/* Quick Presets */}
              <div className="flex items-center gap-1.5 pt-1">
                <span className="text-[10px] text-neutral-400 mr-1">Presets:</span>
                {[15, 30, 45, 60].map((sec) => (
                  <button
                    key={sec}
                    onClick={() => handleSaveBreakInterval(sec)}
                    className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg transition cursor-pointer ${
                      breakInput === sec
                        ? 'bg-neutral-900 text-white dark:bg-white dark:text-black'
                        : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                    }`}
                  >
                    {sec}s
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* General Settings Menu */
        <div className="divide-y divide-neutral-200 dark:divide-neutral-800">
          <div className="p-4">
            <h2 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
              Digital Wellbeing & Screen Time
            </h2>
            <div
              onClick={() => setActiveSubTab('limit-usage')}
              className="flex items-center justify-between py-3 px-3 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-850 transition cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-pink-500 flex items-center justify-center text-white">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-neutral-900 dark:text-white">
                    Limit Instagram Usage
                  </h3>
                  <p className="text-[11px] text-neutral-400">
                    Daily limit: {settings.dailyLimitSeconds}s • Break: {settings.takeBreakSeconds}s
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-neutral-400" />
            </div>
          </div>

          <div className="p-4 space-y-1">
            <h2 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
              Preferences
            </h2>
            <div className="flex items-center justify-between py-2.5 text-xs text-neutral-800 dark:text-neutral-200 cursor-pointer">
              <div className="flex items-center gap-3">
                <Bell className="w-4 h-4 text-neutral-500" />
                <span>Notifications</span>
              </div>
              <ChevronRight className="w-4 h-4 text-neutral-400" />
            </div>
            <div className="flex items-center justify-between py-2.5 text-xs text-neutral-800 dark:text-neutral-200 cursor-pointer">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-4 h-4 text-neutral-500" />
                <span>Privacy & Security</span>
              </div>
              <ChevronRight className="w-4 h-4 text-neutral-400" />
            </div>
            <div className="flex items-center justify-between py-2.5 text-xs text-neutral-800 dark:text-neutral-200 cursor-pointer">
              <div className="flex items-center gap-3">
                <HelpCircle className="w-4 h-4 text-neutral-500" />
                <span>Help & About</span>
              </div>
              <ChevronRight className="w-4 h-4 text-neutral-400" />
            </div>
          </div>

          <div className="p-4">
            <button
              onClick={handleExitApp}
              className="w-full py-2.5 text-xs font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Exit App</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
