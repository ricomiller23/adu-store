"use client";

import React, { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, Mail, AlertCircle, ArrowRight, ShieldCheck } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await signIn("credentials", {
        email: email.trim(),
        password: password,
        redirect: false,
      });

      if (res?.error) {
        setError("Invalid administrator email or password. Please try again.");
        setLoading(false);
      } else if (res?.ok) {
        router.push(callbackUrl);
        router.refresh();
      } else {
        setError("An unexpected login failure occurred. Please try again.");
        setLoading(false);
      }
    } catch (err: any) {
      console.error("Sign in error:", err);
      setError("Networking error while signing in. Please check your connection.");
      setLoading(false);
    }
  };

  return (
    <div className="bg-white py-8 px-6 shadow-xl rounded-2xl border border-[#e4dfd3] sm:px-10">
      <div className="mb-6 text-center border-b border-gray-100 pb-4">
        <h2 className="text-lg font-bold text-gray-900 font-display">
          Administrator Sign In
        </h2>
        <p className="text-xs text-gray-500 mt-1">
          Restricted portal. Authenticated administrators only.
        </p>
      </div>

      {error && (
        <div className="mb-5 p-3.5 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2.5 text-xs text-red-700 font-medium">
          <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
            Admin Email
          </label>
          <div className="relative rounded-lg shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <Mail className="h-4 w-4" />
            </div>
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@theadustore.com"
              className="block w-full pl-10 pr-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#16352a] focus:border-[#16352a] transition-all bg-[#faf9f6]"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
            Password
          </label>
          <div className="relative rounded-lg shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <Lock className="h-4 w-4" />
            </div>
            <input
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="block w-full pl-10 pr-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#16352a] focus:border-[#16352a] transition-all bg-[#faf9f6]"
            />
          </div>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center py-2.5 px-4 rounded-lg shadow-sm text-sm font-bold text-white bg-[#16352a] hover:bg-[#1a3f32] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#16352a] transition-all disabled:opacity-50"
          >
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Signing in…</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5">
                <span>Sign In to CRM</span>
                <ArrowRight className="w-4 h-4" />
              </span>
            )}
          </button>
        </div>
      </form>

      <div className="mt-6 pt-4 border-t border-gray-100 text-center space-y-3">
        <div className="bg-[#16352a]/5 border border-[#16352a]/15 rounded-lg p-3 text-xs text-[#16352a] text-left">
          <div className="flex items-center justify-between mb-1.5">
            <span className="font-bold uppercase tracking-wider text-[10px] text-[#dd8420]">Administrator Credentials</span>
            <button
              type="button"
              onClick={() => {
                setEmail("admin@theadustore.com");
                setPassword("admin123");
              }}
              className="text-[11px] font-bold text-[#16352a] hover:underline bg-white px-2 py-0.5 rounded border border-[#16352a]/20 shadow-xs cursor-pointer"
            >
              Click to Autofill
            </button>
          </div>
          <div className="space-y-0.5 font-mono text-[11px]">
            <div>Email: <strong className="select-all text-gray-900">admin@theadustore.com</strong></div>
            <div>Password: <strong className="select-all text-gray-900">admin123</strong></div>
          </div>
        </div>

        <p className="text-[11px] text-gray-400">
          Authorized IP logged for security. All operations monitored.
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#f6f4ee] flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#16352a] text-white shadow-lg mb-4">
          <ShieldCheck className="w-8 h-8 text-[#dd8420]" />
        </div>
        <h1 className="text-2xl font-bold font-display tracking-wider text-[#16352a] uppercase">
          The ADU Store
        </h1>
        <p className="text-xs font-semibold text-[#667061] tracking-widest uppercase mt-1">
          Internal CRM &amp; Lead Engine
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <Suspense fallback={
          <div className="bg-white p-8 rounded-2xl border border-[#e4dfd3] text-center text-sm text-gray-500">
            Loading login portal…
          </div>
        }>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
