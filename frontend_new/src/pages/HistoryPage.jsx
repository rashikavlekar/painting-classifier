import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Trash2, History, Search } from 'lucide-react';
import Aurora from '../components/Aurora';

const HistoryPage = ({ history, deleteItem, filter, setFilter }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const links = [
    { name: 'Upload Artwork', path: '/upload' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'About Us', path: '/about' },
    { name: 'History', path: '/history' },
    { name: 'Home', path: '/' },
  ];

  const filteredHistory = history.filter(item =>
    item.style?.toLowerCase().includes(filter.toLowerCase()) ||
    item.description?.toLowerCase().includes(filter.toLowerCase())
  );

  // Stop click from navigating when deleting
  const handleDelete = (e, id) => {
    e.preventDefault(); // Prevent Link navigation
    e.stopPropagation();
    deleteItem(id);
  };

  return (
    <div className="relative w-full min-h-screen overflow-hidden bg-white dark:bg-gray-900 px-4 md:px-8 py-6 md:py-10 flex flex-col">
      {/* Aurora Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Aurora
          colorStops={['#FF3232', '#FF94B4', '#3A29FF']}
          blend={0.5}
          amplitude={1.0}
          speed={0.5}
        />
      </div>

      {/* Main content */}
      <div className="relative z-10 space-y-8 max-w-7xl mx-auto animate-fade-in flex-grow">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
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

        {filteredHistory.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredHistory.map((item) => (
              <Link
                key={item.id}
                to={`/history/${item.id}`}
                state={{ item }}
                className="block relative group transition-transform hover:scale-[1.02]"
              >
                <div className="bg-white/80 dark:bg-gray-800 rounded-2xl shadow-xl backdrop-blur-md overflow-hidden h-full">
                  <img
                    src={item.imageUrl || item.image}
                    alt={item.style || 'Artwork'}
                    className="w-full h-48 object-cover rounded-t-2xl"
                  />
                  <div className="p-4 space-y-2">
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{item.style}</h3>
                      <span className="text-xs font-semibold text-black dark:text-yellow-300">
                        {((item.confidence || 0) * 100).toFixed(0)}%
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                      {item.description}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 pt-2">
                      {item.timestamp
                        ? new Date(item.timestamp.seconds * 1000).toLocaleString()
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
            <h3 className="text-2xl font-bold text-gray-700 dark:text-gray-200">No History Yet</h3>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
              {filter
                ? `No matching results for "${filter}".`
                : 'Start classifying images to see your history here.'}
            </p>
          </div>
        )}
      </div>

      {/* Big Footer below the fold */}
      <footer className="relative z-10 w-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 py-12 px-8 mt-12">
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
                      className="hover:underline"
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
              {/* Facebook */}
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="hover:text-indigo-600 dark:hover:text-indigo-400"
              >
                <svg
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  className="w-6 h-6"
                  aria-hidden="true"
                >
                  <path d="M22 12a10 10 0 10-11.5 9.87v-7h-3v-3h3v-2.2c0-3 1.79-4.7 4.5-4.7 1.3 0 2.67.23 2.67.23v3h-1.51c-1.49 0-1.96.93-1.96 1.88V12h3.33l-.53 3h-2.8v7A10 10 0 0022 12z" />
                </svg>
              </a>
              {/* Twitter */}
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
                className="hover:text-indigo-600 dark:hover:text-indigo-400"
              >
                <svg
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  className="w-6 h-6"
                  aria-hidden="true"
                >
                  <path d="M23 3a10.9 10.9 0 01-3.14.86 5.48 5.48 0 002.4-3 10.86 10.86 0 01-3.47 1.33 5.46 5.46 0 00-9.3 4.98A15.49 15.49 0 013 4.15a5.46 5.46 0 001.69 7.28 5.42 5.42 0 01-2.47-.68v.07a5.46 5.46 0 004.37 5.35 5.48 5.48 0 01-2.46.09 5.46 5.46 0 005.1 3.8 10.94 10.94 0 01-6.77 2.34c-.44 0-.87-.02-1.3-.07a15.44 15.44 0 008.38 2.46c10.05 0 15.56-8.32 15.56-15.54 0-.24 0-.48-.02-.72A11.2 11.2 0 0023 3z" />
                </svg>
              </a>
              {/* Instagram */}
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="hover:text-indigo-600 dark:hover:text-indigo-400"
              >
                <svg
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  className="w-6 h-6"
                  aria-hidden="true"
                >
                  <path d="M7 2C4.243 2 2 4.243 2 7v10c0 2.757 2.243 5 5 5h10c2.757 0 5-2.243 5-5V7c0-2.757-2.243-5-5-5H7zm10 3a1 1 0 110 2 1 1 0 010-2zm-5 3a4 4 0 100 8 4 4 0 000-8zm0 2a2 2 0 110 4 2 2 0 010-4z" />
                </svg>
              </a>
              {/* LinkedIn */}
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="hover:text-indigo-600 dark:hover:text-indigo-400"
              >
                <svg
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  className="w-6 h-6"
                  aria-hidden="true"
                >
                  <path d="M16 8a6 6 0 016 6v6h-4v-6a2 2 0 00-4 0v6h-4v-12h4v2a6 6 0 016-2zM2 9h4v12H2zM4 4a2 2 0 110 4 2 2 0 010-4z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="mt-10 border-t border-gray-300 dark:border-gray-700 pt-6 text-center text-xs md:text-sm text-gray-500 dark:text-gray-400">
          © {new Date().getFullYear()} Art Curator. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default HistoryPage;
