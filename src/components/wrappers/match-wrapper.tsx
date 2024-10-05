import { useState } from 'react';
import { useTranslations } from 'next-intl';

import { HeartCrack, HeartPulse } from 'lucide-react';

import { TDateProfile } from '@/types/date-profile';

const MatchnWrapper = ({ dateProfile }: { dateProfile: TDateProfile }) => {
  const t = useTranslations();
  const [loading, setLoading] = useState(false);
  const [matched, setMatched] = useState(false);

  return loading ? (
    <div className="h-8 w-8 animate-pulse self-center rounded-full bg-muted"></div>
  ) : (
    <div className="w-max self-center">
      {matched ? (
        <div className="group relative flex flex-row items-center justify-center align-middle text-positive hover:bg-transparent">
          <HeartPulse size={30} className="animate-ping" />
          <div className="absolute -bottom-3 hidden w-fit transform text-nowrap rounded-2xl border bg-foreground/90 px-1 text-xs text-background group-hover:block">
            {t('match')}
          </div>
        </div>
      ) : (
        <div className="group relative flex flex-row items-center justify-center align-middle text-negative hover:bg-transparent">
          <HeartCrack size={30} />
          <div className="absolute -bottom-3 hidden w-fit transform text-nowrap rounded-2xl border bg-foreground/90 px-1 text-xs text-background group-hover:block">
            {t('no-match')}
          </div>
        </div>
      )}
    </div>
  );
};

export default MatchnWrapper;
