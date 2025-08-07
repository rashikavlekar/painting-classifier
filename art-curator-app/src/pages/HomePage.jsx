import React, { useEffect } from 'react';
import { Palette, Sparkles } from 'lucide-react';
import ActionButton from '../components/ActionButton';
import { useNavigate } from 'react-router-dom';
import { supabase } from './supabase.Client';

const HomePage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        // Not logged in, redirect to login
        navigate('/login');
      }
    };

    checkAuth();
  }, [navigate]);

  return (
    <div className="text-center flex flex-col items-center justify-center p-4 h-[calc(100vh-150px)] animate-fade-in">
      <Palette className="w-24 h-24 text-blue-500 mb-4" />
      <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">Welcome to the Curator</h2>
      <p className="max-w-md mb-8 text-gray-500 dark:text-gray-400">
        Unveil the artistic style of any painting. Let's begin your journey of discovery.
      </p>
      <ActionButton onClick={() => navigate('/upload')} icon={<Sparkles />} text="Get Started" primary />
    </div>
  );
};

export default HomePage;
