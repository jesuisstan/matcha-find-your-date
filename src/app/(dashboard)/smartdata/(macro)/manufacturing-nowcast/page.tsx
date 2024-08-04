'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import useTranslation from 'next-translate/useTranslation';

import clsx from 'clsx';
import { PlaySquareIcon } from 'lucide-react';

import HeaderSkeleton from '@/components/modules/header/header-skeleton';
import { Button } from '@/components/ui/button';
import ChipsGroup from '@/components/ui/chips/chips-group';
import UseCaseButton from '@/components/ui/download-buttons/use-case-button';
import RadioGroup from '@/components/ui/radio/radio-group';
import DescriptionWrapper from '@/components/ui/wrappers/description-wrapper';
import LabelsWrapper from '@/components/ui/wrappers/labels-wrapper';
import useSmartdataFiltersStore from '@/stores/smartdata';
import { extractSmartdataName } from '@/utils/format-string';

const ManufacturingNowcast = () => {
  // Translate hook
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false); // todo

  //const { getValueOfSmartdata } = useSmartdataFiltersStore();

  // TODO: API call to get option
  const indicatorOptions = [{ value: 'nsa', label: t`common:selector.level` }];

  const frequencyOptions = [
    { value: 'daily', label: t`common:selector.daily` },
    { value: 'monthly', label: t`common:selector.monthly` },
  ];

  const approachOptions = [
    { value: 'standardized', label: t`common:selector.standardized` },
    { value: 'level', label: t`common:selector.level-qmn` },
  ];

  const countriesOptions = [
    { value: 'US', label: 'USA' },
    { value: 'RU', label: 'Russia' },
  ];

  //// Params from Smartdata store. (!) Default values are set in the store:
  //const smartdataName = extractSmartdataName(usePathname());
  //const frequency: string = getValueOfSmartdata(smartdataName, 'frequency') as string;
  //const indicator: string = getValueOfSmartdata(smartdataName, 'indicator') as string; // note: called 'seasAdj' in API data
  //const approach: string = getValueOfSmartdata(smartdataName, 'approach') as string; // note: called 'unit' in API data
  //const geoIds: string[] = getValueOfSmartdata(smartdataName, 'countries') as string[];

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
                <UseCaseButton url={'metadata?.documentation'} disabled={loading} />
                <div className="flex w-full flex-row items-center justify-center gap-4">
                  <Button size="icon">
                    <PlaySquareIcon size={20} />
                  </Button>
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
            <div className="mt-4">
              <RadioGroup
                smartdataFilterKey="frequency"
                label={t`common:selector.frequency`}
                options={frequencyOptions}
                defaultValue={'daily'}
              />
            </div>
            <div className="mt-4">
              <RadioGroup
                smartdataFilterKey="approach"
                label={t`common:selector.approach`}
                options={approachOptions}
                defaultValue={'standardized'}
              />
            </div>
            <div className="mt-4">CONTENT</div>
          </div>
        </div>
        <div className={clsx('col-span-10', 'lg:col-span-7')}>
          {/* SELECTOR */}
          <div className={clsx('mb-4 flex flex-col rounded-2xl bg-card p-2', 'xl:flex-row')}>
            <div className={clsx('m-4', 'xl:w-2/3')}>
              <ChipsGroup
                smartdataFilterKey="countries"
                label={t`common:selector.select-country`}
                options={countriesOptions || []}
                defaultValues={['US']}
              />
            </div>
            {/* vertical divider */}
            <div className={clsx('m-5 hidden w-[1px] bg-secondary opacity-40', 'xl:block')} />
            <div className={clsx('m-4', 'xl:w-1/2')}>
              <RadioGroup
                smartdataFilterKey="indicator"
                label={t`common:selector.indicator`}
                options={indicatorOptions}
                defaultValue={'level'}
              />
            </div>
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

export default ManufacturingNowcast;
