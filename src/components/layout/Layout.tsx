import React from 'react';
import LeftSidebar from './LeftSideBar';
import RightSidebar from './RightSideBar';
import type { FriendSuggestion, Event } from '../../types/social';

interface LayoutProps {
  children: React.ReactNode;
  friendSuggestions: FriendSuggestion[];
  events: Event[];
}

const Layout: React.FC<LayoutProps> = ({ children, friendSuggestions, events }) => {
  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Left Sidebar */}
      <div className="fixed left-0 top-0 h-screen z-30">
        <LeftSidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 min-h-screen ml-72 mr-72">
        <main className="py-6">
          <div className="max-w-2xl mx-auto px-4">
            {children}
          </div>
        </main>
      </div>

      {/* Right Sidebar */}
      <div className="fixed right-0 top-0 h-screen z-30">
        <RightSidebar />
      </div>
    </div>
  );
};

export default Layout;