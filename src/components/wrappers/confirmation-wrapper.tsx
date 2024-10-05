import { useTranslations } from 'next-intl';

import { ShieldAlert, ShieldCheck } from 'lucide-react';

const ConfirmationWrapper = ({ confirmed }: { confirmed: boolean | undefined }) => {
  const t = useTranslations();

  return (
    <div className="w-max self-center">
      {confirmed ? (
        <div className="group relative flex flex-row items-center justify-center align-middle text-positive hover:bg-transparent">
          <ShieldCheck size={30} className="text-c42green" />
          <div className="absolute -bottom-3 z-50 hidden w-fit transform text-nowrap rounded-2xl border bg-foreground/90 px-1 text-xs text-background group-hover:block">
            {t('confirmed')}
          </div>
        </div>
      ) : (
        <div className="group relative flex flex-row items-center justify-center align-middle text-positive hover:bg-transparent">
          <ShieldAlert size={30} className="text-negative" />
          <div className="absolute -bottom-3 z-50 hidden w-fit transform text-nowrap rounded-2xl border bg-foreground/90 px-1 text-xs text-background group-hover:block">
            {t('not-confirmed')}
          </div>
        </div>
      )}
    </div>
  );
};

export default ConfirmationWrapper;
