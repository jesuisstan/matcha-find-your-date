import { create } from 'zustand';

interface Notification {
  id: string;
  type: string;
  from_user_id: string;
  notification_time: string;
  viewed: boolean;
  firstname: string;
  lastname: string;
  nickname: string;
}

interface NotificationStore {
  notifications: Notification[];
  unreadCount: number;
  addNotifications: (newNotifications: Notification[]) => void;
  markAsRead: (id: string) => void;
  setUnreadCount: (count: number) => void;
}

export const useNotificationStore = create<NotificationStore>((set, get) => ({
  notifications: [],
  unreadCount: 0,

  // Add new notifications, prepending them to the list
  addNotifications: (newNotifications) => {
    set((state) => {
      // Filter only unique notifications
      const uniqueNotifications = newNotifications.filter(
        (newNotif) => !state.notifications.some((existingNotif) => existingNotif.id === newNotif.id)
      );

      // Update unread notifications count
      const newUnreadCount = uniqueNotifications.filter((notif) => !notif.viewed).length;

      // Prepend new notifications to the top of the list
      return {
        notifications: [...uniqueNotifications, ...state.notifications],
        unreadCount: state.unreadCount + newUnreadCount,
      };
    });
  },

  // Mark a notification as read and update it in the backend
  markAsRead: async (id: string) => {
    set((state) => {
      const updatedNotifications = state.notifications.map((n) =>
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
