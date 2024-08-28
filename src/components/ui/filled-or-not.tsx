import { useTranslations } from 'next-intl';

import clsx from 'clsx';
import { CircleAlert, CircleCheck } from 'lucide-react';

const FilledOrNot = ({
  size,
  filled,
  warning,
}: {
  size: number;
  filled?: boolean;
  warning?: boolean;
}) => {
  const t = useTranslations();

  return (
    <div
      title={
        !filled
          ? t('data-category-not-filled')
          : warning
            ? t('data-incomplete')
            : t('data-category-filled')
      }
    >
      {filled ? (
        <CircleCheck
          size={size}
          className={clsx('smooth42transition', warning ? 'text-yellow-500' : 'text-positive')}
        />
      ) : (
        <CircleAlert size={size} className="text-negative" />
      )}
    </div>
  );
};

export default FilledOrNot;
