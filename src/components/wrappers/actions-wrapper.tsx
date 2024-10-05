import { useState } from 'react';
import { useTranslations } from 'next-intl';

import clsx from 'clsx';
import { CircleX, Heart, HeartOff, MessageCircleMore, ShieldAlert } from 'lucide-react';

import { ButtonMatcha } from '../ui/button-matcha';

import { TDateProfile } from '@/types/date-profile';

const ActionsWrapper = ({ dateProfile }: { dateProfile: TDateProfile }) => {
  const t = useTranslations();
  const [loading, setLoading] = useState(false);

  return loading ? (
    <div className="flex animate-pulse flex-col space-y-3">
      <div className="h-14 rounded-2xl bg-muted lg:h-[104px] lg:w-40"></div>
    </div>
  ) : (
    <div
      className={clsx(
        'relative grid max-h-28 grid-flow-col grid-rows-1 items-center justify-center overflow-x-auto rounded-2xl bg-card p-4 pb-2 pt-2 smooth42transition',
        'lg:min-h-[104px] lg:max-w-fit lg:grid-rows-2 lg:overflow-visible'
      )}
    >
      <div>
        <ButtonMatcha
          variant="ghost"
          size="default"
          className="group relative hover:bg-transparent"
        >
          <>
            <Heart />
            <div className="absolute bottom-0 left-1/2 hidden -translate-x-1/2 transform rounded-2xl border bg-foreground/90 px-1 text-xs text-background group-hover:block">
              {t('like')}
            </div>
          </>
        </ButtonMatcha>
      </div>

      <div>
        <ButtonMatcha
          variant="ghost"
          size="default"
          className="group relative hover:bg-transparent"
        >
          <MessageCircleMore />
          <div className="absolute bottom-0 left-1/2 hidden -translate-x-1/2 transform rounded-2xl border bg-foreground/90 px-1 text-xs text-background group-hover:block">
            {t('chat')}
          </div>
        </ButtonMatcha>
      </div>

      <div>
        <ButtonMatcha
          variant="ghost"
          size="default"
          className="group relative hover:bg-transparent"
        >
          <>
            <CircleX />
            <div className="absolute bottom-0 left-1/2 hidden -translate-x-1/2 transform rounded-2xl border bg-foreground/90 px-1 text-xs text-background group-hover:block">
              {t('block')}
            </div>
          </>
        </ButtonMatcha>
      </div>

      <div>
        <ButtonMatcha
          variant="ghost"
          size="default"
          className="group relative hover:bg-transparent"
        >
          <ShieldAlert />
          <div className="absolute bottom-0 left-1/2 hidden -translate-x-1/2 transform rounded-2xl border bg-foreground/90 px-1 text-xs text-background group-hover:block">
            {t('report')}
          </div>
        </ButtonMatcha>
      </div>
    </div>
  );
};

export default ActionsWrapper;
