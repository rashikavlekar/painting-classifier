import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Palette, BrainCircuit, Upload, Calendar, AlertTriangle } from 'lucide-react';
import ActionButton from '../components/ActionButton';

const ResultsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { result, image } = location.state || {};

  const handleReset = () => {
    navigate('/upload');
  };

  const warning = result?.warning;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 animate-fade-in">
      <div className="grid md:grid-cols-2 gap-8">
        <img
          src={image || result?.image_url}
          alt="Classified art"
          className="w-full h-auto object-contain rounded-lg shadow-md max-h-[500px]"
        />

        <div className="flex flex-col justify-center">
          {/* 🔸 Warning box for low confidence */}
          {warning && (
            <div className="mb-4 p-3 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-100 rounded-lg flex items-start gap-2">
              <AlertTriangle className="mt-1 w-5 h-5" />
              <div>
                <strong>Low Confidence:</strong> {warning}
              </div>
            </div>
          )}

          <div className="mb-4">
            <h3 className="text-sm font-semibold text-blue-500 dark:text-blue-400 uppercase tracking-wider flex items-center gap-2">
              <Palette className="w-5 h-5" /> Predicted Style
            </h3>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {result?.style || result?.predictions?.[0]?.[0] || 'Unknown'}
            </p>

            {typeof result?.confidence === 'number' && (
              <div className="mb-4">
                <div className="flex justify-between text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  <span>Confidence</span>
                  <span>{(result.confidence * 100).toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${(result.confidence * 100).toFixed(1)}%` }}
                  />
                </div>
              </div>
            )}

          </div>

          {/* Top 3 predictions */}
          {result?.predictions && (() => {
          const [topLabel, topScore] = result.predictions[0];
          const relatedStyles = result.predictions
            .filter(([label, score]) => label !== topLabel && score >= topScore - 0.1);

          return relatedStyles.length > 0 ? (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-blue-500 dark:text-blue-400 uppercase tracking-wider">
                Related Styles
              </h3>
              <div className="space-y-2 mt-2">
                {relatedStyles.map(([label, score], index) => (
                  <div
                    key={index}
                    className="flex justify-between text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    <span>{label}</span>
                    <span>{(score * 100).toFixed(1)}%</span>
                  </div>
                ))}
              </div>
            </div>
          ) : null;
        })()}




          {/* AI Description */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-blue-500 dark:text-blue-400 uppercase tracking-wider flex items-center gap-2">
              <BrainCircuit className="w-5 h-5" /> AI Curator's Notes
            </h3>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              {result?.description || 'No description available.'}
            </p>
          </div>

          {/* Timestamp */}
          {result?.timestamp && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-blue-500 dark:text-blue-400 uppercase tracking-wider flex items-center gap-2">
                <Calendar className="w-5 h-5" /> Timestamp
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm font-mono">
                {new Date(result.timestamp).toLocaleString()}
              </p>
            </div>
          )}

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
