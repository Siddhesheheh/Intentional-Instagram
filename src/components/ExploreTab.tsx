import React, { useState } from 'react';
import { Search, Play, Heart, MessageCircle, X } from 'lucide-react';
import { EXPLORE_POSTS } from '../data/mockData';

export const ExploreTab: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('For You');
  const [selectedPost, setSelectedPost] = useState<(typeof EXPLORE_POSTS)[0] | null>(null);

  const categories = ['For You', 'Reels', 'Architecture', 'Travel', 'Food', 'Design', 'Style'];

  const filteredPosts = EXPLORE_POSTS.filter((post) => {
    if (!searchQuery.trim()) return true;
    return (
      post.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.caption.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div id="explore-container" className="flex flex-col h-full bg-black text-white overflow-y-auto no-scrollbar">
      {/* Search Header */}
      <div className="sticky top-0 z-20 bg-black/95 backdrop-blur-md px-4 pt-2.5 pb-2 border-b border-neutral-900 space-y-2.5">
        <div className="flex items-center gap-2.5 bg-neutral-900 px-3.5 py-2 rounded-xl text-neutral-400 border border-neutral-800">
          <Search className="w-4 h-4 shrink-0 text-neutral-400" />
          <input
            type="text"
            placeholder="Search accounts, audio, tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent text-xs text-white placeholder-neutral-500 focus:outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-xs text-neutral-400 hover:text-neutral-200 cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1 rounded-lg text-xs font-semibold shrink-0 transition cursor-pointer ${
                activeCategory === cat
                  ? 'bg-white text-black'
                  : 'bg-neutral-800/80 text-neutral-300 hover:bg-neutral-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Explore Grid (Multiple posts) */}
      <div className="p-1 pb-28">
        <div className="grid grid-cols-3 gap-1">
          {filteredPosts.map((item, idx) => {
            const isLarge = idx % 7 === 1; // Instagram mixed layout with occasional tall tile
            return (
              <div
                key={item.id}
                onClick={() => setSelectedPost(item)}
                className={`relative group bg-neutral-100 dark:bg-neutral-900 cursor-pointer overflow-hidden ${
                  isLarge ? 'row-span-2' : 'aspect-square'
                }`}
              >
                <img
                  src={item.mediaUrl}
                  alt={item.caption}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />

                {/* Reel icon badge if it's a reel */}
                {item.type === 'reel' && (
                  <div className="absolute top-2 right-2 text-white drop-shadow">
                    <Play className="w-4 h-4 fill-white" />
                  </div>
                )}

                {/* Hover overlay with likes and comments */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-4 text-white font-semibold text-xs">
                  <div className="flex items-center gap-1">
                    <Heart className="w-4 h-4 fill-white" />
                    <span>{item.likes}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageCircle className="w-4 h-4 fill-white" />
                    <span>{item.comments}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Post Details Modal */}
      {selectedPost && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedPost(null)}
        >
          <div
            className="w-full max-w-sm bg-white dark:bg-neutral-900 rounded-3xl overflow-hidden shadow-2xl border border-neutral-200 dark:border-neutral-800"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-3.5 border-b border-neutral-100 dark:border-neutral-800">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-amber-400 to-pink-500 p-0.5">
                  <div className="w-full h-full rounded-full bg-neutral-200 dark:bg-neutral-800" />
                </div>
                <span className="text-xs font-semibold text-neutral-900 dark:text-white">
                  {selectedPost.username}
                </span>
              </div>
              <button
                onClick={() => setSelectedPost(null)}
                className="p-1 rounded-full text-neutral-400 hover:text-neutral-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Media */}
            <div className="aspect-square w-full bg-black relative">
              <img
                src={selectedPost.mediaUrl}
                alt={selectedPost.caption}
                className="w-full h-full object-cover"
              />
              {selectedPost.type === 'reel' && (
                <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-medium text-white flex items-center gap-1">
                  <Play className="w-3 h-3 fill-white" />
                  <span>Reel</span>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-3.5 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-3 font-semibold text-neutral-900 dark:text-white">
                  <span className="flex items-center gap-1">
                    <Heart className="w-4 h-4 text-red-500 fill-red-500" /> {selectedPost.likes}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageCircle className="w-4 h-4 text-neutral-500" /> {selectedPost.comments}
                  </span>
                </div>
                <span className="text-[10px] text-neutral-400">Explore Pick</span>
              </div>

              <p className="text-xs text-neutral-700 dark:text-neutral-300">
                <span className="font-semibold text-neutral-900 dark:text-white mr-1.5">
                  {selectedPost.username}
                </span>
                {selectedPost.caption}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
