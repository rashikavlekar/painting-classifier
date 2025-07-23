import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Palette, BrainCircuit, Upload } from 'lucide-react';
import ActionButton from '../components/ActionButton';

const ResultsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { result, image } = location.state || {};

  const handleReset = () => {
    navigate('/upload');
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 animate-fade-in">
      <div className="grid md:grid-cols-2 gap-8">
        <img
          src={image}
          alt="Classified art"
          className="w-full h-auto object-contain rounded-lg shadow-md max-h-[500px]"
        />
        <div className="flex flex-col justify-center">
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-blue-500 dark:text-blue-400 uppercase tracking-wider flex items-center gap-2">
              <Palette className="w-5 h-5" /> Predicted Style
            </h3>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {result?.style || 'Unknown'}
            </p>
          </div>

          <div className="mb-6">
            <h3 className="text-sm font-semibold text-blue-500 dark:text-blue-400 uppercase tracking-wider">
              Confidence
            </h3>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
              <div
                className="bg-blue-500 h-2.5 rounded-full"
                style={{ width: `${(result?.confidence || 0) * 100}%` }}
              />
            </div>
            <p className="text-right text-sm font-mono text-blue-400 dark:text-blue-300 mt-1">
              {((result?.confidence || 0) * 100).toFixed(1)}%
            </p>
          </div>

          <div className="mb-6">
            <h3 className="text-sm font-semibold text-blue-500 dark:text-blue-400 uppercase tracking-wider flex items-center gap-2">
              <BrainCircuit className="w-5 h-5" /> AI Curator's Notes
            </h3>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              {result?.description || 'No description available.'}
            </p>
          </div>

          <div className="mt-auto pt-4">
            <ActionButton
              onClick={handleReset}
              icon={<Upload />}
              text="Try Another Image"
              primary
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;
