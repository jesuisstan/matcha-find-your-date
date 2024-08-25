import { useTranslations } from 'next-intl';

import { CircleAlert, CircleCheck } from 'lucide-react';

const FilledOrNot = ({ size, filled }: { size: number; filled?: boolean }) => {
  const t = useTranslations();

  return (
    <div title={filled ? t('data-category-filled') : t('data-category-not-filled')}>
      {filled ? (
        <CircleCheck size={size} className="text-positive" />
      ) : (
        <CircleAlert size={size} className="text-c42orange" />
      )}
    </div>
  );
};

export default FilledOrNot;
