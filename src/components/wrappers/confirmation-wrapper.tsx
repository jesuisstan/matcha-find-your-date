import { useTranslations } from 'next-intl';

import clsx from 'clsx';
import { ShieldAlert, ShieldCheck } from 'lucide-react';

const ConfirmationWrapper = ({ confirmed }: { confirmed: boolean | undefined }) => {
  const t = useTranslations();

  return (
    <div className="w-max self-center">
      {confirmed ? (
        <div title={t('confirmed')}>
          <ShieldCheck size={30} className="text-c42green" />
        </div>
      ) : (
        <div title={t('not-confirmed')}>
          <ShieldAlert size={30} className="text-negative" />
        </div>
      )}
    </div>
  );
};

export default ConfirmationWrapper;
