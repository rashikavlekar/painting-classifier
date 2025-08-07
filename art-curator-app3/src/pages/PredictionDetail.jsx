import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Percent, Tag, FileText } from 'lucide-react';
import Aurora from '../components/Aurora';

const PredictionDetail = () => {
  const location = useLocation();
  const { item } = location.state || {};

  if (!item) {
    return (
      <div className="relative flex flex-col items-center justify-center w-full min-h-screen bg-white dark:bg-gray-900 px-4">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <Aurora colorStops={['#FF3232', '#FF94B4', '#3A29FF']} />
        </div>
        <div className="relative z-10 text-center">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">No Item Found</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Please return to the history page and select an item to view its details.
          </p>
          <Link
            to="/history"
            className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-full shadow-lg hover:bg-indigo-700 transition-transform hover:scale-105"
          >
            <ArrowLeft size={20} />
            Back to History
          </Link>
        </div>
      </div>
    );
  }

  const confidence = item.confidence
    ? ((item.confidence || 0) * 100).toFixed(0)
    : '—';

  // Convert Firestore-style or ISO timestamp
  let timestampDisplay = 'No timestamp available';
  if (item.timestamp) {
    try {
      if (typeof item.timestamp === 'string') {
        timestampDisplay = new Date(item.timestamp).toLocaleString();
      } else if (item.timestamp.seconds) {
        timestampDisplay = new Date(item.timestamp.seconds * 1000).toLocaleString();
      } else {
        timestampDisplay = new Date(item.timestamp).toLocaleString();
      }
    } catch {
      timestampDisplay = 'Invalid date';
    }
  }

  const imageSrc =
    item.imageUrl || item.image || item.image_url || item.storage_path || '';

  return (
    <div className="relative w-full min-h-screen overflow-hidden bg-white dark:bg-gray-900 p-4 sm:p-6 md:p-8">
      {/* Background Aurora */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Aurora colorStops={['#FF3232', '#FF94B4', '#3A29FF']} />
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Back Button */}
        <Link
          to="/history"
          className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors mb-6"
        >
          <ArrowLeft size={20} />
          Back to History
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Image Section */}
          <div className="lg:col-span-3">
            <img
              src={imageSrc}
              alt={item.style || 'Artwork'}
              className="w-full h-auto object-contain rounded-3xl shadow-2xl border-4 border-white/20"
            />
          </div>

          {/* Details Section */}
          <div className="lg:col-span-2 bg-white/50 dark:bg-gray-800/50 backdrop-blur-lg rounded-3xl p-6 lg:p-8 shadow-xl">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
              {item.style || 'Unknown Style'}
            </h2>

            <div className="space-y-5">
              {/* Confidence */}
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0 bg-yellow-400/20 dark:bg-yellow-400/10 p-3 rounded-full">
                  <Percent className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-white">Confidence</h3>
                  <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-300">
                    {confidence}%
                  </p>
                </div>
              </div>

              {/* Art Style */}
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0 bg-blue-400/20 dark:bg-blue-400/10 p-3 rounded-full">
                  <Tag className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-white">Art Style</h3>
                  <p className="text-lg text-gray-600 dark:text-gray-300">{item.style}</p>
                </div>
              </div>

              {/* Timestamp */}
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0 bg-green-400/20 dark:bg-green-400/10 p-3 rounded-full">
                  <Calendar className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-white">Date Classified</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{timestampDisplay}</p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mt-8 pt-6 border-t border-gray-300 dark:border-gray-600">
              <h3 className="font-semibold text-gray-800 dark:text-white mb-2 flex items-center gap-2">
                <FileText size={18} /> Description
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {item.description || 'No description provided.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PredictionDetail;
