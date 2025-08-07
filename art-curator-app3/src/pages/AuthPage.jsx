import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import Aurora from '../components/Aurora';
import logo from '../assets/ba.png';
import splashLeft from '../assets/splash-left.png';
import splashRight from '../assets/splash-right.png';

const AuthPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');

  // ✅ Handle login/signup
  const handleAuth = async () => {
    setError('');
    setInfo('');

    if (isSigningUp) {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) {
        setError(error.message);
      } else {
        setInfo('A confirmation email has been sent. Please verify before logging in.');
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setError(error.message);
      } else {
        navigate('/upload');
      }
    }
  };

  // ✅ OAuth login
  const handleOAuthLogin = async (provider) => {
    const { error } = await supabase.auth.signInWithOAuth({ provider });
    if (error) console.error(error.message);
  };

  // ✅ Auth state listener for email confirmation
  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        navigate('/'); // change to '/upload' if that's preferred
      }
    });

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, [navigate]);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-white dark:bg-gray-900">
      {/* Aurora Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Aurora
          className="absolute top-0 left-0 w-1/2 h-full"
          colorStops={['#3A29FF', '#FF94B4', '#FF3232']}
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

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center h-full px-4">
        <img
          src={logo}
          alt="App Logo"
          className="w-32 h-32 md:w-44 md:h-44 object-contain mb-6"
        />
        <h2 className="text-3xl md:text-4xl font-bold mb-2 text-gray-900 dark:text-white">
          {isSigningUp ? 'Create Account' : 'Login to Continue'}
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-6 max-w-sm">
          {isSigningUp
            ? 'Join the community. Confirm your email after signing up.'
            : 'Enter your credentials to access the magic of Art Curator.'}
        </p>

        {/* Auth Form */}
        <div className="flex flex-col items-center w-full max-w-sm space-y-3">
          <input
            type="email"
            placeholder="Email"
            className="p-2 w-full border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="p-2 w-full border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && <p className="text-red-500 text-sm">{error}</p>}
          {info && <p className="text-green-500 text-sm">{info}</p>}

          <button
            onClick={handleAuth}
            className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-semibold transition"
          >
            {isSigningUp ? 'Create Account' : 'Login'}
          </button>

          <button
            onClick={() => {
              setIsSigningUp(!isSigningUp);
              setError('');
              setInfo('');
            }}
            className="text-sm text-blue-400 hover:underline"
          >
            {isSigningUp ? 'Already have an account? Login' : 'Need an account? Sign up'}
          </button>

          <div className="w-full border-t border-gray-300 dark:border-gray-700 mt-4 pt-4 text-sm text-gray-500">
            Or sign in with
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => handleOAuthLogin('google')}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
            >
              Google
            </button>
            <button
              onClick={() => handleOAuthLogin('github')}
              className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded-md"
            >
              GitHub
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
