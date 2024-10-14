import { useTranslations } from 'next-intl';

import clsx from 'clsx';

type TMessagesCounterWrapper = {
  unreadCount: number | null;
};

const MessagesCounterWrapper = ({ unreadCount }: TMessagesCounterWrapper) => {
  const t = useTranslations();

  return (
    <div
      className={clsx(
        'relative flex h-5 w-auto min-w-5 items-center justify-center rounded-full bg-foreground p-1 text-sm text-background smooth42transition',
        unreadCount === null ? 'animate-pulse' : '',
        unreadCount && unreadCount > 0 ? 'animate-bounce' : ''
      )}
      title={t('messages-unread')}
    >
      {unreadCount === null ? '?' : unreadCount}
    </div>
  );
};

export default MessagesCounterWrapper;
