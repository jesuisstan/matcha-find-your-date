import { useTranslations } from 'next-intl';

import { HandHeart, HeartCrack, HeartPulse, PersonStanding } from 'lucide-react';

const MatchWrapper = ({
  isMatch,
  isLiked,
  isBlocked,
}: {
  isMatch: boolean;
  isLiked: boolean;
  isBlocked: boolean;
}) => {
  const t = useTranslations();

  return (
    <div className="w-24 self-center smooth42transition">
      {isMatch && !isBlocked && (
        <div className="group relative z-40 flex flex-col items-center justify-center gap-2 align-middle text-positive">
          <HeartPulse size={42} className="animate-ping" />
          <div className="absolute -bottom-3 hidden w-fit transform text-nowrap rounded-2xl border bg-foreground/90 px-2 text-xs text-background group-hover:block">
            {t('match')}
          </div>
        </div>
      )}
      {!isMatch && !isLiked && !isBlocked && (
        <div className="group relative z-40 flex flex-col items-center justify-center gap-2 align-middle text-c42orange">
          <PersonStanding size={42} className="hover:animate-spin" />
          <div className="absolute -bottom-3 hidden w-fit transform text-nowrap rounded-2xl border bg-foreground/90 px-2 text-xs text-background group-hover:block">
            {t('no-match')}
          </div>
        </div>
      )}
      {!isMatch && isLiked && !isBlocked && (
        <div className="group relative z-40 flex flex-col items-center justify-center gap-2 align-middle text-positive">
          <HandHeart size={42} className="animate-bounce" />
          <div className="absolute -bottom-3 hidden w-fit transform text-nowrap rounded-2xl border bg-foreground/90 px-2 text-xs text-background group-hover:block">
            {t('like-sent')}
          </div>
        </div>
      )}
      {isBlocked && (
        <div className="group relative z-40 flex flex-col items-center justify-center gap-2 align-middle text-negative">
          <HeartCrack size={42} className="animate-pulse" />
          <div className="absolute -bottom-3 hidden w-fit transform text-nowrap rounded-2xl border bg-foreground/90 px-2 text-xs text-background group-hover:block">
            {t('blocked-profile')}
          </div>
        </div>
      )}
    </div>
  );
};

export default MatchWrapper;
