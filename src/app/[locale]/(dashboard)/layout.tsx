'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';

import clsx from 'clsx';

import Footer from '@/components/footer';
import Menu from '@/components/menu/menu';
import ToastNotification from '@/components/toast-notification';
import { useNotificationStore } from '@/stores/notification-store';
import useUserStore from '@/stores/user';

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const { user } = useUserStore((state) => ({
    user: state.user,
  }));

  const { notifications, addNotifications } = useNotificationStore();
  console.log('notifications', notifications); // debug delete notifications

  useEffect(() => {
    const fetchUnreadNotifications = async () => {
      try {
        const response = await fetch('/api/notifications/unread', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: user?.id,
          }),
        });

        const result = await response.json();
        if (response.ok && result.unreadNotifications.length > 0) {
          addNotifications(result.unreadNotifications);
        }
      } catch (error) {
        console.error('Error fetching unread notifications:', error);
      }
    };

    if (user?.id) {
      const interval = setInterval(() => {
        fetchUnreadNotifications();
      }, 7000); // Check every 7 seconds

      return () => clearInterval(interval); // Clean up the interval on component unmount
    }
  }, [user?.id]);

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
        {/*<ToastNotification />*/}
      </div>
    </div>
  );
};

export default DashboardLayout;
