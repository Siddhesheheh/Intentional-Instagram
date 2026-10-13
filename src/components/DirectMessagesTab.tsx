import React, { useState } from 'react';
import {
  ArrowLeft,
  Search,
  Camera,
  Phone,
  Video,
  Send,
  Heart,
  Play,
  Image as ImageIcon,
  Smile,
} from 'lucide-react';
import { ChatThread, ChatMessage, Reel } from '../types';
import { INITIAL_CHAT_THREADS } from '../data/mockData';

interface DirectMessagesTabProps {
  onOpenSingleReel: (reel: Reel) => void;
  onBackToHome?: () => void;
}

export const DirectMessagesTab: React.FC<DirectMessagesTabProps> = ({
  onOpenSingleReel,
  onBackToHome,
}) => {
  const [threads, setThreads] = useState<ChatThread[]>(INITIAL_CHAT_THREADS);
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [inputText, setInputText] = useState('');

  const activeThread = threads.find((t) => t.id === activeThreadId);

  const filteredThreads = threads.filter(
    (t) =>
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendMessage = () => {
    if (!inputText.trim() || !activeThreadId) return;

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'me',
      text: inputText.trim(),
      timestamp: 'Just now',
    };

    setThreads((prev) =>
      prev.map((thread) => {
        if (thread.id === activeThreadId) {
          return {
            ...thread,
            lastMessage: inputText.trim(),
            lastMessageTime: 'Just now',
            messages: [...thread.messages, newMsg],
          };
        }
        return thread;
      })
    );

    setInputText('');
  };

  const handleSendHeart = () => {
    if (!activeThreadId) return;
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'me',
      text: '❤️',
      timestamp: 'Just now',
    };
    setThreads((prev) =>
      prev.map((thread) => {
        if (thread.id === activeThreadId) {
          return {
            ...thread,
            lastMessage: '❤️',
            lastMessageTime: 'Just now',
            messages: [...thread.messages, newMsg],
          };
        }
        return thread;
      })
    );
  };

  // If a chat thread is selected, display conversation
  if (activeThread) {
    return (
      <div className="flex flex-col h-full bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white">
        {/* Chat Header */}
        <div className="flex items-center justify-between px-3 py-2.5 border-b border-neutral-100 dark:border-neutral-800 bg-white/95 dark:bg-neutral-950/95 backdrop-blur-md sticky top-0 z-20">
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setActiveThreadId(null)}
              className="p-1 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5 text-neutral-800 dark:text-white" />
            </button>
            <div className="relative">
              <img
                src={activeThread.avatar}
                alt={activeThread.name}
                className="w-8 h-8 rounded-full object-cover"
              />
              {activeThread.isOnline && (
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white dark:border-neutral-950" />
              )}
            </div>
            <div>
              <h2 className="text-xs font-semibold leading-none">{activeThread.name}</h2>
              <p className="text-[11px] text-neutral-400 leading-tight mt-0.5">
                {activeThread.isOnline ? 'Active now' : `@${activeThread.username}`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-neutral-800 dark:text-neutral-200">
            <button className="p-1 hover:text-neutral-500 transition cursor-pointer">
              <Phone className="w-4 h-4" />
            </button>
            <button className="p-1 hover:text-neutral-500 transition cursor-pointer">
              <Video className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Message history */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-neutral-50 dark:bg-neutral-900/40">
          {activeThread.messages.map((msg) => {
            const isMe = msg.sender === 'me';
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
              >
                {/* Regular text message */}
                {msg.text && (
                  <div
                    className={`max-w-[75%] px-3.5 py-2 rounded-2xl text-xs leading-relaxed ${
                      isMe
                        ? 'bg-sky-500 text-white rounded-br-xs shadow-sm'
                        : 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white border border-neutral-200/70 dark:border-neutral-700/60 rounded-bl-xs shadow-xs'
                    }`}
                  >
                    {msg.text}
                  </div>
                )}

                {/* Attached Reel card received in chat! */}
                {msg.reelAttachment && (
                  <div
                    onClick={() => onOpenSingleReel(msg.reelAttachment!)}
                    className="max-w-[240px] mt-1 rounded-2xl overflow-hidden bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 shadow-md cursor-pointer group hover:scale-[1.01] transition transform"
                  >
                    {/* Reel thumbnail with play overlay */}
                    <div className="relative aspect-[9/14] w-full overflow-hidden bg-neutral-900">
                      <img
                        src={msg.reelAttachment.posterUrl}
                        alt="Shared reel"
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

                      {/* Watch Reel badge */}
                      <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 px-2 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] font-medium">
                        <Play className="w-2.5 h-2.5 fill-white" />
                        <span>Reel</span>
                      </div>

                      {/* Click to open note */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <div className="w-12 h-12 rounded-full bg-black/50 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white group-hover:scale-110 transition">
                          <Play className="w-5 h-5 fill-white translate-x-0.5" />
                        </div>
                        <span className="mt-2 text-[10px] font-semibold text-white bg-black/40 px-2 py-0.5 rounded-full">
                          Watch in full screen
                        </span>
                      </div>

                      {/* Reel Creator & Caption inside preview */}
                      <div className="absolute bottom-2.5 left-2.5 right-2.5 text-white">
                        <div className="flex items-center gap-1.5 mb-1">
                          <img
                            src={msg.reelAttachment.userAvatar}
                            alt=""
                            className="w-4 h-4 rounded-full object-cover"
                          />
                          <span className="text-[11px] font-semibold truncate">
                            {msg.reelAttachment.username}
                          </span>
                        </div>
                        <p className="text-[10px] text-white/85 line-clamp-2">
                          {msg.reelAttachment.caption}
                        </p>
                      </div>
                    </div>

                    <div className="px-3 py-2 bg-neutral-100 dark:bg-neutral-800 text-[11px] font-medium text-neutral-600 dark:text-neutral-300 flex items-center justify-between">
                      <span>View shared Reel</span>
                      <span className="text-sky-500 font-semibold">Open →</span>
                    </div>
                  </div>
                )}

                <span className="text-[9px] text-neutral-400 mt-1 px-1">
                  {msg.timestamp}
                </span>
              </div>
            );
          })}
        </div>

        {/* Input Bar */}
        <div className="p-2.5 border-t border-neutral-100 dark:border-neutral-800 bg-white dark:bg-neutral-950 flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-sky-500 text-white flex items-center justify-center shrink-0">
            <Camera className="w-4 h-4" />
          </div>

          <div className="flex-1 flex items-center bg-neutral-100 dark:bg-neutral-800 rounded-full px-3 py-1.5 border border-neutral-200 dark:border-neutral-700">
            <input
              type="text"
              placeholder="Message..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              className="w-full bg-transparent text-xs text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none"
            />
            <Smile className="w-4 h-4 text-neutral-400 ml-1 shrink-0" />
          </div>

          {inputText.trim() ? (
            <button
              onClick={handleSendMessage}
              className="p-2 text-sky-500 font-semibold text-xs hover:text-sky-600 transition cursor-pointer"
            >
              Send
            </button>
          ) : (
            <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
              <ImageIcon className="w-5 h-5 cursor-pointer hover:text-neutral-900 dark:hover:text-white transition" />
              <button
                onClick={handleSendHeart}
                className="cursor-pointer hover:scale-110 active:scale-95 transition"
              >
                <Heart className="w-5 h-5 text-red-500 fill-red-500" />
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Chats List View
  return (
    <div className="flex flex-col h-full bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white overflow-hidden">
      {/* Top Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-100 dark:border-neutral-800 bg-white dark:bg-neutral-950 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          {onBackToHome && (
            <button
              onClick={onBackToHome}
              className="p-1 -ml-1 text-neutral-700 dark:text-neutral-300 hover:text-neutral-950 dark:hover:text-white"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <div className="flex items-center gap-1.5">
            <h1 className="text-base font-bold">alex_visuals</h1>
            <span className="w-2 h-2 rounded-full bg-sky-500" />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Camera className="w-5 h-5 cursor-pointer text-neutral-700 dark:text-neutral-300" />
          <Send className="w-5 h-5 cursor-pointer text-neutral-700 dark:text-neutral-300 -rotate-12" />
        </div>
      </div>

      {/* Search */}
      <div className="px-4 py-2.5">
        <div className="flex items-center gap-2 bg-neutral-100 dark:bg-neutral-800/80 px-3 py-2 rounded-xl text-xs text-neutral-400 border border-neutral-200/50 dark:border-neutral-700/50">
          <Search className="w-4 h-4 text-neutral-400 shrink-0" />
          <input
            type="text"
            placeholder="Search messages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent text-neutral-900 dark:text-white focus:outline-none placeholder-neutral-400 text-xs"
          />
        </div>
      </div>

      {/* Online Users Avatar Row */}
      <div className="px-4 py-2 flex items-center gap-3 overflow-x-auto no-scrollbar border-b border-neutral-100 dark:border-neutral-800/60 pb-3">
        {threads.map((thread) => (
          <div
            key={thread.id}
            onClick={() => setActiveThreadId(thread.id)}
            className="flex flex-col items-center gap-1 shrink-0 cursor-pointer"
          >
            <div className="relative">
              <img
                src={thread.avatar}
                alt={thread.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-white dark:border-neutral-900"
              />
              {thread.isOnline && (
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white dark:border-neutral-950" />
              )}
            </div>
            <span className="text-[10px] font-medium text-neutral-700 dark:text-neutral-300 truncate max-w-[56px] text-center">
              {thread.name.split(' ')[0]}
            </span>
          </div>
        ))}
      </div>

      {/* Messages List */}
      <div className="flex-1 overflow-y-auto divide-y divide-neutral-100 dark:divide-neutral-900 pb-28 no-scrollbar">
        <div className="px-4 pt-3 pb-1 flex items-center justify-between text-xs font-semibold text-neutral-500">
          <span>Messages</span>
          <span className="text-sky-500 text-[11px] font-medium cursor-pointer">Requests (1)</span>
        </div>

        {filteredThreads.map((thread) => {
          const hasReel = thread.messages.some((m) => !!m.reelAttachment);
          return (
            <div
              key={thread.id}
              onClick={() => setActiveThreadId(thread.id)}
              className="flex items-center justify-between px-4 py-3 hover:bg-neutral-50 dark:hover:bg-neutral-900/60 transition cursor-pointer"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="relative shrink-0">
                  <img
                    src={thread.avatar}
                    alt={thread.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  {thread.isOnline && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white dark:border-neutral-950" />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="text-xs font-semibold text-neutral-900 dark:text-white truncate">
                    {thread.name}
                  </h3>
                  <div className="flex items-center gap-1.5 text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5">
                    {hasReel && (
                      <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 text-[9px] font-bold bg-pink-500/10 text-pink-500 rounded">
                        <Play className="w-2 h-2 fill-pink-500" /> REEL
                      </span>
                    )}
                    <span className="truncate">{thread.lastMessage}</span>
                    <span className="shrink-0">• {thread.lastMessageTime}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 pl-2">
                {thread.unreadCount > 0 && (
                  <span className="w-2 h-2 rounded-full bg-sky-500" />
                )}
                <Camera className="w-4 h-4 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
