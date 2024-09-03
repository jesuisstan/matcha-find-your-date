'use client';

import React from 'react';
import Image from 'next/image';

import clsx from 'clsx';

import Footer from '@/components/footer';
import Menu from '@/components/menu/menu';

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className={clsx('relative flex min-h-screen w-full flex-col lg:flex-row')}>
      <Image
        src="/identity/background-nobg.png"
        alt="hearts-bg"
        fill
        placeholder="blur"
        blurDataURL="/identity/background-nobg.png"
        className="z-[-5] object-cover opacity-5"
        sizes="100vw"
        priority
      />
      <Menu />
      <div className="flex w-full flex-grow flex-col items-center justify-between">
        <main id="main-content" className={clsx('mb-auto w-full max-w-[1700px] items-center p-4')}>
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default DashboardLayout;
