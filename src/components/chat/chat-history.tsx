import React, { useEffect } from 'react';
import { useTranslations } from 'next-intl';

import clsx from 'clsx';

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
    <div
      id="chat-container"
      className={clsx('h-full w-full overflow-y-auto p-4 smooth42transition', 'md:w-5/6')}
    >
      {loading ? (
        <div className="flex flex-col items-center justify-center gap-2 self-center align-middle">
          <Spinner size={7} />
          <p className="animate-pulse">{t('loading')}</p>
        </div>
      ) : messages.length === 0 ? (
        <p>{t('no-messages')}</p>
      ) : (
        <div className="space-y-6">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={clsx(
                'mb-2 flex flex-col gap-0',
                msg.sender_id === chatPartner.chat_partner
                  ? 'items-start text-left'
                  : 'items-end text-right'
              )}
            >
              <p className="font-bold">
                {msg.sender_id === chatPartner.chat_partner ? chatPartner.nickname : t('you')}
              </p>
              <div
                id="message-cloud"
                className={clsx(
                  'w-fit max-w-52 text-wrap break-words rounded-2xl bg-card p-4 smooth42transition',
                  msg.sender_id === chatPartner.chat_partner ? 'bg-accent' : 'bg-card',
                  'sm:max-w-72',
                  'md:max-w-96',
                  'lg:max-w-[500px]'
                )}
              >
                <p>{msg.message}</p>
                <p className="text-xs italic">{formatApiDateLastUpdate(msg.created_at)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChatHistory;
