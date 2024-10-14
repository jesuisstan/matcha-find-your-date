'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

import ChatHistory from '@/components/chat/chat-history';
import ChatPartnerWrapper from '@/components/chat/chat-partner-card';
import ModalProfileWarning from '@/components/modals/modal-profile-warning';
import ChatCardSkeleton from '@/components/ui/skeletons/chart-card-skeleton';
import { TChatPartner, useChatStore } from '@/stores/chat-store';
import useUserStore from '@/stores/user';

const MessagesPage = () => {
  const t = useTranslations();
  const { user } = useUserStore((state) => ({ user: state.user }));
  const {
    chatList,
    fetchAllChatsUpdates,
    selectedChatPartner,
    selectChatPartner,
    fetchChatHistory,
  } = useChatStore();
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const [error, setError] = useState('');

  // Fetch the list of chat partners on mount
  useEffect(() => {
    const fetchChats = async () => {
      setLoading(true);
      try {
        await fetchAllChatsUpdates(user?.id!);
      } catch (error) {
        setError('failed-to-retrieve-all-chats-updates');
      } finally {
        setLoading(false);
      }
    };

    if (user?.id && user?.complete) {
      fetchChats();
    }
  }, []);

  // Fetch chat history for the selected chat partner
  const handleChatSelection = async (chatPartner: TChatPartner) => {
    // Select the chat partner
    selectChatPartner(user?.id!, chatPartner);

    // Fetch the chat history only if chatPartner is valid
    if (chatPartner && user?.id) {
      setLoadingChat(true);
      try {
        await fetchChatHistory(user.id, chatPartner.chat_partner);
      } catch (error) {
        setError('failed-to-retrieve-chat-history');
      } finally {
        setLoadingChat(false);
      }
    }
  };

  return (
    <div className="relative flex h-[92vh]">
      {user && <ModalProfileWarning user={user} />}
      {/* Left Section: Chat Partner List */}
      <div className="relative w-1/3 border-r">
        {/* Fixed header */}
        <div
          id="chats-header"
          className="sticky top-0 z-10 bg-transparent pb-4 pr-4 text-xl font-bold"
        >
          {t('chats')}
        </div>

        {/* Scrollable chat list */}
        <div className="h-[calc(100%-4rem)] overflow-y-auto pr-4">
          {loading && (
            <div className="pb-2">
              <ChatCardSkeleton />
            </div>
          )}

          {chatList.length === 0 && !loading ? (
            <div className="p-4 text-center">
              <p>{t('no-chats')}</p>
            </div>
          ) : (
            <div className="flex flex-col gap-2 smooth42transition">
              {error ? (
                <div className="p-4 text-center text-negative">
                  <p>{t(error)}</p>
                </div>
              ) : (
                chatList.map((chatPartner: TChatPartner) => (
                  <ChatPartnerWrapper
                    key={chatPartner.chat_partner}
                    partner={chatPartner}
                    isSelected={selectedChatPartner?.chat_partner === chatPartner.chat_partner}
                    onClick={() => handleChatSelection(chatPartner)}
                  />
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* Right Section: Chat History */}
      <div className="relative flex w-2/3 items-center justify-center">
        {selectedChatPartner ? (
          <ChatHistory chatPartner={selectedChatPartner} loading={loadingChat} />
        ) : (
          <div className="text-center">
            <p>{t('select-a-chat')}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagesPage;
