"use client";

import React, { useState } from "react";
import Sidebar from "@/components/Sidebar";
import { Menu, X, LogOut, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { signOut, useSession } from "next-auth/react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { data: session } = useSession();

  return (
    <div className="flex h-screen overflow-hidden bg-[#f6f4ee] font-sans flex-col md:flex-row">
      {/* Mobile Top Header */}
      <header className="flex md:hidden items-center justify-between px-6 py-4 bg-[#16352a] text-white border-b border-[#0f241d] shadow-md z-40">
        <div className="flex flex-col">
          <span className="text-lg font-bold tracking-wider font-display">THE ADU STORE</span>
          <span className="text-[10px] text-[#a3b899] font-medium uppercase tracking-widest leading-none mt-1">Lead Engine & CRM</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="p-1.5 rounded hover:bg-[#1a3f32] text-[#a3b899] hover:text-white transition-colors"
            title="Sign Out"
            aria-label="Sign Out"
          >
            <LogOut className="h-4 w-4" />
          </button>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1 rounded hover:bg-[#1a3f32] focus:outline-none transition-colors"
            aria-label="Toggle navigation"
          >
            {sidebarOpen ? <X className="h-6 w-6 text-white" /> : <Menu className="h-6 w-6 text-white" />}
          </button>
        </div>
      </header>

      {/* Backdrop for mobile sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity duration-200"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 transform md:relative md:translate-x-0 transition-transform duration-200 ease-in-out md:flex flex-shrink-0 h-full",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Desktop Top Navigation Bar with Sign-Out */}
        <header className="hidden md:flex items-center justify-between px-8 py-3.5 bg-white border-b border-[#e4dfd3] shadow-sm z-10 flex-shrink-0">
          <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-semibold text-gray-700">Secure Internal Portal</span>
            <span className="text-gray-300">|</span>
            <span>California SB 9 &amp; AB 1033 Lead Engine</span>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-xs">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#16352a]/10 text-[#16352a] font-bold">
                <ShieldCheck className="h-3.5 w-3.5 text-[#16352a]" />
                <span>{session?.user?.email || "admin@theadustore.com"}</span>
              </span>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-gray-600 hover:text-red-700 hover:bg-red-50 border border-gray-200 rounded-lg transition-all shadow-sm"
              title="Sign Out of CRM"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto px-4 md:px-8 py-6 md:py-8 relative">
          {children}
        </main>
      </div>
    </div>
  );
}
