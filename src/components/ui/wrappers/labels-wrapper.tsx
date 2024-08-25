import { useTranslations } from 'next-intl';

import clsx from 'clsx';
import { SquarePen } from 'lucide-react';

import FilledOrNot from '@/components/ui/filled-or-not';
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
  modifiable?: boolean;
  onModify?: () => void;
};

const LabelsWrapper = ({
  nickname,
  age,
  sex,
  lastConnection,
  loading,
  modifiable,
  onModify,
}: LabelsWrapperProps) => {
  const t = useTranslations();

  return (
    <div
      className={clsx(
        'min-w relative grid max-h-28 grid-flow-col grid-rows-2 gap-x-4 rounded-2xl bg-card p-4 pb-2 pt-2'
      )}
    >
      <div className="w-max">
        <p className="text-base font-bold">{t('nickname')}</p>
        <p className="flex-wrap text-sm">{nickname}</p>
      </div>

      <div className="w-max">
        <p className="text-base font-bold">{capitalize(t('age'))}</p>
        <p className="text-sm">{String(age)}</p>
      </div>

      <div className="w-max">
        <p className="text-base font-bold">{capitalize(t('sex'))}</p>
        {/* Render history with line breaks */}
        <p className="line-clamp-1 h-[max-content] text-ellipsis text-sm" title={sex}>
          {capitalize(t(sex))}
        </p>
      </div>

      <div className="min-w-36">
        <p className="text-base font-bold">{t('last-action')}</p>
        {loading || !lastConnection || lastConnection === t('invalid-date') ? (
          <DateSkeleton />
        ) : (
          <p className="line-clamp-1 h-[max-content] text-ellipsis text-sm" title={lastConnection}>
            {lastConnection}
          </p>
        )}
      </div>

      {modifiable && (
        <div className={'absolute right-1 top-1 flex gap-1'}>
          <FilledOrNot size={18} filled={!!nickname || !!age || !!sex} />
          <div className={'text-foreground opacity-60 smooth42transition hover:opacity-100'}>
            <SquarePen size={18} onClick={onModify} />
          </div>
        </div>
      )}
    </div>
  );
};

export default LabelsWrapper;
