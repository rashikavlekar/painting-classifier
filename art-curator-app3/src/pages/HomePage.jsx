import React, { useEffect, useState } from 'react';
import { Sparkles, LogIn, LogOut } from 'lucide-react';
import ActionButton from '../components/ActionButton';
import { useNavigate } from 'react-router-dom';
import Aurora from '../components/Aurora';
import logo from '../assets/ba.png';
import splashLeft from '../assets/splash-left.png';
import splashRight from '../assets/splash-right.png';
import { supabase } from '../lib/supabase';

const HomePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data?.user || null);
    };
    fetchUser();
  }, []);

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
    <div className="relative w-full h-screen overflow-hidden bg-white dark:bg-gray-900">
      {/* Top Bar */}
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

      {/* Aurora Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Aurora
          className="absolute top-0 left-0 w-1/2 h-full"
          colorStops={["#3A29FF", "#FF94B4", "#FF3232"]}
          blend={0.4}
          amplitude={1.2}
          speed={0.4}
        />
      </div>

      {/* Decorative Paint Splashes */}
      <img
        src={splashLeft}
        alt="Paint Splash Left"
        className="absolute bottom-0 left-0 w-32 md:w-52 lg:w-[20rem] z-0 pointer-events-none max-w-full h-auto"
      />
      <img
        src={splashRight}
        alt="Paint Splash Right"
        className="absolute bottom-0 right-0 w-32 md:w-52 lg:w-[18rem] z-0 pointer-events-none max-w-full h-auto"
      />

      {/* Foreground Content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center h-full px-4">
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
      </div>
    </div>
  );
};

export default HomePage;
