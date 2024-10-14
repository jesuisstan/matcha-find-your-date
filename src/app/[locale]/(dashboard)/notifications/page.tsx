'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

import clsx from 'clsx';
import { Frown, Meh } from 'lucide-react';

import ModalProfileWarning from '@/components/modals/modal-profile-warning';
import NotificationCardSkeleton from '@/components/ui/skeletons/notification-card-skeleton';
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

    if (user?.id && user?.complete) {
      fetchNotifications();
    }
  }, [user?.id, user?.complete]);

  return (
    <div className="relative flex h-[92vh] flex-col">
      {user && <ModalProfileWarning user={user} />}
      {/* Fixed Header */}
      <div id="user-nickname" className="mb-2 flex w-fit flex-wrap gap-x-2 smooth42transition">
        <h1 className="max-w-96 truncate p-2 text-4xl font-bold xs:max-w-fit">
          {t('notifications')}
        </h1>
      </div>

      {(!notifications || notifications?.length < 1) && !loading ? (
        <div className="w-full min-w-28 flex-col items-center justify-center overflow-hidden text-ellipsis rounded-2xl bg-card p-4">
          <div className="m-5 flex items-center justify-center smooth42transition hover:scale-150">
            {error ? <Frown size={84} /> : <Meh size={84} />}
          </div>
          <p className="text-center text-lg">{error ? t(`${error}`) : t(`no-notifications`)}</p>
        </div>
      ) : (
        <div className="flex-grow space-y-2 overflow-y-auto">
          {/* Loading Skeletons */}
          {loading && (
            <div className="flex flex-col space-y-2">
              <NotificationCardSkeleton />
              <NotificationCardSkeleton />
              <NotificationCardSkeleton />
            </div>
          )}
          {/* Scrollable Notification List */}
          {notifications?.map((notification) => (
            <div
              key={notification.id}
              className={clsx(
                `card h-28 overflow-y-auto rounded-2xl bg-card p-4 text-sm shadow-md`,
                notification.viewed ? 'opacity-50' : ''
              )}
              onMouseEnter={() => {
                if (!notification.viewed) markAsRead(notification.id);
              }}
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
                  className={clsx(
                    'hover:underline',
                    notification.type === 'block' ? 'text-negative' : 'text-positive'
                  )}
                >
                  {`"${notification.nickname}" ${notification.firstname} ${notification.lastname}`}
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;
