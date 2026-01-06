import React, { useCallback, useState, useEffect, useRef } from "react";
import { Menu, X } from "lucide-react";
import LeftSidebar from "./LeftSideBar";
import RightSidebar from "./RightSideBar";
import {
  getAllPosts,
  searchUsers,
  type BackendPostListItem,
  type SearchUsersResponse,
} from "../../utils";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchFilter, setSearchFilter] = useState<"people" | "post">("people");
  const [peopleResults, setPeopleResults] = useState<
    SearchUsersResponse["users"]
  >([]);
  const [postResults, setPostResults] = useState<BackendPostListItem[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [hasSubmittedSearch, setHasSubmittedSearch] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  const runSearch = useCallback(
    async (filter: "people" | "post", term: string) => {
      const query = term.trim();
      if (!query) {
        setHasSubmittedSearch(false);
        setSearchError(null);
        setPeopleResults([]);
        setPostResults([]);
        return;
      }

      setHasSubmittedSearch(true);
      setSearchLoading(true);
      setSearchError(null);

      try {
        if (filter === "people") {
          const res = await searchUsers(query, { limit: 10 });
          setPeopleResults(res.users || []);
        } else {
          const res = await getAllPosts({ search: query, limit: 10 });
          setPostResults(res.data || []);
        }
      } catch (err: any) {
        const message = err?.message || "Search failed";
        setSearchError(message);
      } finally {
        setSearchLoading(false);
      }
    },
    []
  );

  const handleSearchSubmit = useCallback(() => {
    runSearch(searchFilter, searchTerm);
  }, [runSearch, searchFilter, searchTerm]);

  const handleFilterChange = useCallback(
    (next: "people" | "post") => {
      setSearchFilter(next);
      if (hasSubmittedSearch && searchTerm.trim()) {
        runSearch(next, searchTerm);
      }
    },
    [hasSubmittedSearch, runSearch, searchTerm]
  );

  const handleClearSearch = useCallback(() => {
    setSearchTerm("");
    setHasSubmittedSearch(false);
    setSearchError(null);
    setPeopleResults([]);
    setPostResults([]);
    setSearchLoading(false);
    setSearchFilter("people");
  }, []);

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
    <div className="min-h-screen bg-gray-50 flex w-full max-w-full overflow-x-hidden relative">
      {/* Hamburger Menu Button - visible on mobile/tablet */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg lg:hidden hover:bg-gray-50 transition-colors"
        aria-label="Toggle menu"
      >
        {isMobileMenuOpen ? (
          <X className="w-6 h-6 text-gray-700" />
        ) : (
          <Menu className="w-6 h-6 text-gray-700" />
        )}
      </button>

      {/* Overlay backdrop for mobile menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" />
      )}

      {/* Left Sidebar */}
      <aside
        ref={sidebarRef}
        className={`
          w-[300px] flex-shrink-0 h-screen sticky top-0 z-40
          lg:block
          ${
            isMobileMenuOpen
              ? "fixed left-0 top-0 shadow-2xl"
              : "hidden lg:block"
          }
          transition-transform duration-300 ease-in-out
        `}
      >
        <LeftSidebar onClose={() => setIsMobileMenuOpen(false)} />
      </aside>

      {/* Main Content - centered with small gaps from sidebars */}
      <main className="flex-1 w-full max-w-full min-h-screen bg-white shadow-lg mx-0 lg:mx-12 overflow-x-hidden">
        {children}
      </main>

      {/* Right Sidebar - hidden on mobile/tablet */}
      <aside className="w-[300px] flex-shrink-0 h-screen sticky top-0 hidden xl:block">
        <RightSidebar
          searchFilter={searchFilter}
          onFilterChange={handleFilterChange}
          searchTerm={searchTerm}
          onSearchTermChange={setSearchTerm}
          onSearchSubmit={handleSearchSubmit}
          searchLoading={searchLoading}
          searchError={searchError}
          peopleResults={peopleResults as any}
          postResults={postResults}
          hasSubmittedSearch={hasSubmittedSearch}
          onClearSearch={handleClearSearch}
        />
      </aside>
    </div>
  );
};

export default Layout;
