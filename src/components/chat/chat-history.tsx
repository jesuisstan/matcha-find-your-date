import React, { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

import clsx from 'clsx';
import { SendHorizontal } from 'lucide-react';

import { ButtonMatcha } from '@/components/ui/button-matcha';
import Spinner from '@/components/ui/spinner';
import { TChatPartner, useChatStore } from '@/stores/chat-store';
import useUserStore from '@/stores/user';
import { formatApiDateLastUpdate } from '@/utils/format-date';

type Props = {
  chatPartner: TChatPartner;
  loading: boolean;
};

const ChatHistory: React.FC<Props> = ({ chatPartner, loading }) => {
  const t = useTranslations();
  const { user } = useUserStore((state) => ({ user: state.user }));
  const { unreadCount, messages, sendMessage, triggerFetchChatHistoryOnUnread } = useChatStore(
    (state) => ({
      unreadCount: state.unreadCount,
      messages: state.messages,
      sendMessage: state.sendMessage,
      triggerFetchChatHistoryOnUnread: state.triggerFetchChatHistoryOnUnread,
    })
  );
  const [loadingSendMessage, setLoadingSendMessage] = useState(false);
  const [error, setError] = useState<string>('');
  const [newMessage, setNewMessage] = useState<string>('');

  const handleSendMessage = async () => {
    setError('');
    setLoadingSendMessage(true);
    // Trim the message to remove trailing spaces
    const trimmedMessage = newMessage.trim();

    // If the trimmed message is not empty, send it
    if (trimmedMessage) {
      try {
        await sendMessage(user?.id!, chatPartner.chat_partner, trimmedMessage);
        setNewMessage(''); // Clear the input field after sending the message
      } catch (error: any) {
        setError(error.message ? t(error.message) : t('failed-to-send-message'));
      } finally {
        setLoadingSendMessage(false);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  useEffect(() => {
    // Scroll to the bottom of the chat when new messages arrive
    const chatContainer = document.getElementById('chat-container');
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (user?.id) {
      triggerFetchChatHistoryOnUnread(user.id);
    }
  }, [user?.id, unreadCount]);

  return (
    <div className="relative flex h-full w-full flex-col">
      {/* Messages */}
      <div
        id="chat-container"
        className={clsx(
          'flex-grow overflow-y-auto p-4 smooth42transition',
          'flex flex-col items-end'
        )}
      >
        {loading ? (
          <div className="flex h-full flex-col items-center justify-center gap-2 self-center align-middle">
            <Spinner size={7} />
            <p className="animate-pulse">{t('loading')}</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <p>{t('no-messages')}</p>
          </div>
        ) : (
          <div className={clsx('w-full space-y-6 smooth42transition', 'lg:px-10')}>
            {messages.map(
              (msg) =>
                msg.message.trim().length > 0 ? ( // Only render if the message is not empty
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
                      {msg.sender_id === chatPartner.chat_partner
                        ? chatPartner.nickname + ':'
                        : t('you') + ':'}
                    </p>
                    <div
                      id="message-cloud"
                      className={clsx(
                        'w-fit min-w-32 max-w-52 space-y-1 text-wrap break-words rounded-2xl bg-card p-4 text-sm shadow-md smooth42transition',
                        msg.sender_id === chatPartner.chat_partner ? 'bg-accent' : 'bg-card',
                        'sm:max-w-72',
                        'md:max-w-96',
                        'lg:max-w-[500px]'
                      )}
                    >
                      <p>{msg.message}</p>
                    </div>
                    <p className="mt-1 w-fit rounded-2xl text-[10px] italic">
                      {formatApiDateLastUpdate(msg.created_at)}
                    </p>
                  </div>
                ) : null // Do not render anything for empty messages
            )}
          </div>
        )}
      </div>

      {/* Message input */}
      <div className="flex flex-none flex-col border-t p-4">
        <div className="flex items-center gap-4">
          <input
            id="message-input"
            type="text"
            value={newMessage}
            onChange={(e) => {
              setError('');
              setNewMessage(e.target.value);
            }}
            onKeyDown={handleKeyDown} // Trigger message send on Enter key
            placeholder={t('type-message')}
            className="flex-grow rounded-full border p-3 focus:outline-none"
          />
          <ButtonMatcha
            size="icon"
            variant="default"
            title={t('send')}
            onClick={handleSendMessage}
            loading={loadingSendMessage}
            disabled={
              loadingSendMessage || newMessage.trim().length < 1 || newMessage.trim().length > 442
            }
            className="min-w-9"
          >
            <SendHorizontal size={21} />
          </ButtonMatcha>
        </div>
        {!error && (
          <p
            className={clsx(
              'ml-5 mt-1 text-xs',
              newMessage.length > 442 ? 'text-negative' : 'text-secondary'
            )}
          >
            {t('max-442-characters')}
          </p>
        )}
        {error && <p className="ml-5 mt-1 text-xs text-negative">{error}</p>}
      </div>
    </div>
  );
};

export default ChatHistory;
