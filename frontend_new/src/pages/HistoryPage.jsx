import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Trash2, History, Search } from 'lucide-react';
import Aurora from '../components/Aurora';

const links = [
  { name: 'Home', path: '/' },
  { name: 'Gallery', path: '/gallery' },
  { name: 'History', path: '/history' },
  { name: 'About', path: '/about' },
];

const HistoryPage = () => {
  const [history, setHistory] = useState([]);
  const [filter, setFilter] = useState('');
  const [userEmail, setUserEmail] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  // Get logged-in user email
  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (user) {
        setUserEmail(user.email);
      } else {
        console.error('User not authenticated', error);
        setUserEmail('guest');
      }
    };
    getUser();
  }, []);

  // Fetch classification history
  useEffect(() => {
    const fetchHistory = async () => {
      if (!userEmail) return;
      try {
        const res = await fetch(
          `http://localhost:8000/history/?user_email=${encodeURIComponent(userEmail)}`
        );
        const result = await res.json();
        setHistory(result.reverse());
      } catch (err) {
        console.error('Error fetching history:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [userEmail]);

  const deleteItem = async (id) => {
    try {
      const res = await fetch(
        `http://localhost:8000/delete/?prediction_id=${id}`,
        { method: 'DELETE' }
      );
      if (res.ok) {
        setHistory((prev) => prev.filter((item) => item.id !== id));
      }
    } catch (err) {
      console.error('Error deleting prediction:', err);
    }
  };

  const filteredHistory = history.filter((item) =>
    item.style?.toLowerCase().includes(filter.toLowerCase()) ||
    item.description?.toLowerCase().includes(filter.toLowerCase())
  );

  const handleDelete = (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    deleteItem(id);
  };

  return (
    <div className="relative w-full min-h-screen overflow-hidden bg-white dark:bg-gray-900 flex flex-col">
      {/* Aurora Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Aurora
          colorStops={['#FF3232', '#FF94B4', '#3A29FF']}
          blend={0.5}
          amplitude={1.0}
          speed={0.5}
        />
      </div>

      {/* Main Content */}
      <main className="relative z-10 px-4 py-6 md:px-12 flex-grow">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white whitespace-nowrap">
            🎨 Classification History
          </h2>
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by style or description..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full bg-white/60 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:outline-none rounded-full py-2 pl-10 pr-4 text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            />
          </div>
        </div>

        {loading ? (
          <p className="text-center text-white">Loading...</p>
        ) : filteredHistory.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredHistory.map((item) => (
              <Link
                key={item.id}
                to={`/history/${item.id}`}
                state={{ item: item }}
                className="block relative group transition-transform hover:scale-[1.02]"
              >
                <div className="bg-white/80 dark:bg-gray-800 rounded-2xl shadow-xl backdrop-blur-md overflow-hidden h-full">
                  <img
                    src={item.image_url}
                    alt={item.style || 'Artwork'}
                    className="w-full h-48 object-cover rounded-t-2xl"
                  />
                  <div className="p-4 space-y-2">
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {item.style}
                      </h3>
                      <span className="text-xs font-semibold text-black dark:text-yellow-300">
                        {((item.confidence || 0) * 100).toFixed(0)}%
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                      {item.description}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 pt-2">
                      {item.timestamp
                        ? new Date(item.timestamp).toLocaleString()
                        : 'No timestamp'}
                    </p>
                  </div>
                  <button
                    onClick={(e) => handleDelete(e, item.id)}
                    className="absolute top-3 right-3 p-2 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-transform hover:scale-110 z-20"
                    aria-label="Delete item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-24">
            <History className="w-16 h-16 mx-auto text-gray-500 dark:text-gray-400 mb-4" />
            <h3 className="text-2xl font-bold text-gray-700 dark:text-gray-200">
              No History Yet
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
              {filter
                ? `No matching results for "${filter}".`
                : 'Start classifying images to see your history here.'}
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 py-12 px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 text-left">
          {/* About Section */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              About Art Curator
            </h3>
            <p className="text-sm md:text-base leading-relaxed">
              Art Curator is your go-to platform for exploring and understanding
              the styles behind your favorite artworks. Join us and start your
              artistic journey today.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm md:text-base">
              {links
                .filter(link => link.path !== location.pathname)
                .map(link => (
                  <li key={link.path}>
                    <button
                      onClick={() => navigate(link.path)}
                      className="hover:underline text-left"
                    >
                      {link.name}
                    </button>
                  </li>
                ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              Contact Us
            </h3>
            <address className="not-italic text-sm md:text-base space-y-2">
              <p>
                Email:{' '}
                <a
                  href="mailto:support@artcurator.com"
                  className="underline hover:text-indigo-600 dark:hover:text-indigo-400"
                >
                  support@artcurator.com
                </a>
              </p>
              <p>
                Phone:{' '}
                <a
                  href="tel:+1234567890"
                  className="underline hover:text-indigo-600 dark:hover:text-indigo-400"
                >
                  +1 (234) 567-890
                </a>
              </p>
              <p>Address: 123 Art Street, Creativity City, Artland</p>
            </address>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              Follow Us
            </h3>
            <div className="flex space-x-4 text-2xl">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="hover:text-indigo-600 dark:hover:text-indigo-400">
                <i className="fab fa-facebook" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="hover:text-indigo-600 dark:hover:text-indigo-400">
                <i className="fab fa-twitter" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:text-indigo-600 dark:hover:text-indigo-400">
                <i className="fab fa-instagram" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="hover:text-indigo-600 dark:hover:text-indigo-400">
                <i className="fab fa-linkedin" />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-10 border-t border-gray-300 dark:border-gray-700 pt-6 text-center text-xs md:text-sm text-gray-500 dark:text-gray-400">
          © {new Date().getFullYear()} Art Curator. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default HistoryPage;
