import { useState } from 'react';
import { useTranslations } from 'next-intl';

import { HeartCrack, HeartPulse } from 'lucide-react';

import { TDateProfile } from '@/types/date-profile';
import MatchSkeleton from '@/components/ui/skeletons/match-skeleton';

const MatchWrapper = ({
  isMatch,
  dateProfile,
  loading,
}: {
  isMatch: boolean;
  dateProfile: TDateProfile;
  loading: boolean;
}) => {
  const t = useTranslations();

  return loading ? (
    <MatchSkeleton />
  ) : (
    <div className="w-24 self-center rounded-2xl bg-card p-4 smooth42transition">
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
