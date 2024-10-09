'use client';

import { useEffect, useState } from 'react';

import { useNotificationStore } from '@/stores/notification-store';
import useUserStore from '@/stores/user';

const NotificationsPage = () => {
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
    <div>
      <h1>Your Notifications</h1>
      <div>
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`card ${notification.viewed ? 'opacity-50' : ''} cursor-pointer rounded-lg p-4 shadow`}
            //onMouseEnter={() => markAsRead(notification.id)}
            onClick={() => markAsRead(notification.id)}
          >
            <p>{`Type: ${notification.type}`}</p>
            <p>{`From user: ${notification.from_user_id}`}</p>
            <p>{`Time: ${new Date(notification.notification_time).toLocaleString()}`}</p>
            <p>{notification.viewed ? 'Read' : 'Unread'}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationsPage;
