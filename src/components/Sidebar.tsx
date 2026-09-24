'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  Columns, 
  Mail, 
  Send,
  Sliders, 
  Briefcase, 
  Settings as SettingsIcon,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { signOut, useSession } from 'next-auth/react';
import { LogOut } from 'lucide-react';

interface SidebarProps {
  onClose?: () => void;
}

export default function Sidebar({ onClose }: SidebarProps) {
  const pathname = usePathname();

  const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Leads', href: '/leads', icon: Users },
    { name: 'Pipeline', href: '/pipeline', icon: Columns },
    { name: 'Outbound Email CRM', href: '/outreach', icon: Send },
    { name: 'Daily Email', href: '/daily-email', icon: Mail },
    { name: 'Sequences', href: '/sequences', icon: Sliders },
    { name: 'Affiliates & Contractors', href: '/partners', icon: Briefcase },
    { name: 'Settings', href: '/settings', icon: SettingsIcon },
  ];

  return (
    <aside className="w-64 bg-[#16352a] text-white flex flex-col h-full border-r border-[#0f241d] shadow-lg">
      {/* Brand Logo Header */}
      <div className="px-6 py-6 border-b border-[#1f483a] flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-xl font-bold tracking-wider font-display text-white">THE ADU STORE</span>
          <span className="text-xs text-[#a3b899] font-medium mt-1 uppercase tracking-widest">Lead Engine & CRM</span>
        </div>
        {onClose && (
          <button 
            onClick={onClose}
            className="md:hidden p-1 rounded hover:bg-[#1a3f32] text-[#a3b899] hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        )}
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
              onClick={onClose}
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

      {/* User Session status & Sign Out at bottom */}
      <div className="p-4 border-t border-[#1f483a] bg-[#0f241d] flex items-center justify-between">
        <div className="px-2 flex flex-col truncate">
          <span className="text-[10px] text-[#a3b899] uppercase tracking-wider font-medium">Logged In</span>
          <span className="text-xs font-semibold text-white truncate">Administrator</span>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded text-xs font-medium text-[#a3b899] hover:text-white hover:bg-[#1a3f32] border border-[#1f483a] transition-colors"
          title="Sign Out"
        >
          <LogOut className="h-3.5 w-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
