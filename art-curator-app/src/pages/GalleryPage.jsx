import React, { useEffect, useState } from 'react';
import { LoaderCircle } from 'lucide-react';

const GalleryPage = () => {
  const [groupedImages, setGroupedImages] = useState({});
  const [loading, setLoading] = useState(true);

  const email =  "guest@example.com";

  useEffect(() => {
    

    const fetchGallery = async () => {
      try {
        const response = await fetch(`http://localhost:8000/gallery/?user_email=${email}`);
        const data = await response.json();
        setGroupedImages(data || {});
      } catch (err) {
        console.error('Failed to load gallery:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchGallery();
  }, );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh] animate-fade-in">
        <LoaderCircle className="animate-spin w-8 h-8 text-blue-500" />
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-white">Gallery by Style</h2>

      {Object.keys(groupedImages).length === 0 ? (
        <div className="text-center text-gray-500 dark:text-gray-400">
          No artworks found. Classify images to see them here.
        </div>
      ) : (
        Object.entries(groupedImages).map(([style, images]) => (
          <div key={style} className="mb-10">
            <h3 className="text-lg font-semibold text-blue-600 dark:text-blue-400 mb-3">{style}</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {images.map((url, idx) => (
                <img
                  key={idx}
                  src={url}
                  alt={`${style}-${idx}`}
                  className="w-full h-48 object-cover rounded-lg shadow-md hover:scale-105 transition-transform"
                />
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default GalleryPage;
