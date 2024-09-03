import { useTranslations } from 'next-intl';

import clsx from 'clsx';
import { PenLine } from 'lucide-react';

import FilledOrNot from '@/components/ui/filled-or-not';
import { DateSkeleton } from '@/components/ui/skeletons/date-skeleton';
import { capitalize } from '@/utils/format-string';

type LabelsWrapperProps = {
  firstName: string;
  lastName: string;
  age: Number;
  sex: string;
  lastConnection: string;
  loading: boolean;
  modifiable?: boolean;
  onModify?: () => void;
};

const LabelsWrapper = ({
  firstName,
  lastName,
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
        'relative grid max-h-28 min-h-[104px] min-w-64 grid-flow-col grid-rows-2 gap-x-4 rounded-2xl bg-card p-4 pb-2 pt-2'
      )}
    >
      <div className="w-max">
        <p className="text-base font-bold">{t('firstname')}</p>
        <p className="flex-wrap text-sm">{firstName}</p>
      </div>

      <div className="w-max">
        <p className="text-base font-bold">{t('lastname')}</p>
        <p className="flex-wrap text-sm">{lastName}</p>
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

      {modifiable && (
        <div className={'absolute right-2 top-2 flex gap-1'}>
          <FilledOrNot size={15} filled={!!lastName || !firstName || !!age || !!sex} />
          <div
            className={'text-foreground opacity-60 smooth42transition hover:opacity-100'}
            title={t('click-to-modify')}
          >
            <PenLine size={15} onClick={onModify} />
          </div>
        </div>
      )}
    </div>
  );
};

export default LabelsWrapper;
