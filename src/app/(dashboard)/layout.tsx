'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-[#f6f4ee] font-sans flex-col md:flex-row">
      {/* Mobile Top Header */}
      <header className="flex md:hidden items-center justify-between px-6 py-4 bg-[#16352a] text-white border-b border-[#0f241d] shadow-md z-40">
        <div className="flex flex-col">
          <span className="text-lg font-bold tracking-wider font-display">THE ADU STORE</span>
          <span className="text-[10px] text-[#a3b899] font-medium uppercase tracking-widest leading-none mt-1">Lead Engine & CRM</span>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-1 rounded hover:bg-[#1a3f32] focus:outline-none transition-colors"
          aria-label="Toggle navigation"
        >
          {sidebarOpen ? <X className="h-6 w-6 text-white" /> : <Menu className="h-6 w-6 text-white" />}
        </button>
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
      <main className="flex-1 overflow-y-auto px-4 md:px-8 py-6 md:py-8 relative">
        {children}
      </main>
    </div>
  );
}
