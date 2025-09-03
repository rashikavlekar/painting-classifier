import React, { useEffect, useState } from 'react';
import { Sparkles, LogIn, LogOut } from 'lucide-react';
import ActionButton from '../components/ActionButton';
import { useNavigate, useLocation } from 'react-router-dom';
import Aurora from '../components/Aurora';
import logo from '../assets/ba.png';
import splashLeft from '../assets/splash-left.png';
import splashRight from '../assets/splash-right.png';
import { supabase } from '../lib/supabase';

const HomePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);

  // Footer links
  const links = [
    { name: "Upload Artwork", path: "/upload" },
    { name: "Gallery", path: "/gallery" },
    { name: "About Us", path: "/about" },
    { name: "History", path: "/history" },
    { name: "Home", path: "/" },
  ];

  // Fetch logged-in user
  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data?.user || null);
    };
    fetchUser();
  }, []);

  // Logout handler
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Logout error:", error.message);
    } else {
      setUser(null);
      navigate('/');
    }
  };

  return (
    <div className="relative w-full bg-white dark:bg-gray-900 overflow-x-hidden">
      {/* Top bar with logout */}
      {user && (
        <div className="absolute top-0 left-0 w-full z-20 flex justify-end items-center px-6 py-4 bg-transparent">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm text-white hover:text-red-400 transition"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      )}

      {/* Aurora & background splashes */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Aurora
          className="absolute top-0 left-0 w-1/2 h-full"
          colorStops={["#3A29FF", "#FF94B4", "#FF3232"]}
          blend={0.4}
          amplitude={1.2}
          speed={0.4}
        />
        <img
          src={splashLeft}
          alt="Paint Splash Left"
          className="absolute bottom-0 left-0 w-32 md:w-52 lg:w-[20rem] pointer-events-none max-w-full h-auto"
        />
        <img
          src={splashRight}
          alt="Paint Splash Right"
          className="absolute bottom-0 right-0 w-32 md:w-52 lg:w-[18rem] pointer-events-none max-w-full h-auto"
        />
      </div>

      {/* Main content */}
      <main className="relative z-10 min-h-screen flex flex-col items-center justify-center text-center px-4">
        <img
          src={logo}
          alt="App Logo"
          className="w-40 h-40 md:w-52 md:h-52 object-contain mb-6"
        />
        <h2 className="text-3xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
          Welcome to Art Curator
        </h2>
        <p className="max-w-md text-base md:text-lg text-gray-600 dark:text-gray-300 mb-8">
          Unveil the artistic style. Let's begin your journey of discovery.
        </p>

        {user ? (
          <ActionButton
            onClick={() => navigate('/upload')}
            icon={<Sparkles />}
            text="Get Started"
            primary
          />
        ) : (
          <ActionButton
            onClick={() => navigate('/auth')}
            icon={<LogIn />}
            text="Login / Signup"
            primary
          />
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 py-12 px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 text-left">
          {/* About */}
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

          {/* Contact */}
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

          {/* Socials */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              Follow Us
            </h3>
            <div className="flex space-x-4 text-2xl">
              {/* Icons same as original footer */}
              {/* Facebook */}
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook"
                className="hover:text-indigo-600 dark:hover:text-indigo-400">
                <svg fill="currentColor" viewBox="0 0 24 24" className="w-6 h-6">
                  <path d="M22 12a10 10 0 10-11.5 9.87v-7h-3v-3h3v-2.2c0-3 1.79-4.7 4.5-4.7 1.3 0 2.67.23 2.67.23v3h-1.51c-1.49 0-1.96.93-1.96 1.88V12h3.33l-.53 3h-2.8v7A10 10 0 0022 12z" />
                </svg>
              </a>
              {/* Twitter */}
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter"
                className="hover:text-indigo-600 dark:hover:text-indigo-400">
                <svg fill="currentColor" viewBox="0 0 24 24" className="w-6 h-6">
                  <path d="M23 3a10.9 10.9 0 01-3.14.86 5.48 5.48 0 002.4-3 10.86 10.86 0 01-3.47 1.33 5.46 5.46 0 00-9.3 4.98A15.49 15.49 0 013 4.15a5.46 5.46 0 001.69 7.28 5.42 5.42 0 01-2.47-.68v.07a5.46 5.46 0 004.37 5.35 5.48 5.48 0 01-2.46.09 5.46 5.46 0 005.1 3.8 10.94 10.94 0 01-6.77 2.34c-.44 0-.87-.02-1.3-.07a15.44 15.44 0 008.38 2.46c10.05 0 15.56-8.32 15.56-15.54 0-.24 0-.48-.02-.72A11.2 11.2 0 0023 3z" />
                </svg>
              </a>
              {/* Instagram */}
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram"
                className="hover:text-indigo-600 dark:hover:text-indigo-400">
                <svg fill="currentColor" viewBox="0 0 24 24" className="w-6 h-6">
                  <path d="M7 2C4.243 2 2 4.243 2 7v10c0 2.757 2.243 5 5 5h10c2.757 0 5-2.243 5-5V7c0-2.757-2.243-5-5-5H7zm10 3a1 1 0 110 2 1 1 0 010-2zm-5 3a4 4 0 100 8 4 4 0 000-8zm0 2a2 2 0 110 4 2 2 0 010-4z" />
                </svg>
              </a>
              {/* LinkedIn */}
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"
                className="hover:text-indigo-600 dark:hover:text-indigo-400">
                <svg fill="currentColor" viewBox="0 0 24 24" className="w-6 h-6">
                  <path d="M16 8a6 6 0 016 6v6h-4v-6a2 2 0 00-4 0v6h-4v-12h4v2a6 6 0 016-2zM2 9h4v12H2zM4 4a2 2 0 110 4 2 2 0 010-4z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-gray-300 dark:border-gray-700 pt-6 text-center text-xs md:text-sm text-gray-500 dark:text-gray-400">
          © {new Date().getFullYear()} Art Curator. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
