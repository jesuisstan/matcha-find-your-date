'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';

import clsx from 'clsx';

import Footer from '@/components/footer';
import Menu from '@/components/menu/menu';
import { useChatStore } from '@/stores/chat-store';
import { TNotification, useNotificationStore } from '@/stores/notification-store';
import useUserStore from '@/stores/user';

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const { user, updateUserRating } = useUserStore();
  const { notifications, addNotifications } = useNotificationStore();
  const { fetchAllChatsUpdates } = useChatStore();

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

            // Find the most recent "like" or "unlike" notification
            const recentLikeNotification = result.unreadNotifications.find(
              (notif: TNotification) => notif.type === 'like' || notif.type === 'unlike'
            );

            // If a recent "like" or "unlike" notification is found, update the user rating
            if (recentLikeNotification && user) {
              updateUserRating(recentLikeNotification.liked_user_rating);
            }
          } else if (notifications === null) {
            addNotifications([]);
          }
        }
      } catch (error) {
        console.error('Error fetching unread notifications:', error);
      }
    };

    const fetchUnreadMessages = async () => {
      try {
        if (user?.id) {
          await fetchAllChatsUpdates(user.id);
        }
      } catch (error) {
        console.error('Error fetching unread messages:', error);
      }
    };

    if (user?.id && user?.complete) {
      const interval = setInterval(() => {
        fetchUnreadNotifications();
        fetchUnreadMessages();
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [user?.id, user?.complete]);

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
