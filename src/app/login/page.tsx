'use client';

import React, { useState, Suspense } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await signIn('credentials', {
        redirect: false,
        email,
        password,
        callbackUrl,
      });

      if (res?.error) {
        setError('Invalid email or password.');
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (err) {
      console.error(err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f6f4ee] font-sans px-4">
      <div className="max-w-md w-full bg-white border border-[#e4dfd3] shadow-md rounded-lg overflow-hidden">
        {/* Header Block in Deep Pine */}
        <div className="bg-[#16352a] px-8 py-6 text-white text-center">
          <h1 className="text-2xl font-bold tracking-tight font-display text-white">
            THE ADU STORE
          </h1>
          <p className="text-[#a3b899] text-sm mt-1 font-medium tracking-wide">
            Lead Engine & CRM Console
          </p>
        </div>

        {/* Form Block */}
        <div className="p-8">
          <h2 className="text-xl font-bold text-gray-800 mb-6 font-display border-b border-gray-100 pb-2">
            Administrator Sign In
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                Email Address
              </label>
              <input
                type="email"
                required
                className="w-full px-4 py-3 bg-[#fbfbfa] border border-[#e4dfd3] rounded focus:outline-none focus:ring-2 focus:ring-[#27537d] focus:border-transparent text-gray-800 transition duration-150"
                placeholder="admin@theadustore.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                Password
              </label>
              <input
                type="password"
                required
                className="w-full px-4 py-3 bg-[#fbfbfa] border border-[#e4dfd3] rounded focus:outline-none focus:ring-2 focus:ring-[#27537d] focus:border-transparent text-gray-800 transition duration-150"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#27537d] text-white font-bold rounded shadow hover:bg-[#1f4366] active:bg-[#16304a] disabled:opacity-50 transition duration-150 text-center tracking-wide"
            >
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>
        </div>

        {/* Footer info */}
        <div className="bg-[#fcfcfa] border-t border-[#f0ece3] px-8 py-4 text-center">
          <p className="text-xs text-gray-400">
            Authorized access only. Technical Support: info@TheADUStore.com
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[#f6f4ee] text-[#16352a] text-sm font-semibold">Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
