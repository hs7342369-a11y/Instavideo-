/**
 * Instavideo - Modern Advanced Social Media Platform
 * Combines Photo Sharing, Vertical Reels, Creator Channels,
 * Live Streaming, Direct Messaging, and Creator Monetization.
 */
import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { HomeFeed } from './components/HomeFeed';
import { ReelsFeed } from './components/ReelsFeed';
import { ExploreSearch } from './components/ExploreSearch';
import { CreatorChannelView } from './components/CreatorChannelView';
import { MessagingHub } from './components/MessagingHub';
import { MonetizationDashboard } from './components/MonetizationDashboard';
import { UserProfileView } from './components/UserProfileView';
import { AdminPanel } from './components/AdminPanel';
import { NotificationsHub } from './components/NotificationsHub';
import { StoryViewerModal } from './components/StoryViewerModal';
import { CreatePostModal } from './components/CreatePostModal';
import { LiveStreamModal } from './components/LiveStreamModal';
import { SettingsModal } from './components/SettingsModal';
import { AuthModal } from './components/AuthModal';
import { ApiDocsModal } from './components/ApiDocsModal';
import { ApkDownloadModal } from './components/ApkDownloadModal';
import { Wifi, BatteryMedium, Signal, Smartphone, Monitor } from 'lucide-react';

const MainLayout: React.FC = () => {
  const { activeTab, deviceMode, setDeviceMode } = useApp();

  const renderActiveScreen = () => {
    switch (activeTab) {
      case 'home':
        return <HomeFeed />;
      case 'reels':
        return <ReelsFeed />;
      case 'explore':
        return <ExploreSearch />;
      case 'profile':
        return <UserProfileView />;
      case 'channel':
        return <CreatorChannelView />;
      case 'messages':
        return <MessagingHub />;
      case 'notifications':
        return <NotificationsHub />;
      case 'monetization':
        return <MonetizationDashboard />;
      case 'admin':
        return <AdminPanel />;
      default:
        return <HomeFeed />;
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col justify-between selection:bg-rose-500 selection:text-white">
      {/* Top Navbar */}
      <Navbar />

      {/* Main View Container */}
      {deviceMode === 'mobile' ? (
        // Android Phone Frame Container on Desktop
        <main className="flex-1 flex flex-col items-center justify-center p-0 sm:py-6 sm:px-4">
          <div className="w-full max-w-md sm:h-[860px] bg-zinc-950 sm:border-4 sm:border-zinc-800 rounded-none sm:rounded-[44px] shadow-2xl sm:shadow-rose-950/20 overflow-hidden flex flex-col relative">
            {/* Android Status Bar (Simulated) */}
            <div className="hidden sm:flex items-center justify-between px-6 pt-3 pb-1 text-[11px] font-semibold text-zinc-400 bg-zinc-950 select-none z-30">
              <span>9:41</span>
              {/* Simulated camera notch hole */}
              <div className="w-4 h-4 rounded-full bg-zinc-900 ring-2 ring-zinc-800 mx-auto" />
              <div className="flex items-center gap-1.5">
                <Signal className="w-3.5 h-3.5" />
                <Wifi className="w-3.5 h-3.5" />
                <BatteryMedium className="w-4 h-4" />
              </div>
            </div>

            {/* Screen Content */}
            <div className="flex-1 overflow-y-auto no-scrollbar relative">
              {renderActiveScreen()}
            </div>

            {/* Mobile Bottom Navigation */}
            <BottomNav />
          </div>
        </main>
      ) : (
        // Full Responsive Web Mode
        <main className="flex-1 max-w-7xl w-full mx-auto px-2 sm:px-6 pt-3 pb-20">
          {renderActiveScreen()}
          {/* Bottom Nav for mobile viewports */}
          <div className="md:hidden">
            <BottomNav />
          </div>
        </main>
      )}

      {/* Global Modals */}
      <StoryViewerModal />
      <CreatePostModal />
      <LiveStreamModal />
      <SettingsModal />
      <AuthModal />
      <ApiDocsModal />
      <ApkDownloadModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
