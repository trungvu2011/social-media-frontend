import React from "react";
import LeftSidebar from "./LeftSideBar";
import RightSidebar from "./RightSideBar";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex w-full">
      {/* Left Sidebar */}
      <aside className="w-[300px] flex-shrink-0 h-screen sticky top-0">
        <LeftSidebar />
      </aside>

      {/* Main Content - centered with small gaps from sidebars */}
      <main className="flex-1 min-h-screen bg-white shadow-lg mx-12">
        {children}
      </main>

      {/* Right Sidebar */}
      <aside className="w-[300px] flex-shrink-0 h-screen sticky top-0">
        <RightSidebar />
      </aside>
    </div>
  );
};

export default Layout;
