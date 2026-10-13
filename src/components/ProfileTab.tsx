import React, { useState } from 'react';
import {
  Grid,
  Play,
  Repeat2,
  UserCheck,
  UserPlus,
  Plus,
  ChevronDown,
  Menu,
  Lock,
  Volume2,
  Music,
  Share2,
  X,
  Check,
} from 'lucide-react';
import { UserProfile } from '../types';
import { INITIAL_USER_PROFILE } from '../data/mockData';

interface ProfileTabProps {
  onOpenSettings: () => void;
}

export const ProfileTab: React.FC<ProfileTabProps> = ({ onOpenSettings }) => {
  const [profile, setProfile] = useState<UserProfile>(INITIAL_USER_PROFILE);
  const [activeSubTab, setActiveSubTab] = useState<'grid' | 'reels' | 'reposts' | 'tagged'>('grid');
  const [isEditing, setIsEditing] = useState(false);
  const [selectedPost, setSelectedPost] = useState<string | null>(null);

  // Edit form state
  const [editName, setEditName] = useState(profile.name);
  const [editBio, setEditBio] = useState(profile.bio);
  const [editAvatar, setEditAvatar] = useState(profile.avatar);

  const handleSaveProfile = () => {
    setProfile((prev) => ({
      ...prev,
      name: editName,
      bio: editBio,
      avatar: editAvatar,
    }));
    setIsEditing(false);
  };

  const userPosts = [
    {
      img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
      type: 'reel',
      plays: '12.4K',
    },
    {
      img: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80',
      type: 'carousel',
    },
    {
      img: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80',
      type: 'photo',
    },
    {
      img: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=600&q=80',
      type: 'reel',
      plays: '8.9K',
    },
    {
      img: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=600&q=80',
      type: 'photo',
    },
    {
      img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80',
      type: 'reel',
      plays: '45.1K',
    },
  ];

  return (
    <div
      id="profile-container"
      className="flex flex-col h-full bg-black text-white overflow-y-auto no-scrollbar"
    >
      {/* Top Bar matching Image 3: Plus on left, Lock + username ⌵ • center, @ badge + Menu on right */}
      <header className="flex items-center justify-between px-4 py-2.5 bg-black/95 backdrop-blur-md sticky top-0 z-20 border-b border-neutral-900">
        <button
          className="p-1 text-white hover:text-neutral-400 transition cursor-pointer"
          title="New post/highlight"
        >
          <Plus className="w-6 h-6 stroke-[2]" />
        </button>

        <div className="flex items-center gap-1.5 cursor-pointer">
          <Lock className="w-3.5 h-3.5 text-white" />
          <span className="text-sm font-bold tracking-tight text-white">
            {profile.username}
          </span>
          <ChevronDown className="w-4 h-4 text-white/80" />
          <span className="w-2 h-2 bg-red-500 rounded-full" />
        </div>

        <div className="flex items-center gap-4">
          <button
            className="p-1 text-white hover:text-neutral-400 transition cursor-pointer relative"
            title="Threads notifications"
          >
            <span className="font-bold text-base leading-none">@</span>
            <span className="absolute -top-1 -right-1.5 bg-red-500 text-[10px] font-bold text-white w-4 h-4 rounded-full flex items-center justify-center">
              6
            </span>
          </button>

          <button
            id="profile-hamburger-settings-button"
            onClick={onOpenSettings}
            className="p-1 text-white hover:text-neutral-400 transition cursor-pointer"
            title="Menu & Screen Time Limits"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </header>

      {/* Profile Overview */}
      <div className="px-4 pt-3 pb-2 space-y-3.5">
        {/* Avatar with Note Bubble + Stats */}
        <div className="flex items-center justify-between gap-4">
          {/* Avatar with Note Bubble matching Image 3 */}
          <div className="relative shrink-0 pt-5">
            {/* Note Bubble */}
            <div className="absolute top-0 left-0 bg-neutral-800 text-white text-[10px] px-2.5 py-1 rounded-2xl shadow-lg border border-neutral-700/60 max-w-[110px] truncate flex items-center gap-1">
              <span>Unpopular opinion...</span>
              <span className="text-[9px]">💬</span>
            </div>

            <div className="relative mt-1">
              <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-neutral-800">
                <img
                  src={profile.avatar}
                  alt={profile.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Plus badge on avatar bottom right */}
              <div className="absolute bottom-0 right-0 w-6 h-6 bg-white text-black rounded-full flex items-center justify-center border-2 border-black font-bold shadow cursor-pointer">
                <Plus className="w-3.5 h-3.5 stroke-[3]" />
              </div>
            </div>
          </div>

          {/* Stats: Posts, Followers, Following matching Image 3 */}
          <div className="flex-1 flex items-center justify-around text-center">
            <div>
              <span className="block text-base font-bold text-white">
                {profile.postsCount}
              </span>
              <span className="text-xs text-neutral-400">posts</span>
            </div>

            <div className="cursor-pointer">
              <span className="block text-base font-bold text-white">
                {profile.followersCount}
              </span>
              <span className="text-xs text-neutral-400">followers</span>
            </div>

            <div className="cursor-pointer">
              <span className="block text-base font-bold text-white">
                {profile.followingCount}
              </span>
              <span className="text-xs text-neutral-400">following</span>
            </div>
          </div>
        </div>

        {/* Bio info matching Image 3 */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-xs font-bold text-white">{profile.name}</h1>
            <span className="text-xs text-neutral-400">he/him</span>
          </div>

          <p className="text-xs text-neutral-300 leading-relaxed whitespace-pre-line">
            {profile.bio}
          </p>

          {/* Music track chip matching Image 3 */}
          <div className="pt-1">
            <div className="inline-flex items-center gap-1.5 bg-neutral-900 border border-neutral-800 px-2.5 py-1 rounded-full text-xs text-white">
              <Play className="w-2.5 h-2.5 fill-white text-white" />
              <span className="text-[11px] font-medium text-neutral-200 truncate max-w-[200px]">
                Freezing · Peter Cat Recording Co.
              </span>
              <span className="text-[10px] text-neutral-400 ml-1">+ Add</span>
            </div>
          </div>
        </div>

        {/* Action buttons row matching Image 3: Edit profile, Share profile, Add contact icon */}
        <div className="flex items-center gap-2 pt-1">
          <button
            id="btn-edit-profile"
            onClick={() => setIsEditing(true)}
            className="flex-1 py-1.5 px-3 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 rounded-lg text-xs font-semibold text-white transition cursor-pointer text-center"
          >
            Edit profile
          </button>

          <button
            onClick={() => alert('Profile link copied to clipboard!')}
            className="flex-1 py-1.5 px-3 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 rounded-lg text-xs font-semibold text-white transition cursor-pointer text-center"
          >
            Share profile
          </button>

          <button
            onClick={() => alert('Contacts synced')}
            className="p-1.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 rounded-lg text-white transition cursor-pointer"
            title="Discover People"
          >
            <UserPlus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Tabs Row: 4 tabs: 3x3 Grid, Reels, Reposts, Tagged */}
      <div className="flex items-center justify-around border-t border-neutral-900 text-neutral-400 mt-2">
        <button
          onClick={() => setActiveSubTab('grid')}
          className={`flex-1 py-2.5 flex items-center justify-center cursor-pointer border-b-2 transition ${
            activeSubTab === 'grid'
              ? 'border-white text-white'
              : 'border-transparent text-neutral-500 hover:text-white'
          }`}
          title="Grid Posts"
        >
          <Grid className="w-5 h-5" />
        </button>

        <button
          onClick={() => setActiveSubTab('reels')}
          className={`flex-1 py-2.5 flex items-center justify-center cursor-pointer border-b-2 transition ${
            activeSubTab === 'reels'
              ? 'border-white text-white'
              : 'border-transparent text-neutral-500 hover:text-white'
          }`}
          title="Reels"
        >
          <Play className="w-5 h-5" />
        </button>

        <button
          onClick={() => setActiveSubTab('reposts')}
          className={`flex-1 py-2.5 flex items-center justify-center cursor-pointer border-b-2 transition ${
            activeSubTab === 'reposts'
              ? 'border-white text-white'
              : 'border-transparent text-neutral-500 hover:text-white'
          }`}
          title="Reposts"
        >
          <Repeat2 className="w-5 h-5" />
        </button>

        <button
          onClick={() => setActiveSubTab('tagged')}
          className={`flex-1 py-2.5 flex items-center justify-center cursor-pointer border-b-2 transition ${
            activeSubTab === 'tagged'
              ? 'border-white text-white'
              : 'border-transparent text-neutral-500 hover:text-white'
          }`}
          title="Tagged"
        >
          <UserCheck className="w-5 h-5" />
        </button>
      </div>

      {/* 3-Column Grid Content matching Image 3 with corner icons */}
      <div className="p-0.5 pb-28">
        <div className="grid grid-cols-3 gap-0.5">
          {userPosts.map((post, idx) => (
            <div
              key={idx}
              onClick={() => setSelectedPost(post.img)}
              className="aspect-square bg-neutral-900 cursor-pointer overflow-hidden relative group"
            >
              <img
                src={post.img}
                alt={`Post ${idx + 1}`}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
              />

              {/* Corner badge indicator (Reel / Carousel) */}
              {post.type === 'reel' && (
                <div className="absolute top-1.5 right-1.5 text-white drop-shadow">
                  <Play className="w-3.5 h-3.5 fill-white" />
                </div>
              )}
              {post.type === 'carousel' && (
                <div className="absolute top-1.5 right-1.5 text-white drop-shadow">
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2zm0 16H5V5h14v14zM21 7v14H7v2h14a2 2 0 002-2V7h-2z" />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-sm p-5 space-y-4 text-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <button
                onClick={() => setIsEditing(false)}
                className="text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
              <h3 className="font-bold text-sm">Edit Profile</h3>
              <button
                onClick={handleSaveProfile}
                className="text-sky-400 font-semibold text-sm hover:text-sky-300"
              >
                Done
              </button>
            </div>

            <div className="flex flex-col items-center gap-2">
              <img
                src={editAvatar}
                alt="Avatar preview"
                className="w-20 h-20 rounded-full object-cover border-2 border-neutral-700"
              />
              <button
                onClick={() => {
                  const newUrl = prompt('Enter new avatar image URL:', editAvatar);
                  if (newUrl) setEditAvatar(newUrl);
                }}
                className="text-xs text-sky-400 font-semibold"
              >
                Change photo
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-neutral-400 block mb-1">Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-white outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="text-neutral-400 block mb-1">Bio</label>
                <textarea
                  rows={3}
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-white outline-none focus:border-sky-500"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Selected Post Zoom Modal */}
      {selectedPost && (
        <div
          onClick={() => setSelectedPost(null)}
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 cursor-pointer"
        >
          <div className="relative max-w-sm w-full bg-neutral-950 rounded-2xl overflow-hidden border border-neutral-800">
            <button
              onClick={() => setSelectedPost(null)}
              className="absolute top-3 right-3 text-white bg-black/50 p-1.5 rounded-full z-10"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={selectedPost}
              alt="Expanded post"
              className="w-full aspect-square object-cover"
            />
          </div>
        </div>
      )}
    </div>
  );
};
