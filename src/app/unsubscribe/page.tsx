'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { ShieldCheck, Mail, CheckCircle2, AlertCircle } from 'lucide-react';

function UnsubscribeContent() {
  const searchParams = useSearchParams();
  const initialEmail = searchParams.get('email') || '';
  const status = searchParams.get('status');

  const [email, setEmail] = useState(initialEmail);
  const [submitted, setSubmitted] = useState(status === 'success');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/unsubscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (res.ok) {
        setSubmitted(true);
      } else {
        setError(data.error || 'Failed to process request.');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf9f6] flex flex-col justify-center items-center p-4">
      <div className="max-w-md w-full bg-white border border-[#e4dfd3] shadow-md rounded-xl p-8 space-y-6 text-center">
        <div className="inline-flex p-3 rounded-full bg-[#16352a]/10 text-[#16352a] mb-1">
          <ShieldCheck className="h-8 w-8" />
        </div>

        <div>
          <h1 className="text-2xl font-bold font-display text-gray-900">The ADU Store</h1>
          <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider font-semibold">
            Communication Preferences & CAN-SPAM Compliance
          </p>
        </div>

        {submitted ? (
          <div className="p-5 bg-green-50 border border-green-200 rounded-lg text-left space-y-3">
            <div className="flex items-center text-[#2f7d54] font-bold text-sm">
              <CheckCircle2 className="h-5 w-5 mr-2 flex-shrink-0" />
              <span>Unsubscribe Confirmed</span>
            </div>
            <p className="text-xs text-gray-700 leading-relaxed">
              {email ? (
                <>
                  <strong className="text-gray-900">{email}</strong> has been successfully removed from our outreach and sequence mailing lists.
                </>
              ) : (
                "Your email has been successfully removed from our outreach and sequence mailing lists."
              )}
            </p>
            <p className="text-[11px] text-gray-500">
              In accordance with CAN-SPAM regulations, this suppression is effective immediately across all automated campaigns.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            <p className="text-xs text-gray-600 leading-relaxed">
              Enter your email below to opt out of all future ADU feasibility, market updates, and nurture communications.
            </p>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-9 pr-3 py-2 text-sm border border-[#e4dfd3] rounded focus:outline-none focus:ring-2 focus:ring-[#16352a]"
                />
                <Mail className="h-4 w-4 text-gray-400 absolute left-3 top-2.5" />
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 text-red-700 text-xs rounded flex items-center">
                <AlertCircle className="h-4 w-4 mr-1.5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-[#16352a] text-white text-sm font-semibold rounded hover:bg-[#112920] transition disabled:opacity-50 shadow"
            >
              {loading ? 'Updating Preferences...' : 'Unsubscribe Immediately'}
            </button>
          </form>
        )}

        <div className="pt-4 border-t border-gray-100 text-[11px] text-gray-400">
          The ADU Store · 123 Modular Way, Sacramento, CA 95814
        </div>
      </div>
    </div>
  );
}

export default function UnsubscribePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#faf9f6] flex items-center justify-center text-sm text-gray-500">Loading...</div>}>
      <UnsubscribeContent />
    </Suspense>
  );
}
