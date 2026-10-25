/**
 * Top Navigation Bar for Instavideo
 * Conforms to Top Bar Contract: Zone 1 (Wordmark) - Zone 2 (Navigation) - Zone 3 (Actions)
 */
import React, { useState } from 'react';
import {
  Bell, MessageSquare, Globe, Sun, Moon,
  Smartphone, Monitor, DollarSign, Shield, Code, ChevronDown, Check, User
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Navbar: React.FC = () => {
  const {
    currentUser, users, switchUser, language, setLanguage,
    theme, setTheme, deviceMode, setDeviceMode,
    activeTab, setActiveTab, notifications, conversations,
    setIsSettingsModalOpen, setIsApiDocsModalOpen, setIsLiveModalOpen,
    t
  } = useApp();

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const unreadNotifs = notifications.filter(n => !n.isRead).length;
  const unreadMessages = conversations.reduce((acc, c) => acc + c.unreadCount, 0);

  return (
    <header className="sticky top-0 z-40 bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800/80 px-4 md:px-6 py-2.5 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-2.5 text-left group cursor-pointer focus:outline-none"
          >
            <div className="w-8 h-8 rounded-lg overflow-hidden ring-1 ring-rose-500/30 group-hover:ring-rose-500/70 transition-all shadow-md shadow-rose-950/40">
              <img
                src="/src/assets/images/instavideo_icon_1792886894981.jpg"
                alt="Instavideo Brand Icon"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-xl font-bold font-['Outfit'] tracking-tight bg-gradient-to-r from-rose-500 via-pink-500 to-purple-400 bg-clip-text text-transparent">
              Instavideo
            </span>
          </button>
        </div>

        {/* Zone 2: Navigation Links (Desktop) */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-zinc-400">
          <button
            onClick={() => setActiveTab('home')}
            className={`whitespace-nowrap transition-colors hover:text-white cursor-pointer ${
              activeTab === 'home' ? 'text-white font-semibold' : ''
            }`}
          >
            {t('nav', 'home')}
          </button>
          <button
            onClick={() => setActiveTab('explore')}
            className={`whitespace-nowrap transition-colors hover:text-white cursor-pointer ${
              activeTab === 'explore' ? 'text-white font-semibold' : ''
            }`}
          >
            {t('nav', 'explore')}
          </button>
          <button
            onClick={() => setActiveTab('reels')}
            className={`whitespace-nowrap transition-colors hover:text-white cursor-pointer ${
              activeTab === 'reels' ? 'text-white font-semibold' : ''
            }`}
          >
            {t('nav', 'reels')}
          </button>
          <button
            onClick={() => setActiveTab('monetization')}
            className={`whitespace-nowrap transition-colors hover:text-white cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'monetization' ? 'text-white font-semibold' : ''
            }`}
          >
            <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
            {t('nav', 'monetization')}
          </button>
          {currentUser.role === 'admin' && (
            <button
              onClick={() => setActiveTab('admin')}
              className={`whitespace-nowrap transition-colors hover:text-white cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'admin' ? 'text-rose-400 font-semibold' : 'text-zinc-400'
              }`}
            >
              <Shield className="w-3.5 h-3.5 text-rose-400" />
              {t('nav', 'admin')}
            </button>
          )}
        </nav>

        {/* Zone 3: Actions & Controls */}
        <div className="flex items-center gap-2 md:gap-3 shrink-0">
          {/* Live broadcast button */}
          <button
            onClick={() => setIsLiveModalOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-md bg-rose-500/15 text-rose-400 border border-rose-500/30 hover:bg-rose-500/25 transition-all cursor-pointer whitespace-nowrap"
            title="Go Live or Watch Broadcast"
          >
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            <span>{t('live', 'liveNow')}</span>
          </button>

          {/* Messages icon */}
          <button
            onClick={() => setActiveTab('messages')}
            className="relative p-2 rounded-lg text-zinc-300 hover:text-white hover:bg-zinc-900 transition-colors cursor-pointer"
            title={t('chat', 'messages')}
          >
            <MessageSquare className="w-5 h-5" />
            {unreadMessages > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center">
                {unreadMessages}
              </span>
            )}
          </button>

          {/* Notifications bell */}
          <button
            onClick={() => setActiveTab('notifications')}
            className="relative p-2 rounded-lg text-zinc-300 hover:text-white hover:bg-zinc-900 transition-colors cursor-pointer"
            title={t('nav', 'notifications')}
          >
            <Bell className="w-5 h-5" />
            {unreadNotifs > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center">
                {unreadNotifs}
              </span>
            )}
          </button>

          {/* Device Frame Toggle (Mobile / Responsive) */}
          <button
            onClick={() => setDeviceMode(deviceMode === 'mobile' ? 'responsive' : 'mobile')}
            className="hidden sm:flex items-center gap-1 p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors cursor-pointer"
            title={deviceMode === 'mobile' ? 'Switch to Full-Width Web View' : 'Switch to Android Mobile Frame'}
          >
            {deviceMode === 'mobile' ? <Monitor className="w-4 h-4" /> : <Smartphone className="w-4 h-4" />}
          </button>

          {/* Language Toggle (EN / HI) */}
          <button
            onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
            className="flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-md text-zinc-300 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 transition-colors cursor-pointer"
            title="Toggle Language / भाषा बदलें"
          >
            <Globe className="w-3.5 h-3.5 text-zinc-400" />
            <span>{language.toUpperCase()}</span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors cursor-pointer"
            title="Toggle Theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* API Docs & Tech Architecture */}
          <button
            onClick={() => setIsApiDocsModalOpen(true)}
            className="hidden lg:flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md text-zinc-400 bg-zinc-900 hover:text-zinc-200 border border-zinc-800 transition-colors cursor-pointer"
            title="API & Architecture Documentation"
          >
            <Code className="w-3.5 h-3.5 text-rose-400" />
            <span>API Docs</span>
          </button>

          {/* User Profile Menu & Account Switcher */}
          <div className="relative">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center gap-1.5 p-1 rounded-full hover:ring-2 hover:ring-rose-500/50 transition-all cursor-pointer focus:outline-none"
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.displayName}
                referrerPolicy="no-referrer"
                className="w-7 h-7 rounded-full object-cover ring-1 ring-zinc-700"
              />
              <ChevronDown className="w-3.5 h-3.5 text-zinc-400 hidden sm:block" />
            </button>

            {isUserMenuOpen && (
              <div
                className="absolute right-0 mt-2 w-64 bg-zinc-900 border border-zinc-800 rounded-xl shadow-xl py-2 z-50 text-sm animate-in fade-in slide-in-from-top-2 duration-150"
                onClick={() => setIsUserMenuOpen(false)}
              >
                <div className="px-3 py-2 border-b border-zinc-800">
                  <p className="font-semibold text-white truncate">{currentUser.displayName}</p>
                  <p className="text-xs text-zinc-400">@{currentUser.username}</p>
                  <span className="inline-block mt-1 text-[10px] uppercase font-bold tracking-wider text-rose-400">
                    {currentUser.role}
                  </span>
                </div>

                <div className="py-1">
                  <button
                    onClick={() => setActiveTab('profile')}
                    className="w-full text-left px-3 py-2 hover:bg-zinc-800/70 text-zinc-200 flex items-center gap-2 cursor-pointer"
                  >
                    <User className="w-4 h-4 text-zinc-400" />
                    <span>{t('profile', 'editProfile')}</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('monetization')}
                    className="w-full text-left px-3 py-2 hover:bg-zinc-800/70 text-zinc-200 flex items-center gap-2 cursor-pointer"
                  >
                    <DollarSign className="w-4 h-4 text-emerald-400" />
                    <span>{t('monetization', 'title')}</span>
                  </button>
                  <button
                    onClick={() => setIsSettingsModalOpen(true)}
                    className="w-full text-left px-3 py-2 hover:bg-zinc-800/70 text-zinc-200 flex items-center gap-2 cursor-pointer"
                  >
                    <Shield className="w-4 h-4 text-zinc-400" />
                    <span>{t('profile', 'settings')}</span>
                  </button>
                </div>

                <div className="border-t border-zinc-800 pt-1">
                  <div className="px-3 py-1 text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
                    {t('common', 'switchUser')} (Demo Accounts)
                  </div>
                  {users.map(u => (
                    <button
                      key={u.id}
                      onClick={() => switchUser(u.id)}
                      className="w-full text-left px-3 py-1.5 hover:bg-zinc-800/60 flex items-center justify-between text-xs text-zinc-300 cursor-pointer"
                    >
                      <span className="truncate">{u.displayName} (@{u.username})</span>
                      {currentUser.id === u.id && <Check className="w-3.5 h-3.5 text-rose-500" />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
