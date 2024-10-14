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
  fetchAllChatsUpdates: (userId: string) => Promise<void>;
  fetchChatHistory: (userId: string, partnerId: string) => Promise<void>;
  selectChatPartner: (userId: string, partner: TChatPartner) => void;
  sendMessage: (userId: string, recipientId: string, message: string) => Promise<void>;
  initiateChatIfNotExists: (userId: string, partnerId: string) => Promise<void>;
  triggerFetchChatHistoryOnUnread: (userId: string) => Promise<void>;
}

export const useChatStore = create<ChatStore>((set, get) => ({
  chatList: [],
  selectedChatPartner: null,
  messages: [],
  unreadCount: null,

  // Fetch all chat information (chat list and total unread messages)
  fetchAllChatsUpdates: async (userId) => {
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
        set({ chatList: result.chatList, unreadCount: result.unreadCount });
      }
    } catch (error) {
      console.error('Failed to fetch chat information:', error);
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

  // Select a chat partner and load their chat history
  selectChatPartner: async (userId, partner) => {
    set({ selectedChatPartner: partner });
    await get().fetchChatHistory(userId, partner.chat_partner);
  },

  // Send a new message
  sendMessage: async (userId, recipientId, message) => {
    const trimmedMessage = message.trim();
    if (trimmedMessage.length === 0) {
      return;
    }

    try {
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

      if (response.ok) {
        await get().fetchChatHistory(userId, recipientId);
      } else {
        const errorData = await response.json();
        throw new Error(errorData?.error);
      }
    } catch (error: any) {
      throw error;
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

  triggerFetchChatHistoryOnUnread: async (userId) => {
    const { selectedChatPartner, chatList, fetchChatHistory } = get();
    if (selectedChatPartner) {
      const chatPartnerWithUnread = chatList.find(
        (chat) => chat.chat_partner === selectedChatPartner.chat_partner && chat.unread_count > 0
      );
      if (chatPartnerWithUnread) {
        await fetchChatHistory(userId, selectedChatPartner.chat_partner);
      }
    }
  },
}));
