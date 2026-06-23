import React from 'react';
import Sidebar from '@/components/Sidebar';


export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <div className="flex h-screen overflow-hidden bg-[#f6f4ee] font-sans">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto px-8 py-8 relative">
        {children}
      </main>
    </div>
  );
}
