import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, History, Sun, Moon, Info, Image, Menu, X } from "lucide-react";
import logo from "../assets/ba.png";
import { InteractiveHoverButton } from "./InteractiveHoverButton";

const Navbar = ({ toggleTheme, theme }) => {
  const location = useLocation();
  // State to manage mobile menu visibility
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Function to close the menu, useful for link clicks
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
      {/* This container is now full-width */}
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-2 sm:py-3">
          {/* Logo and Title */}
          <Link to="/" className="flex items-center gap-2 sm:gap-3" onClick={closeMenu}>
            <img
              src={logo}
              alt="Logo"
              className="w-10 h-10 sm:w-12 sm:h-12 object-contain"
            />
            <h1 className="text-base sm:text-xl font-semibold text-gray-900 dark:text-white tracking-tight">
              Art Curator
            </h1>
          </Link>

          {/* Desktop Navigation + Theme Toggle */}
          <div className="hidden md:flex items-center gap-2 sm:gap-3">
            <InteractiveHoverButton
              to="/"
              icon={<Home size={18} />}
              text="Home"
              isActive={location.pathname === "/"}
            />
            <InteractiveHoverButton
              to="/history"
              icon={<History size={18} />}
              text="History"
              isActive={location.pathname === "/history"}
            />
            <InteractiveHoverButton
              to="/about"
              icon={<Info size={18} />}
              text="About"
              isActive={location.pathname === "/about"}
            />
            <InteractiveHoverButton
              to="/gallery"
              icon={<Image size={18} />}
              text="Gallery"
              isActive={location.pathname === "/gallery"}
            />
            <button
              onClick={toggleTheme}
              className="p-2 border border-black dark:border-white rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle Theme"
            >
              {theme === "dark" ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} className="text-black" />}
            </button>
          </div>

          {/* Mobile Menu Button + Theme Toggle */}
          <div className="md:hidden flex items-center gap-2">
             <button
              onClick={toggleTheme}
              className="p-2 border border-black dark:border-white rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle Theme"
            >
              {theme === "dark" ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} className="text-black" />}
            </button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle mobile menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-lg">
          <div className="flex flex-col items-center gap-4 px-2 pt-2 pb-4">
             <Link to="/" className="text-lg font-medium text-gray-800 dark:text-gray-200 w-full text-center py-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-800" onClick={closeMenu}>Home</Link>
             <Link to="/history" className="text-lg font-medium text-gray-800 dark:text-gray-200 w-full text-center py-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-800" onClick={closeMenu}>History</Link>
             <Link to="/about" className="text-lg font-medium text-gray-800 dark:text-gray-200 w-full text-center py-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-800" onClick={closeMenu}>About</Link>
             <Link to="/gallery" className="text-lg font-medium text-gray-800 dark:text-gray-200 w-full text-center py-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-800" onClick={closeMenu}>Gallery</Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
