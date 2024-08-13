'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

import clsx from 'clsx';
import { PlaySquareIcon } from 'lucide-react';

import HeaderSkeleton from '@/components/header-skeleton';
import { ButtonMatcha } from '@/components/ui/button-matcha';
import ChipsGroup from '@/components/ui/chips/chips-group';
import RadioGroup from '@/components/ui/radio/radio-group';
import DescriptionWrapper from '@/components/ui/wrappers/description-wrapper';
import LabelsWrapper from '@/components/ui/wrappers/labels-wrapper';

const SmartSuggestions = () => {
  // Translate hook
  const t = useTranslations();
  const [loading, setLoading] = useState(false); // todo

  //const { getValueOfSmartdata } = useSmartdataFiltersStore();

  // TODO: API call to get option
  const indicatorOptions = [{ value: 'nsa', label: t(`selector.level`) }];

  const frequencyOptions = [
    { value: 'daily', label: t(`selector.daily`) },
    { value: 'monthly', label: t(`selector.monthly`) },
  ];

  const countriesOptions = [
    { value: 'US', label: 'USA' },
    { value: 'RU', label: 'Russia' },
  ];

  return (
    <div>
      {/* HEADER */}
      <div className={clsx('mb-4 flex items-center justify-between text-4xl')}>
        {loading ? (
          <HeaderSkeleton />
        ) : (
          <div className="flex flex-col justify-start">
            <h1 className="mb-2 text-4xl">{'metadata?.title'}</h1>
            <div
              className={clsx(
                'flex flex-col items-stretch space-y-4',
                'lg:flex-row lg:items-start lg:space-x-4 lg:space-y-0'
              )}
            >
              {/* LABELS */}
              <LabelsWrapper
                category={'metadata?.category'}
                lastUpdate={'formatApiDateLastUpdate(filteredLastUpdate)'}
                frequency={'metadata?.frequency'}
                history={'metadata?.history'}
                loading={false}
              />
              {/* DESCRIPTION */}
              <DescriptionWrapper smartdataDescription={'metadata?.description'} />
              {/* BUTTONS GROUP */}
              <div className="flex flex-col items-center justify-center gap-4 xs:flex-row lg:flex-col">
                <div className="flex w-full flex-row items-center justify-center gap-4">
                  <ButtonMatcha size="icon">
                    <PlaySquareIcon size={20} />
                  </ButtonMatcha>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* GRID Cols 8 Rows 1 */}
      <div className="mb-4 grid grid-cols-10 gap-4">
        {/* OVERVIEW */}
        <div
          className={clsx(
            'col-span-10 h-max items-center justify-center rounded-2xl bg-card',
            'lg:col-span-3'
          )}
        >
          <div className="m-5 flex flex-col justify-start">
            <h3 className="text-3xl">{t`common:overview`}</h3>

            <div className="mt-4">CONTENT</div>
          </div>
        </div>
        <div className={clsx('col-span-10', 'lg:col-span-7')}>
          {/* SELECTOR */}
          <div className={clsx('mb-4 flex flex-col rounded-2xl bg-card p-2', 'xl:flex-row')}>
            <div className={clsx('m-4', 'xl:w-2/3')}>

            </div>
            {/* vertical divider */}
            <div className={clsx('m-5 hidden w-[1px] bg-secondary opacity-40', 'xl:block')} />

          </div>
          {/* CHART */}
          <div className="rounded-2xl bg-card p-2">
            <div>Content</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmartSuggestions;
