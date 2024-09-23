'use client';

import React from 'react';
import { useTranslations } from 'next-intl';

import { PenLine } from 'lucide-react';

import StaticTagsGroup from '../ui/chips/tags-group-static';

import FilledOrNot from '@/components/ui/filled-or-not';

const InterestsWrapper = ({
  tagsList,
  modifiable,
  onModify,
}: {
  tagsList: string[] | null | undefined;
  modifiable?: boolean;
  onModify?: () => void;
}) => {
  const t = useTranslations();

  return (
    <div className="relative rounded-2xl bg-card p-5">
      <div className="flex flex-col justify-start">
        <h3 className="text-xl font-bold">{t(`interests`)}</h3>
        <div className="mt-4">
          <StaticTagsGroup tagsList={tagsList!} />
        </div>
      </div>

      {modifiable && (
        <div className={'absolute right-2 top-2 flex gap-1'}>
          <FilledOrNot size={15} filled={!!tagsList && tagsList.length >= 3} />
          <div
            className={'text-foreground opacity-60 smooth42transition hover:opacity-100'}
            title={t('click-to-modify')}
          >
            <PenLine size={15} onClick={onModify} />
          </div>
        </div>
      )}
    </div>
  );
};

export default InterestsWrapper;
