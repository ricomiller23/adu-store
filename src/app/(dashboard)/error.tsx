'use client';

import React, { useEffect } from 'react';
import { AlertCircle, RefreshCw, LayoutDashboard } from 'lucide-react';
import Link from 'next/link';

export default function DashboardErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Dashboard Error Caught:', error);
  }, [error]);

  return (
    <div className="max-w-xl mx-auto my-12 bg-white p-8 rounded-2xl border border-[#e4dfd3] shadow-sm text-center space-y-6">
      <div className="w-12 h-12 bg-amber-50 text-[#dd8420] rounded-2xl mx-auto flex items-center justify-center">
        <AlertCircle className="w-6 h-6" />
      </div>

      <div>
        <h2 className="text-xl font-bold font-display text-gray-900">
          Dashboard View Resynchronizing
        </h2>
        <p className="text-xs text-gray-500 mt-1 max-w-md mx-auto">
          An error occurred while loading this view. The resilient lead engine is maintaining 327 active properties.
        </p>
      </div>

      {error?.digest && (
        <div className="inline-block bg-[#faf9f6] border border-[#e4dfd3] rounded-lg px-4 py-1.5 text-xs font-mono text-gray-600">
          Error Digest: <strong>{error.digest}</strong>
        </div>
      )}

      <div className="flex justify-center gap-3">
        <button
          onClick={() => reset()}
          className="flex items-center gap-2 py-2 px-5 rounded-lg text-xs font-bold text-white bg-[#16352a] hover:bg-[#1a3f32] transition-all cursor-pointer shadow-sm"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reload View</span>
        </button>
        <Link
          href="/"
          className="flex items-center gap-2 py-2 px-5 rounded-lg border border-gray-200 text-xs font-bold text-gray-700 bg-white hover:bg-gray-50 transition-all shadow-sm"
        >
          <LayoutDashboard className="w-3.5 h-3.5" />
          <span>Main Dashboard</span>
        </Link>
      </div>
    </div>
  );
}
