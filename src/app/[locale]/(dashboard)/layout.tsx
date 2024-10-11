'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';

import clsx from 'clsx';

import Footer from '@/components/footer';
import Menu from '@/components/menu/menu';
import { TNotification, useNotificationStore } from '@/stores/notification-store';
import useUserStore from '@/stores/user';

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const { user, setUser } = useUserStore();
  const { notifications, addNotifications } = useNotificationStore();

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
        if (response.ok) {
          if (result.unreadNotifications.length > 0) {
            addNotifications(result.unreadNotifications);
            console.log('Unread notifications:', result.unreadNotifications); // debug

            // Find the most recent "like" or "unlike" notification
            const recentLikeNotification = result.unreadNotifications.find(
              (notif: TNotification) => notif.type === 'like' || notif.type === 'unlike'
            );

            // If a recent "like" or "unlike" notification is found, update the user rating
            if (recentLikeNotification && user) {
              setUser({
                ...user, // Spread the existing user properties
                rating: recentLikeNotification.liked_user_rating, // Update only the rating field
              });
            }
          } else if (notifications === null) {
            addNotifications([]);
          }
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
        <main
          id="main-content"
          role="main"
          className={clsx('mb-auto w-full max-w-[1700px] items-center p-4')}
        >
          {children}
        </main>
        <Footer />
        {/*<ToastNotification />*/}
      </div>
    </div>
  );
};

export default DashboardLayout;
