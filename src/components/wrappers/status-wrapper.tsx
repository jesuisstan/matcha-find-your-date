import { useTranslations } from 'next-intl';

import clsx from 'clsx';

import DateSkeleton from '@/components/ui/skeletons/date-skeleton';
import { formatApiDateLastUpdate } from '@/utils/format-date';

const StatusWrapper = ({
  onlineStatus,
  lastAction,
}: {
  onlineStatus: boolean | undefined;
  lastAction: string | undefined;
}) => {
  const t = useTranslations();
  const formatedLastActionDate = formatApiDateLastUpdate(lastAction);

  return (
    <div
      className={clsx(
        'relative grid max-h-28 min-w-52 grid-flow-col grid-rows-1 overflow-hidden rounded-2xl bg-card p-4 pb-2 pt-2 smooth42transition',
        'lg:max-w-fit lg:grid-rows-2'
      )}
    >
      <div className="min-w-36">
        <p className="text-base font-bold">{t('last-action')}</p>
        {!lastAction || formatedLastActionDate === t('invalid-date') ? (
          <DateSkeleton />
        ) : (
          <p
            className="line-clamp-1 h-[max-content] text-ellipsis text-sm"
            title={formatedLastActionDate}
          >
            {formatedLastActionDate}
          </p>
        )}
      </div>

      <div className="w-max">
        <p className="text-base font-bold">{t('status')}</p>
        <p
          className={clsx(
            'line-clamp-1 h-[max-content] text-ellipsis text-sm',
            onlineStatus ? 'animate-pulse text-c42green' : 'text-negative'
          )}
          title={onlineStatus ? t('online') : t('offline')}
        >
          {onlineStatus ? t('online') : t('offline')}
        </p>
      </div>
    </div>
  );
};

export default StatusWrapper;
