import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LoaderCircle, Download, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import Aurora from '../components/Aurora';

const links = [
  { name: 'Home', path: '/' },
  { name: 'Gallery', path: '/gallery' },
  { name: 'History', path: '/history' },
  { name: 'About', path: '/about' },
];

const GalleryPage = ({ setPage }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [groupedImages, setGroupedImages] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);

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

  const handleDownload = async () => {
    try {
      const response = await fetch(selectedImage.url);
      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = selectedImage.name || 'painting.jpg';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
      alert("Failed to download image.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh] animate-fade-in">
        <LoaderCircle className="animate-spin w-8 h-8 text-blue-500" />
      </div>
    );
  }

  return (
    <div className="relative w-full min-h-screen bg-white dark:bg-gray-900 overflow-hidden flex flex-col">
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
      <main className="relative z-10 px-4 py-6 md:px-12 flex-grow">
        <h2 className="text-3xl md:text-5xl font-bold text-center text-gray-900 dark:text-white mb-6">
          Art Gallery
        </h2>
        <p className="text-center text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
          Explore a curated selection of breathtaking artworks from various styles.
        </p>

        {Object.keys(groupedImages).length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400">
            No artworks found. Classify images to see them here.
          </div>
        ) : (
          Object.entries(groupedImages).map(([style, images]) => (
            <div key={style} className="mb-10 max-w-6xl mx-auto">
              <h3 className="text-lg font-semibold text-blue-600 dark:text-blue-400 mb-3">{style}</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
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
