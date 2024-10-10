import clsx from 'clsx';

interface NotificationsCounterWrapperProps {
  unreadCount: number | null;
}

const NotificationsCounterWrapper = ({ unreadCount }: NotificationsCounterWrapperProps) => {
  return (
    <div
      className={clsx(
        'relative flex h-6 w-auto min-w-6 items-center justify-center rounded-full bg-foreground p-1 text-sm text-background smooth42transition',
        unreadCount === null ? 'animate-pulse' : '',
        unreadCount && unreadCount > 0 ? 'animate-bounce' : ''
      )}
    >
      {unreadCount === null ? '?' : unreadCount}
    </div>
  );
};

export default NotificationsCounterWrapper;
