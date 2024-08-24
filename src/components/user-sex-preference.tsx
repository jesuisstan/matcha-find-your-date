'use client';

import React from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useTheme } from 'next-themes';

import clsx from 'clsx';
import { SquarePen } from 'lucide-react';

const SexPreferenceIcon = ({ preference, theme }: { preference: string; theme: string }) => {
  switch (preference) {
    case 'men':
      return (
        <div
          className={clsx(
            'flex items-center justify-center rounded-full px-[2px] py-[2px]',
            theme === 'dark' ? 'bg-foreground' : ''
          )}
        >
          <div className="overflow-hidden rounded-full bg-transparent">
            <Image
              src="/sex/male.png"
              alt="men"
              width={0}
              height={0}
              sizes="100vw"
              className="h-auto w-10"
              placeholder="blur"
              blurDataURL={'/sex/male.png'}
              priority
            />
          </div>
        </div>
      );
    case 'women':
      return (
        <div
          className={clsx(
            'flex items-center justify-center rounded-full px-[2px] py-[2px]',
            theme === 'dark' ? 'bg-foreground' : ''
          )}
        >
          <div className="overflow-hidden rounded-full bg-transparent">
            <Image
              src="/sex/female.png"
              alt="women"
              width={0}
              height={0}
              sizes="100vw"
              className="h-auto w-10"
              placeholder="blur"
              blurDataURL={'/sex/female.png'}
              priority
            />
          </div>
        </div>
      );
    case 'bisexual':
      return (
        <div
          className={clsx(
            'flex items-center justify-center rounded-full px-[2px] py-[2px]',
            theme === 'dark' ? 'bg-foreground' : ''
          )}
        >
          <div className="overflow-hidden rounded-full bg-transparent">
            <Image
              src="/sex/bi.png"
              alt="bisexual"
              width={0}
              height={0}
              sizes="100vw"
              className="h-auto w-10"
              placeholder="blur"
              blurDataURL={'/sex/bi.png'}
              priority
            />
          </div>
        </div>
      );
    default:
      return (
        <div
          className={clsx(
            'flex items-center justify-center rounded-full px-[2px] py-[2px]',
            theme === 'dark' ? 'bg-foreground' : ''
          )}
        >
          <div className="overflow-hidden rounded-full bg-transparent">
            <Image
              src="/sex/a.png"
              alt="unknown"
              width={0}
              height={0}
              sizes="100vw"
              className="h-auto w-10"
              placeholder="blur"
              blurDataURL={'/sex/a.png'}
              priority
            />
          </div>
        </div>
      );
  }
};

const UserSexPreference = ({
  sexPreference,
  modifiable,
  onModify,
}: {
  sexPreference: string | undefined;
  modifiable?: boolean;
  onModify?: () => void;
}) => {
  const t = useTranslations();
  const { theme } = useTheme();

  return (
    <div className="relative flex items-center">
      <span className="mr-2 text-base font-bold">{t('selector.preferences') + ':'}</span>
      {sexPreference ? (
        <span className="flex items-center gap-2">
          <SexPreferenceIcon preference={sexPreference} theme={theme!} />
          {t(`selector.${sexPreference}`)}
        </span>
      ) : (
        <span className="flex items-center gap-2">???</span>
      )}

      {modifiable && (
        <div className="absolute right-1 top-0 text-foreground opacity-60 smooth42transition hover:opacity-100">
          <SquarePen size={18} onClick={onModify} />
        </div>
      )}
    </div>
  );
};

export default UserSexPreference;
