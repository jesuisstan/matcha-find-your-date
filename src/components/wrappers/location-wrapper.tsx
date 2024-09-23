'use client';

import React from 'react';
import { useTranslations } from 'next-intl';

import { PenLine } from 'lucide-react';

import FilledOrNot from '@/components/ui/filled-or-not';

const LocationWrapper = ({
  address,
  modifiable,
  onModify,
}: {
  address: string | null | undefined;
  modifiable?: boolean;
  onModify?: () => void;
}) => {
  const t = useTranslations();

  return (
    <div className="relative rounded-2xl bg-card p-5">
      <div className="flex flex-col justify-start">
        <h3 className="text-xl font-bold">{t(`location`)}</h3>
        <div className="mt-4">
          <div className="flex items-center">
            {address ? (
              <span className="flex items-center gap-2">{address}</span>
            ) : (
              <p className="italic">{t('data-incomplete')}</p>
            )}

            {modifiable && (
              <div className={'absolute right-2 top-2 flex gap-1'}>
                <FilledOrNot size={15} filled={!!address} />
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

export default LocationWrapper;
