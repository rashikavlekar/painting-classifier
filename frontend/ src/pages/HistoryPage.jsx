import React from 'react';
import { Trash2, History, Search } from 'lucide-react';

const HistoryPage = ({ history, deleteItem, filter, setFilter }) => {
  const filteredHistory = history.filter(item =>
    item.style?.toLowerCase().includes(filter.toLowerCase()) ||
    item.description?.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Classification History</h2>
        <div className="relative w-full md:w-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Filter history..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full bg-gray-200 dark:bg-gray-700 border-transparent focus:ring-2 focus:ring-blue-500 focus:border-transparent rounded-full py-2 pl-10 pr-4"
          />
        </div>
      </div>

      {filteredHistory.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHistory.map((item) => (
            <div key={item.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden group relative">
              <img src={item.imageUrl} alt={item.style || 'Artwork'} className="w-full h-48 object-cover" />
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white">{item.style}</h3>
                  <p className="text-sm font-mono text-blue-400 dark:text-blue-300">
                    {((item.confidence || 0) * 100).toFixed(0)}%
                  </p>
                </div>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 line-clamp-2">{item.description}</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                  {item.timestamp ? new Date(item.timestamp.seconds * 1000).toLocaleDateString() : 'No date'}
                </p>
              </div>
              <button onClick={() => deleteItem(item.id)} className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-red-700 hover:scale-110">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <History className="w-16 h-16 mx-auto text-gray-600 dark:text-gray-500 mb-4" />
          <h3 className="text-xl font-semibold">Your History is Empty</h3>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            {filter ? `No results found for "${filter}".` : "Classify some images to see them here."}
          </p>
        </div>
      )}
    </div>
  );
};

export default HistoryPage;
