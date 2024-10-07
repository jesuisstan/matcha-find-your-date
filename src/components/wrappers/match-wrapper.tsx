import { useTranslations } from 'next-intl';

import { HeartCrack, HeartPulse } from 'lucide-react';

const MatchWrapper = ({ isMatch }: { isMatch: boolean }) => {
  const t = useTranslations();

  return (
    <div className="w-24 self-center smooth42transition">
      {isMatch ? (
        <div className="group relative flex flex-col items-center justify-center gap-2 align-middle text-positive">
          <HeartPulse size={42} className="animate-ping" />
          <div className="absolute -bottom-3 hidden w-fit transform text-nowrap rounded-2xl border bg-foreground/90 px-2 text-xs text-background group-hover:block">
            {t('match')}
          </div>
        </div>
      ) : (
        <div className="group relative flex flex-col items-center justify-center gap-2 align-middle text-negative">
          <HeartCrack size={42} />
          <div className="absolute -bottom-3 hidden w-fit transform text-nowrap rounded-2xl border bg-foreground/90 px-2 text-xs text-background group-hover:block">
            {t('no-match')}
          </div>
        </div>
      )}
    </div>
  );
};

export default MatchWrapper;
