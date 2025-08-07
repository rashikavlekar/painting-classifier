import React, { useEffect, useState } from 'react';
import { LoaderCircle, Download, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import Aurora from '../components/Aurora';

const GalleryPage = ({ setPage }) => {
  const [groupedImages, setGroupedImages] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null); // For modal view

  useEffect(() => {
    const fetchGallery = async () => {
      setPage && setPage("gallery");

      const { data: { user }, error } = await supabase.auth.getUser();

      if (error || !user) {
        console.error("User not authenticated:", error?.message);
        setLoading(false);
        return;
      }

      const user_email = user.email;

      try {
        const response = await fetch(`http://localhost:8000/gallery/?user_email=${user_email}`);
        const data = await response.json();
        setGroupedImages(data || {});
      } catch (err) {
        console.error("Failed to load gallery:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchGallery();
  }, [setPage]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh] animate-fade-in">
        <LoaderCircle className="animate-spin w-8 h-8 text-blue-500" />
      </div>
    );
  }

     const handleDownload = async () => {
        try {
          const response = await fetch(selectedImage.url);
          const blob = await response.blob();

          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = selectedImage.name || 'painting.jpg'; // force filename
          document.body.appendChild(a);
          a.click();  // this triggers the download
          a.remove();
          window.URL.revokeObjectURL(url);  // cleanup
        } catch (error) {
          console.error("Download failed:", error);
          alert("Failed to download image.");
        }
      };
   

  return (
    <div className="relative w-full min-h-screen bg-white dark:bg-gray-900 overflow-hidden animate-fade-in">
      {/* Aurora Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Aurora
          className="absolute top-0 left-0 w-1/2 h-full"
          colorStops={['#3A29FF', '#FF94B4', '#FF3232']}
          blend={0.4}
          amplitude={1.2}
          speed={0.4}
        />
        <Aurora
          className="absolute top-0 right-0 w-1/2 h-full"
          colorStops={['#FF3232', '#FF94B4', '#3A29FF']}
          blend={0.4}
          amplitude={1.2}
          speed={0.4}
        />
      </div>

      {/* Gallery Content */}
      <div className="relative z-10 px-4 py-6 md:px-12">
        <h2 className="text-3xl md:text-5xl font-bold text-center text-gray-900 dark:text-white mb-6">
          Art Gallery
        </h2>
        <p className="text-center text-gray-1600 dark:text-gray-1300 mb-8 max-w-2xl mx-auto">
          Explore a curated selection of breathtaking artworks from various styles.
        </p>

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
                  <div
                    key={idx}
                    className="overflow-hidden rounded-xl shadow-lg hover:scale-105 transition-transform cursor-pointer"
                    onClick={() => setSelectedImage({ url, style })}
                  >
                    <img
                      src={url}
                      alt={`${style}-${idx}`}
                      className="w-full h-48 object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Image Modal Viewer */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-80 flex items-center justify-center px-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 max-w-3xl w-full shadow-lg relative">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
            >
              <X className="w-6 h-6" />
            </button>
            <h3 className="text-xl font-semibold text-center text-gray-800 dark:text-white mb-4">
              {selectedImage.style}
            </h3>
            <img
              src={selectedImage.url}
              alt="Selected Artwork"
              className="w-full max-h-[70vh] object-contain rounded-lg mb-4"
            />
            <div className="text-center">
              <button
  onClick={handleDownload}
  className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition"
>
  <Download className="w-4 h-4 mr-2" />
  Download
</button>



            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryPage;
