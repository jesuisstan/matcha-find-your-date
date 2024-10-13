import React, { useEffect } from 'react';
import { useTranslations } from 'next-intl';

import Spinner from '../ui/spinner';

import { TChatPartner, useChatStore } from '@/stores/chat-store';
import { formatApiDateLastUpdate } from '@/utils/format-date';

type Props = {
  chatPartner: TChatPartner;
  loading: boolean;
};

const ChatHistory: React.FC<Props> = ({ chatPartner, loading }) => {
  const t = useTranslations();
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
    <div id="chat-container" className="h-full overflow-y-auto p-4">
      {loading ? (
        <div className="flex flex-col items-center justify-center gap-2 self-center align-middle">
          <Spinner size={7} />
          <p className="animate-pulse">{t('loading')}</p>
        </div>
      ) : messages.length === 0 ? (
        <p>{t('no-messages')}</p>
      ) : (
        messages.map((msg) => (
          <div key={msg.id} className="mb-2">
            <p className="font-bold">
              {msg.sender_id === chatPartner.chat_partner ? chatPartner.nickname : 'You'}
            </p>
            <p>{msg.message}</p>
            <small>{formatApiDateLastUpdate(msg.created_at)}</small>
          </div>
        ))
      )}
    </div>
  );
};

export default ChatHistory;
