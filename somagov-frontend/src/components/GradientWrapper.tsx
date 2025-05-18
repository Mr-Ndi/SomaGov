'use client';

import { usePathname } from 'next/navigation';
import React from 'react';

export default function GradientWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  return (
    <div className={isHomePage ? '' : 'bg-gradient-to-b from-blue-50 to-white min-h-screen flex-1'}>
      {children}
    </div>
  );
} 