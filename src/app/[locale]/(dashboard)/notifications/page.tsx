'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

import clsx from 'clsx';

import { useNotificationStore } from '@/stores/notification-store';
import useUserStore from '@/stores/user';
import { formatApiDateLastUpdate } from '@/utils/format-date';

const NotificationsPage = () => {
  const t = useTranslations();
  const { notifications, markAsRead, addNotifications } = useNotificationStore();
  const { user } = useUserStore((state) => ({
    user: state.user,
  }));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/notifications/all', {
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
          addNotifications(result.notifications);
        } else {
          setError(result.error ? result.error : 'error-fetching-notifications');
        }
      } catch (error) {
        setError(String(error));
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchNotifications();
    }
  }, [user?.id]);

  return (
    <div className="relative flex h-[92vh] flex-col">
      {/* Fixed Header */}
      <div id="user-nickname" className="mb-2 flex w-fit flex-wrap gap-x-2 smooth42transition">
        <h1 className="max-w-96 truncate p-2 text-4xl font-bold xs:max-w-fit">
          {t('notifications')}
        </h1>
      </div>

      {/* Scrollable Notification List */}
      <div className="flex-grow space-y-2 overflow-y-auto">
        {notifications?.map((notification) => (
          <div
            key={notification.id}
            className={clsx(
              `card rounded-2xl bg-card p-4 text-sm shadow`,
              notification.viewed ? 'opacity-50' : ''
            )}
            //onClick={() => markAsRead(notification.id)}
            onMouseEnter={() => markAsRead(notification.id)}
          >
            <p
              className={clsx(
                'smooth42transition',
                notification.viewed ? 'text-secondary' : 'animate-bounce text-positive'
              )}
            >
              {notification.viewed ? t('viewed') : t('new')}
            </p>

            <div className="flex flex-row space-x-2">
              <p className="italic">{`${t('category')}:`}</p>
              <p
                className={clsx(
                  notification.type === 'block' ? 'text-negative' : '',
                  notification.type === 'like' ? 'text-positive' : '',
                  notification.type === 'unmatch' ? 'text-negative' : '',
                  notification.type === 'match' ? 'text-positive' : '',
                  notification.type === 'match' && !notification.viewed ? 'animate-pulse' : ''
                )}
              >{`${t(notification.type)}`}</p>
            </div>

            <div className="flex flex-row space-x-2">
              <p className="italic">{`${t('time')}:`}</p>
              <p>{`${formatApiDateLastUpdate(notification.notification_time)}`}</p>
            </div>

            <div className="flex flex-row space-x-2">
              <p className="italic">{`${t('from-user')}: `}</p>
              <Link
                href={`/search/${notification.from_user_id}`}
                passHref
                className={clsx(notification.type === 'block' ? 'text-negative' : 'text-positive')}
              >
                {`${notification.firstname} "${notification.nickname}" ${notification.lastname}`}
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationsPage;
