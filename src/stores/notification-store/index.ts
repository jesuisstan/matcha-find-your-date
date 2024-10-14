import { create } from 'zustand';

export type TNotification = {
  id: string;
  type: string;
  from_user_id: string;
  notification_time: string;
  viewed: boolean;
  firstname: string;
  lastname: string;
  nickname: string;
  liker_rating: number | null;
  liked_user_rating: number | null;
};

interface NotificationStore {
  notifications: TNotification[] | null;
  unreadCount: number | null;
  addNotifications: (newNotifications: TNotification[]) => void;
  markAsRead: (id: string) => void;
  setUnreadCount: (count: number) => void;
}

export const useNotificationStore = create<NotificationStore>((set, get) => ({
  notifications: null, // Set notifications to null initially
  unreadCount: null, // Set unread count to null initially

  // Add new notifications, sort them by notification_time (most recent first)
  addNotifications: (newNotifications) => {
    set((state) => {
      // If notifications are null, initialize with the new notifications
      const currentNotifications = state.notifications || [];

      // Filter only unique notifications
      const uniqueNotifications = newNotifications.filter(
        (newNotif) =>
          !currentNotifications.some((existingNotif) => existingNotif.id === newNotif.id)
      );

      // Combine and sort notifications by notification_time (newest first)
      const sortedNotifications = [...uniqueNotifications, ...currentNotifications].sort(
        (a, b) => new Date(b.notification_time).getTime() - new Date(a.notification_time).getTime()
      );

      // Update unread notifications count
      const newUnreadCount = sortedNotifications.filter((notif) => !notif.viewed).length;

      return {
        notifications: sortedNotifications,
        unreadCount: newUnreadCount,
      };
    });
  },

  // Mark a notification as read and update it in the backend
  markAsRead: async (id: string) => {
    set((state) => {
      // Handle case where notifications might still be null
      const currentNotifications = state.notifications || [];

      const updatedNotifications = currentNotifications.map((n) =>
        n.id === id ? { ...n, viewed: true } : n
      );

      // Recalculate unread notifications count
      const newUnreadCount = updatedNotifications.filter((notif) => !notif.viewed).length;

      return {
        notifications: updatedNotifications,
        unreadCount: newUnreadCount,
      };
    });

    // Update the notification in the backend
    try {
      const response = await fetch('/api/notifications/mark-read', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ notificationId: id }),
      });

      if (!response.ok) {
        throw new Error('Failed to mark notification as read');
      }
    } catch (error) {
      console.error('Error marking notification as read in the backend:', error);
    }
  },

  // Set unread count manually
  setUnreadCount: (count) => set({ unreadCount: count }),
}));
