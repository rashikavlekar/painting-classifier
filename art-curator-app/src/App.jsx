import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom'; // ✅ Add this

import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import UploadPage from './pages/UploadPage';
import ResultsPage from './pages/ResultsPage';
import HistoryPageWrapper from './pages/HistoryPageWrapper';
import GalleryPageWrapper from './pages/GalleryPageWrapper';




const App = () => {
  const [theme, setTheme] = useState('dark');
  const [page, setPage] = useState('home');

  // ✅ New line to manage prediction history
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('dark', 'light');
    root.classList.add(theme);
    root.style.backgroundColor = theme === 'dark' ? '#F5CBCB' : '#ffe4ec'; // light pastel pink

  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 font-sans transition-colors duration-500">
      <Navbar toggleTheme={toggleTheme} theme={theme} setPage={setPage} page={page} />
      <main className="p-4">
        <Routes>
          <Route path="/" element={<HomePage setPage={setPage} />} />
          <Route path="/login" element={<AuthPage setPage={setPage} />} />
          <Route path="/upload" element={<UploadPage setPage={setPage} setHistory={setHistory} />} />
          <Route path="/results" element={<ResultsPage setPage={setPage} />} />
          <Route path="/history" element={
                                          <HistoryPageWrapper
                                            setPage={setPage}
                                            history={history}
                                            setHistory={setHistory}
                                          />
                                        } />
          
<Route path="/gallery" element={<GalleryPageWrapper />} />

        </Routes>
      </main>
    </div>
  );
};

export default App;
