import { create } from 'zustand';

export type TChatPartner = {
  chat_partner: string;
  firstname: string;
  lastname: string;
  nickname: string;
  unread_count: number;
};

export type TMessage = {
  id: string;
  sender_id: string;
  recipient_id: string;
  message: string;
  created_at: string;
  seen: boolean;
};

interface ChatStore {
  chatList: TChatPartner[];
  selectedChatPartner: TChatPartner | null;
  messages: TMessage[];
  unreadCount: number | null;
  fetchChatList: (userId: string) => Promise<void>;
  fetchChatHistory: (partnerId: string) => Promise<void>;
  fetchUnreadCount: (userId: string) => Promise<void>;
  selectChatPartner: (partner: TChatPartner) => void;
}

export const useChatStore = create<ChatStore>((set, get) => ({
  chatList: [],
  selectedChatPartner: null,
  messages: [],
  unreadCount: null,

  // Fetch the chat list (users the logged-in user has chatted with)
  fetchChatList: async (userId) => {
    try {
      const response = await fetch('/api/chat/list', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });
      const result = await response.json();
      if (response.ok) {
        set({ chatList: result.chatList });
      }
    } catch (error) {
      console.error('Failed to fetch chat list:', error);
    }
  },

  // Fetch the chat history for a specific partner
  fetchChatHistory: async (partnerId) => {
    try {
      const response = await fetch('/api/chat/history', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ partnerId }),
      });
      const result = await response.json();
      if (response.ok) {
        set({ messages: result.messages });
      }
    } catch (error) {
      console.error('Failed to fetch chat history:', error);
    }
  },

  // Fetch unread message count
  fetchUnreadCount: async (userId) => {
    try {
      const response = await fetch('/api/chat/unread', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });
      const result = await response.json();
      if (response.ok) {
        set({ unreadCount: result.unreadCount });
      }
    } catch (error) {
      console.error('Failed to fetch unread message count:', error);
    }
  },

  // Select a chat partner and load their chat history
  selectChatPartner: (partner) => {
    set({ selectedChatPartner: partner });
    get().fetchChatHistory(partner.chat_partner);
  },
}));
