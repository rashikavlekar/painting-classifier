import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import UploadPage from './pages/UploadPage';
import ResultsPage from './pages/ResultsPage';
import HistoryPage from './pages/HistoryPage';

const App = () => {
  const [theme, setTheme] = useState('dark');
  const [page, setPage] = useState('home');

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('dark', 'light');
    root.classList.add(theme);
    root.style.backgroundColor = theme === 'dark' ? '#111827' : '#f9fafb';
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 font-sans transition-colors duration-500">
        <Navbar toggleTheme={toggleTheme} theme={theme} setPage={setPage} page={page} />
        <main className="p-4">
          <Routes>
            <Route path="/" element={<HomePage setPage={setPage} />} />
            <Route path="/upload" element={<UploadPage setPage={setPage} />} />
            <Route path="/results" element={<ResultsPage setPage={setPage} />} />
            <Route path="/history" element={<HistoryPage setPage={setPage} />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
