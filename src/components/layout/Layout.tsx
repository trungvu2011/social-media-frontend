import React, { useCallback, useState } from "react";
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
