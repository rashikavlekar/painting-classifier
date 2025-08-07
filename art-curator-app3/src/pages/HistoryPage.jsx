import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Trash2, History, Search } from 'lucide-react';
import Aurora from '../components/Aurora';

const HistoryPage = () => {
  const [history, setHistory] = useState([]);
  const [filter, setFilter] = useState('');
  const [userEmail, setUserEmail] = useState(null);
  const [loading, setLoading] = useState(true);

  // Get user email
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
        {
          method: 'DELETE',
        }
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
    <div className="relative w-full min-h-screen overflow-hidden bg-white dark:bg-gray-900 px-4 md:px-8 py-6 md:py-10">
      {/* Aurora Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Aurora
          colorStops={['#FF3232', '#FF94B4', '#3A29FF']}
          blend={0.5}
          amplitude={1.0}
          speed={0.5}
        />
      </div>

      <div className="relative z-10 space-y-8 max-w-7xl mx-auto animate-fade-in">
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

        {/* Card Grid */}
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
            <h3 className="text-2xl font-bold text-gray-700 dark:text-gray-200">No History Yet</h3>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
              {filter
                ? `No matching results for "${filter}".`
                : 'Start classifying images to see your history here.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryPage;
