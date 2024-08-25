'use client';

import React from 'react';
import { useTranslations } from 'next-intl';

import { SquarePen } from 'lucide-react';

import FilledOrNot from '@/components/ui/filled-or-not';

const UserLocation = ({
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
    <div className="relative flex items-center">
      {address ? (
        <span className="flex items-center gap-2">{address}</span>
      ) : (
        <p className="italic">{t('data-incomplete')}</p>
      )}

      {modifiable && (
        <div className={'absolute right-1 top-0 flex gap-1'}>
          <FilledOrNot size={18} filled={!!address} />
          <div className={'text-foreground opacity-60 smooth42transition hover:opacity-100'}>
            <SquarePen size={18} onClick={onModify} />
          </div>
        </div>
      )}
    </div>
  );
};

export default UserLocation;
