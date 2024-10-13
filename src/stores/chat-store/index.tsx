import { create } from 'zustand';

export type TChatPartner = {
  chat_partner: string;
  firstname: string;
  lastname: string;
  nickname: string;
  online: boolean;
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
  fetchChatHistory: (userId: string, partnerId: string) => Promise<void>;
  fetchUnreadCount: (userId: string) => Promise<void>;
  selectChatPartner: (userId: string, partner: TChatPartner) => void;
  sendMessage: (userId: string, recipientId: string, message: string) => Promise<void>;
  initiateChatIfNotExists: (userId: string, partnerId: string) => Promise<void>;
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

  // Fetch the chat history for a specific partner and sort it by date
  fetchChatHistory: async (userId, partnerId) => {
    try {
      const response = await fetch('/api/chat/history', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, chatPartnerId: partnerId }),
      });
      const result = await response.json();
      if (response.ok) {
        // Sort messages by `created_at` field
        const sortedMessages = result.chatHistory.sort(
          (a: TMessage, b: TMessage) =>
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
        set({ messages: sortedMessages });
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
  selectChatPartner: async (userId, partner) => {
    set({ selectedChatPartner: partner });
    await get().fetchChatHistory(userId, partner.chat_partner);
  },

  // Send a new message
  sendMessage: async (userId, recipientId, message) => {
    // Trim the message and check if it's empty
    const trimmedMessage = message.trim();
    if (trimmedMessage.length === 0) {
      return; // Do nothing if the message is empty
    }

    try {
      // Send the message to the API
      const response = await fetch('/api/chat/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          senderId: userId,
          recipientId,
          message: trimmedMessage,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        // After the message is sent, refetch the chat history to update the messages list
        await get().fetchChatHistory(userId, recipientId);
      } else {
        console.error('Failed to send message:', result.error);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  },

  // Initiate chat if it doesn't exist
  initiateChatIfNotExists: async (userId, partnerId) => {
    try {
      const response = await fetch('/api/chat/initiate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, partnerId }),
      });

      if (!response.ok) {
        throw new Error('Failed to initiate chat');
      }
    } catch (error) {
      console.error('Error initiating chat:', error);
    }
  },
}));
