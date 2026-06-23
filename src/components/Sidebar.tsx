'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  Columns, 
  Mail, 
  Sliders, 
  Briefcase, 
  Settings as SettingsIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Sidebar() {
  const pathname = usePathname();

  const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Leads', href: '/leads', icon: Users },
    { name: 'Pipeline', href: '/pipeline', icon: Columns },
    { name: 'Daily Email', href: '/daily-email', icon: Mail },
    { name: 'Sequences', href: '/sequences', icon: Sliders },
    { name: 'Affiliates & Contractors', href: '/partners', icon: Briefcase },
    { name: 'Settings', href: '/settings', icon: SettingsIcon },
  ];

  return (
    <aside className="w-64 bg-[#16352a] text-white flex flex-col h-full border-r border-[#0f241d] shadow-lg">
      {/* Brand Logo Header */}
      <div className="px-6 py-6 border-b border-[#1f483a] flex flex-col">
        <span className="text-xl font-bold tracking-wider font-display text-white">THE ADU STORE</span>
        <span className="text-xs text-[#a3b899] font-medium mt-1 uppercase tracking-widest">Lead Engine & CRM</span>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center px-4 py-3 rounded text-sm font-medium transition-all duration-150 group",
                isActive 
                  ? "bg-[#27537d] text-white font-semibold shadow" 
                  : "text-[#a3b899] hover:text-white hover:bg-[#1a3f32]"
              )}
            >
              <Icon 
                className={cn(
                  "mr-3 h-5 w-5 flex-shrink-0 transition-colors",
                  isActive ? "text-white" : "text-[#a3b899] group-hover:text-white"
                )} 
              />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Session status at bottom */}
      <div className="p-4 border-t border-[#1f483a] bg-[#0f241d]">
        <div className="px-2 flex flex-col">
          <span className="text-xs text-[#a3b899] uppercase tracking-wider font-medium">Status</span>
          <span className="text-sm font-semibold text-white truncate">Administrator Mode</span>
        </div>
      </div>
    </aside>
  );
}
