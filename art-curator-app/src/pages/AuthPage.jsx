import React, { useState } from 'react';
import { supabase } from './supabase.Client';
import { useNavigate } from 'react-router-dom';

const AuthPage = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleAuth = async (e) => {
    e.preventDefault();

    const { error } = isSignup
      ? await supabase.auth.signUp({ email, password })
      : await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      alert(error.message);
    } else {
      navigate('/');
    }

    if (isSignup) {
  const { data: { user } } = await supabase.auth.getUser();
  await supabase.from('users').insert({
    id: user.id,
    email: user.email,
  });
}

  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <h2 className="text-2xl font-bold mb-4">{isSignup ? 'Sign Up' : 'Log In'}</h2>
      <form onSubmit={handleAuth} className="space-y-4 w-full max-w-sm">
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          {isSignup ? 'Sign Up' : 'Log In'}
        </button>
      </form>

      <p className="mt-4 text-sm text-gray-600">
        {isSignup ? 'Already have an account?' : 'New here?'}{' '}
        <button
          onClick={() => setIsSignup(!isSignup)}
          className="text-blue-600 underline"
        >
          {isSignup ? 'Log in' : 'Sign up'}
        </button>
      </p>
    </div>
  );
};

export default AuthPage;
