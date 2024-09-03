import { useState } from 'react';
import { useTranslations } from 'next-intl';

import clsx from 'clsx';
import { ShieldAlert, ShieldCheck } from 'lucide-react';

import DateSkeleton from '@/components/ui/skeletons/date-skeleton';
import { formatApiDateLastUpdate } from '@/utils/format-date';

const StatusWrapper = ({
  confirmed,
  onlineStatus,
  lastAction,
}: {
  confirmed: boolean | undefined;
  onlineStatus: boolean | undefined;
  lastAction: string | undefined;
}) => {
  const t = useTranslations();
  const formatedLastActionDate = formatApiDateLastUpdate(lastAction);

  return (
    <div className="flex min-h-[104px] min-w-64 items-center justify-center space-x-4 overflow-hidden rounded-2xl bg-card px-4 xs:flex-row">
      <div className="">
        {confirmed ? (
          <div title={t('confirmed')}>
            <ShieldCheck size={42} className="text-c42green" />
          </div>
        ) : (
          <div title={t('not-confirmed')}>
            <ShieldAlert size={42} className="text-negative" />
          </div>
        )}
      </div>

      {/* vertical divider */}
      {/*<div className={clsx('m-5 hidden w-[1px] bg-secondary opacity-40', 'xl:block')} />*/}

      <div className="flex flex-row gap-4 smooth42transition lg:flex-col lg:gap-0">
        <div className="">
          <p className="text-base font-bold">{t('status')}</p>
          <p
            className="line-clamp-1 h-[max-content] text-ellipsis text-sm"
            title={formatedLastActionDate}
          >
            {onlineStatus ? t('online') : t('offline')}
          </p>
        </div>

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
      </div>
    </div>
  );
};

export default StatusWrapper;
