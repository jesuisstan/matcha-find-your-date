'use client';

import React from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useTheme } from 'next-themes';

import clsx from 'clsx';
import { PenLine } from 'lucide-react';

import FilledOrNot from '@/components/ui/filled-or-not';

export const SexPreferenceIcon = ({
  preference,
  theme,
  translate,
}: {
  preference: string;
  theme: string;
  translate: (id: string) => string;
}) => {
  switch (preference) {
    case 'men':
      return (
        <div
          title={`${translate('sexual-preferences')} - ${translate(`selector.${preference}`)}`}
          className={clsx(
            'flex items-center justify-center rounded-full',
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
              className="h-auto w-10 p-1"
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
          title={`${translate('sexual-preferences')} - ${translate(`selector.${preference}`)}`}
          className={clsx(
            'flex items-center justify-center rounded-full',
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
              className="h-auto w-10 p-1"
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
          title={`${translate('sexual-preferences')} - ${translate(`selector.${preference}`)}`}
          className={clsx(
            'flex items-center justify-center rounded-full',
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
              className="h-auto w-10 p-1"
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
          title={`${translate('sexual-preferences')} - ${translate(`selector.undefined`)}`}
          className={clsx(
            'flex items-center justify-center rounded-full',
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
              className="h-auto w-10 p-1"
              placeholder="blur"
              blurDataURL={'/sex/a.png'}
              priority
            />
          </div>
        </div>
      );
  }
};

const SexPreferenceWrapper = ({
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
    <div className="relative rounded-2xl bg-card p-5">
      <div className="flex flex-col justify-start">
        <h3 className="text-xl font-bold">{t(`selector.preferences`)}</h3>
        <div className="mt-4">
          <div className=" flex items-center">
            {sexPreference ? (
              <div className="flex flex-row items-center gap-2">
                <SexPreferenceIcon preference={sexPreference} theme={theme!} translate={t} />
                <span className="mr-2 text-base">{t(`selector.${sexPreference}`)}</span>
              </div>
            ) : (
              <p className="italic">{t('data-incomplete')}</p>
            )}

            {modifiable && (
              <div className={'absolute right-2 top-2 flex gap-1'}>
                <FilledOrNot size={15} filled={!!sexPreference} />
                <div
                  className={'text-foreground opacity-60 smooth42transition hover:opacity-100'}
                  title={t('click-to-modify')}
                >
                  <PenLine size={15} onClick={onModify} />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SexPreferenceWrapper;
