import { create } from 'zustand';

interface Notification {
  id: string;
  type: string;
  from_user_id: string;
  notification_time: string;
  viewed: boolean;
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

  // Function to add new notifications
  addNotifications: (newNotifications) => {
    set((state) => {
      // Filter only unique notifications
      const uniqueNotifications = newNotifications.filter(
        (newNotif) => !state.notifications.some((existingNotif) => existingNotif.id === newNotif.id)
      );

      // Update unread notifications count
      const newUnreadCount = uniqueNotifications.filter((notif) => !notif.viewed).length;

      return {
        notifications: [...state.notifications, ...uniqueNotifications],
        unreadCount: state.unreadCount + newUnreadCount,
      };
    });
  },

  // Function to mark a notification as read
  markAsRead: (id) => {
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
  },

  // Set the unread notifications count manually
  setUnreadCount: (count) => set({ unreadCount: count }),
}));
