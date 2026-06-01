import React from 'react';
import { Sidebar } from '@/components/Sidebar';
import { BackgroundAnimations } from '@/components/BackgroundAnimations';

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen flex bg-[#0B1020] text-white relative overflow-hidden isolate">

      {/* Background Effects */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <BackgroundAnimations />
      </div>

      {/* Sidebar */}
      <div className="min-h-screen z-20">
        <Sidebar />
      </div>

      {/* Main Content */}
      <main className="flex-1 relative z-10 overflow-y-auto bg-transparent">
        {children}
      </main>

    </div>
  );
}