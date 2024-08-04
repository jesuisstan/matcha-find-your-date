'use client';

import React from 'react';

import clsx from 'clsx';

import Footer from '@/components/ui/footer';
import Menu from '@/components/ui/menu/menu';

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className={clsx('relative flex h-screen w-full flex-col lg:flex-row')}>
      <Menu />
      <div className="flex h-screen w-full flex-col items-center justify-between">
        <main id="main-content" className={clsx('mb-auto w-full max-w-[1700px] items-center p-4')}>
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default DashboardLayout;