import React, { useEffect } from 'react';

import { useChatStore } from '@/stores/chat-store';

type Props = {
  chatPartner: any;
};

const ChatHistory: React.FC<Props> = ({ chatPartner }) => {
  const { messages } = useChatStore((state) => ({
    messages: state.messages,
  }));

  useEffect(() => {
    // Scroll to the bottom of the chat when new messages arrive
    const chatContainer = document.getElementById('chat-container');
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }, [messages]);

  return (
    <div id="chat-container" className="overflow-y-auto p-4 h-full">
      {messages.length === 0 ? (
        <p>No messages yet.</p>
      ) : (
        messages.map((msg) => (
          <div key={msg.id} className="mb-2">
            <p className="font-bold">
              {msg.sender_id === chatPartner.chat_partner ? chatPartner.nickname : 'You'}
            </p>
            <p>{msg.message}</p>
            <small>{msg.created_at}</small>
          </div>
        ))
      )}
    </div>
  );
};

export default ChatHistory;
