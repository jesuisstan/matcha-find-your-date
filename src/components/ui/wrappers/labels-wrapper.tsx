import { useTranslations } from 'next-intl';

import clsx from 'clsx';

import { capitalize } from '@/utils/format-string';

export const DateSkeleton = () => {
  return <div className="mt-1 h-3 w-36 animate-pulse rounded-full bg-muted" />;
};

type LabelsWrapperProps = {
  nickname: string;
  age: Number;
  sex: string;
  lastConnection: string;
  loading: boolean;
};

const LabelsWrapper = ({ nickname, age, sex, lastConnection, loading }: LabelsWrapperProps) => {
  const t = useTranslations();

  return (
    <div
      className={clsx(
        'min-w grid max-h-28 grid-flow-col grid-rows-2 gap-x-4 rounded-2xl bg-card p-4 pb-2 pt-2'
      )}
    >
      <div className="w-max">
        <p className="text-base font-bold">{t('nickname')}</p>
        <p className="flex-wrap text-sm">{nickname}</p>
      </div>

      <div className="min-w-36">
        <p className="text-base font-bold">{t('last-action')}</p>
        {loading || !lastConnection || lastConnection === 'Invalid Date' ? (
          <DateSkeleton />
        ) : (
          <p className="line-clamp-1 h-[max-content] text-ellipsis text-sm" title={lastConnection}>
            {lastConnection}
          </p>
        )}
      </div>

      <div className="w-max">
        <p className="text-base font-bold">{capitalize(t('age'))}</p>
        <p className="text-sm">{String(age)}</p>
      </div>

      <div className="min-w-36">
        <p className="text-base font-bold">{capitalize(t('sex'))}</p>
        {/* Render history with line breaks */}
        <p className="line-clamp-1 h-[max-content] text-ellipsis text-sm" title={sex}>
          {capitalize(sex)}
        </p>
      </div>
    </div>
  );
};

export default LabelsWrapper;
