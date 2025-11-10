import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, createSearchParams } from "react-router-dom";
import { Menu, Search, ArrowLeft, X } from "lucide-react";
import AppIconHorizontal from "../../assets/socialhub-horizontal.png";
import AppIcon from "../../assets/app_icon.png";

interface HeaderProps {
  onToggleMobileMenu: () => void;
}

export default function Header({ onToggleMobileMenu }: HeaderProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleSearchSubmit = (e: React.FormEvent | React.KeyboardEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    navigate({
      pathname: "/search",
      search: createSearchParams({ q: searchTerm.trim() }).toString(),
    });
    setIsMobileSearchOpen(false); // Close mobile search after submit
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearchSubmit(e);
    }
  };

  // Focus input when mobile search opens
  useEffect(() => {
    if (isMobileSearchOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isMobileSearchOpen]);

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 z-50 px-4 flex items-center justify-between">
      
      {/* Mobile Search Overlay Mode */}
      {isMobileSearchOpen ? (
        <div className="flex items-center w-full gap-2 lg:hidden">
          <button 
            onClick={() => setIsMobileSearchOpen(false)}
            className="p-2 -ml-2 hover:bg-gray-100 rounded-full text-gray-600"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full pl-4 pr-10 py-2 bg-gray-100 border-none rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
             {searchTerm && (
              <button 
                onClick={() => setSearchTerm("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <button 
            onClick={handleSearchSubmit}
            className="p-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700"
          >
            <Search className="w-5 h-5" />
          </button>
        </div>
      ) : (
        /* Normal Header Mode */
        <>
          {/* Left Section: Logo (Desktop) / Menu (Mobile) */}
          <div className="flex items-center gap-4">
            {/* Mobile Menu Button */}
            <button
              onClick={onToggleMobileMenu}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Menu className="w-6 h-6 text-gray-700" />
            </button>

            {/* Desktop Logo */}
            <Link to="/" className="hidden lg:block">
              <img
                src={AppIconHorizontal}
                alt="SocialHub"
                className="w-32 h-auto object-contain"
              />
            </Link>
          </div>

          {/* Center Section: Search (Desktop) / App Icon (Mobile) */}
          <div className="flex-1 flex items-center justify-center lg:justify-start lg:ml-4">
            {/* Mobile App Icon */}
            <Link to="/" className="lg:hidden">
              <img src={AppIcon} alt="SocialHub" className="w-10 h-10 rounded-xl" />
            </Link>

            {/* Desktop Search Bar */}
            <div className="hidden lg:block w-full max-w-md relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search people or posts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full pl-10 pr-4 py-2 bg-gray-100 border-none rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Right Section: Mobile Search Icon / Desktop Icons */}
          <div className="flex items-center gap-2">
            <div className="lg:hidden">
              <button 
                onClick={() => setIsMobileSearchOpen(true)} 
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <Search className="w-6 h-6 text-gray-700" />
              </button>
            </div>
          </div>
        </>
      )}
    </header>
  );
}
