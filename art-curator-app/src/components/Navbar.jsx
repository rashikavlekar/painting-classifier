import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, History, Palette, Sun, Moon, ImageIcon } from 'lucide-react'; // ⬅️ Added ImageIcon

const NavButton = ({ to, icon, text, isActive }) => (
  <Link
    to={to}
    className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      isActive ? 'bg-blue-500 text-white' : 'hover:bg-gray-200 dark:hover:bg-gray-700'
    }`}
  >
    {icon}
    <span className="hidden md:inline">{text}</span>
  </Link>
);

const Navbar = ({ toggleTheme, theme }) => {
  const location = useLocation();

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-md">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="flex justify-between items-center py-3">
          <Link to="/" className="flex items-center gap-3 group">
            <Palette className="w-8 h-8 text-blue-500 transition-transform group-hover:rotate-12" />
            <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white hidden sm:block">
              Art Curator
            </h1>
          </Link>
          <div className="flex items-center gap-2">
            <NavButton to="/" icon={<Home />} text="Home" isActive={location.pathname === '/'} />
            <NavButton to="/history" icon={<History />} text="History" isActive={location.pathname === '/history'} />
            <NavButton to="/gallery" icon={<ImageIcon />} text="Gallery" isActive={location.pathname === '/gallery'} /> {/* ✅ New Gallery button */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
