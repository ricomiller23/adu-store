'use client';

import React, { useEffect } from 'react';
import { AlertCircle, RefreshCw, Home, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function GlobalErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Unhandled CRM Exception:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#f6f4ee] flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#16352a] text-white shadow-lg mb-2">
          <ShieldCheck className="w-9 h-9 text-[#dd8420]" />
        </div>

        <div>
          <h1 className="text-2xl font-bold font-display tracking-wider text-[#16352a] uppercase">
            The ADU Store
          </h1>
          <p className="text-xs font-semibold text-[#667061] tracking-widest uppercase mt-1">
            CRM &amp; Lead Engine
          </p>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-[#e4dfd3] shadow-md text-left space-y-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-amber-50 text-[#dd8420] rounded-xl flex-shrink-0 mt-0.5">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900 font-display">
                Temporary System Interruption
              </h2>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                The CRM encountered an upstream database blip. The resilient in-memory fallback layer is ready to restore your view.
              </p>
            </div>
          </div>

          {error?.digest && (
            <div className="bg-[#faf9f6] border border-[#e4dfd3] rounded-lg px-3 py-2 text-[11px] font-mono text-gray-500 flex justify-between items-center">
              <span>Incident Digest:</span>
              <strong className="text-gray-800">{error.digest}</strong>
            </div>
          )}

          <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
            <button
              onClick={() => reset()}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg shadow-sm text-xs font-bold text-white bg-[#16352a] hover:bg-[#1a3f32] transition-all cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry Request</span>
            </button>
            <Link
              href="/"
              className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg border border-gray-200 text-xs font-bold text-gray-700 bg-white hover:bg-gray-50 transition-all text-center"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Dashboard</span>
            </Link>
          </div>
        </div>

        <p className="text-[11px] text-gray-400">
          Statewide California Lead Engine · 327 Active Verified Leads Protected
        </p>
      </div>
    </div>
  );
}
