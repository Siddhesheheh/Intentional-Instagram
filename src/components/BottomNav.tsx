import React from 'react';
import { Search } from 'lucide-react';
import { UserProfile } from '../types';

export type TabType = 'home' | 'reels' | 'messages' | 'explore' | 'profile';

interface BottomNavProps {
  activeTab: TabType;
  onSelectTab: (tab: TabType) => void;
  userProfile: UserProfile;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onSelectTab,
  userProfile,
}) => {
  return (
    <nav
      id="instagram-floating-bottom-dock"
      aria-label="Instagram navigation"
      className="bg-[#1c1c1e]/90 backdrop-blur-2xl border border-white/15 rounded-full px-2 py-1.5 shadow-[0_8px_32px_rgba(0,0,0,0.6)] flex items-center justify-around text-white select-none w-full"
    >
      {/* 1. Home Tab */}
      <button
        id="nav-tab-home"
        onClick={() => onSelectTab('home')}
        className={`transition-all duration-200 cursor-pointer flex items-center justify-center ${
          activeTab === 'home'
            ? 'bg-white/20 text-white rounded-full px-4 py-1.5 shadow-sm'
            : 'text-white/80 hover:text-white px-2.5 py-1.5 active:scale-90'
        }`}
        title="Home"
        aria-label="Home Feed"
      >
        <svg
          viewBox="0 0 24 24"
          className="w-5 h-5 transition-all"
          fill={activeTab === 'home' ? 'currentColor' : 'none'}
          stroke="currentColor"
          strokeWidth={activeTab === 'home' ? '0' : '2'}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3 10.5V20a1 1 0 001 1h5a1 1 0 001-1v-5a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 001 1h5a1 1 0 001-1v-9.5a1 1 0 00-.39-.79l-7-5.5a1 1 0 00-1.22 0l-7 5.5A1 1 0 003 10.5z" />
        </svg>
      </button>

      {/* 2. Reels Tab */}
      <button
        id="nav-tab-reels"
        onClick={() => onSelectTab('reels')}
        className={`transition-all duration-200 cursor-pointer flex items-center justify-center ${
          activeTab === 'reels'
            ? 'bg-white/20 text-white rounded-full px-4 py-1.5 shadow-sm'
            : 'text-white/80 hover:text-white px-2.5 py-1.5 active:scale-90'
        }`}
        title="Reels"
        aria-label="Reels Tab"
      >
        <svg
          viewBox="0 0 24 24"
          className="w-5 h-5 transition-all"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="2.5" y="3.5" width="19" height="17" rx="5" />
          <polygon
            points="10,8.5 16,12 10,15.5"
            fill={activeTab === 'reels' ? 'currentColor' : 'currentColor'}
            stroke="none"
          />
          <line x1="2.5" y1="8" x2="6.5" y2="3.5" />
          <line x1="9" y1="8" x2="13" y2="3.5" />
          <line x1="15.5" y1="8" x2="19.5" y2="3.5" />
        </svg>
      </button>

      {/* 3. Direct Messages Tab (Send Paper Plane) */}
      <button
        id="nav-tab-messages"
        onClick={() => onSelectTab('messages')}
        className={`transition-all duration-200 cursor-pointer flex items-center justify-center relative ${
          activeTab === 'messages'
            ? 'bg-white/20 text-white rounded-full px-4 py-1.5 shadow-sm'
            : 'text-white/80 hover:text-white px-2.5 py-1.5 active:scale-90'
        }`}
        title="Direct Messages"
        aria-label="Direct Messages"
      >
        <div className="relative">
          <svg
            viewBox="0 0 24 24"
            className="w-5 h-5 -rotate-6 transition-all"
            fill="none"
            stroke="currentColor"
            strokeWidth={activeTab === 'messages' ? '2.5' : '2'}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M22 2L11 13" />
            <path d="M22 2L15 22L11 13L2 9L22 2Z" />
          </svg>
          {/* Red notification dot on message icon */}
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full ring-1 ring-black" />
        </div>
      </button>

      {/* 4. Search / Explore Tab */}
      <button
        id="nav-tab-explore"
        onClick={() => onSelectTab('explore')}
        className={`transition-all duration-200 cursor-pointer flex items-center justify-center ${
          activeTab === 'explore'
            ? 'bg-white/20 text-white rounded-full px-4 py-1.5 shadow-sm'
            : 'text-white/80 hover:text-white px-2.5 py-1.5 active:scale-90'
        }`}
        title="Search"
        aria-label="Search and Explore"
      >
        <Search
          className={`w-5 h-5 ${
            activeTab === 'explore' ? 'stroke-[2.8]' : 'stroke-[2]'
          }`}
        />
      </button>

      {/* 5. Profile Tab */}
      <button
        id="nav-tab-profile"
        onClick={() => onSelectTab('profile')}
        className="transition-all duration-200 cursor-pointer flex items-center justify-center px-2 py-1 relative active:scale-90"
        title="Profile"
        aria-label="User Profile"
      >
        <div className="relative">
          <div
            className={`w-6 h-6 rounded-full overflow-hidden transition-all ${
              activeTab === 'profile'
                ? 'ring-2 ring-white ring-offset-1 ring-offset-black scale-105'
                : 'opacity-85 hover:opacity-100'
            }`}
          >
            <img
              src={userProfile.avatar}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
          {/* Red notification dot on profile avatar */}
          <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full ring-1 ring-black" />
        </div>
      </button>
    </nav>
  );
};
