import React, { useState, useEffect, useRef } from "react";
import LeftSidebar from "./LeftSideBar";
import RightSidebar from "./RightSideBar";
import Header from "./Header";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isMobileMenuOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col w-full max-w-full relative">
      <Header onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />

      <div className="flex flex-1 pt-0 justify-center">
        {/* Overlay backdrop for mobile menu */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" />
        )}

        {/* Left Sidebar */}
        <aside
          ref={sidebarRef}
          className={`
            w-[280px] h-[calc(100vh-64px)] z-40 overflow-y-auto
            fixed top-16 left-0
            lg:sticky lg:top-16 lg:h-[calc(100vh-64px)]
            ${
              isMobileMenuOpen
                ? "translate-x-0"
                : "-translate-x-full lg:translate-x-0"
            }
            transition-transform duration-300 ease-in-out
            bg-white border-r border-gray-200
          `}
        >
          <LeftSidebar onClose={() => setIsMobileMenuOpen(false)} />
        </aside>

        {/* Main Content */}
        <main className="flex-1 w-full max-w-full bg-gray-50 px-4 pb-4 pt-0 lg:px-6 lg:pb-6 lg:pt-0">
          <div className="max-w-3xl mx-auto h-full">
            {children}
          </div>
        </main>

        {/* Right Sidebar - hidden on mobile/tablet */}
        <aside className="w-[300px] flex-shrink-0 h-[calc(100vh-64px)] overflow-y-auto hidden xl:block sticky top-16 bg-white border-l border-gray-200">
          <RightSidebar />
        </aside>
      </div>
    </div>
  );
};

export default Layout;
