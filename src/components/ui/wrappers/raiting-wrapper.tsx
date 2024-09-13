'use client';

import React from 'react';
import { useTranslations } from 'next-intl';

import { CircleHelp } from 'lucide-react';

const RaitingWrapper = ({ raiting }: { raiting: number }) => {
  const t = useTranslations();

  return (
    <div className="relative rounded-2xl bg-card p-5">
      <div className="flex flex-col justify-start">
        <h3 className="text-2xl font-bold">{t(`raiting`)}</h3>
        <div className="mt-4">
          <div className="flex items-center">
            {raiting ? (
              <span className="flex items-center gap-2">{raiting}</span>
            ) : (
              <p className="italic">{t('data-incomplete')}</p>
            )}

            <div className={'absolute right-2 top-2 flex gap-1'}>
              <div
                className={'text-foreground opacity-60 smooth42transition hover:opacity-100'}
                title={t('click-to-modify')}
              >
                <CircleHelp size={15} onClick={() => console.log('show-info')} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RaitingWrapper;
