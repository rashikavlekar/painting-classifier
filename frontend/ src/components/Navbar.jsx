import React from 'react';
import { Home, History, Palette, Sun, Moon } from 'lucide-react';

const NavButton = ({ onClick, icon, text, active }) => (
  <button onClick={onClick} className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${active ? 'bg-blue-500 text-white' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`}>
    {icon}
    <span className="hidden md:inline">{text}</span>
  </button>
);

const Navbar = ({ toggleTheme, theme, setPage, page }) => (
  <nav className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-md">
    <div className="container mx-auto px-4 max-w-4xl">
      <div className="flex justify-between items-center py-3">
        <button onClick={() => setPage('home')} className="flex items-center gap-3 group">
          <Palette className="w-8 h-8 text-blue-500 transition-transform group-hover:rotate-12" />
          <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white hidden sm:block">Art Curator</h1>
        </button>
        <div className="flex items-center gap-2">
          <NavButton onClick={() => setPage('home')} icon={<Home />} text="Home" active={page === 'home'} />
          <NavButton onClick={() => setPage('history')} icon={<History />} text="History" active={page === 'history'} />
          <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </div>
  </nav>
);

export default Navbar;
