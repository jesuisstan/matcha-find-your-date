import React from 'react';
import Image from 'next/image';

import clsx from 'clsx';

import { formatApiDateLastUpdate } from '@/utils/format-api-date';
import { getCountryFullName } from '@/utils/format-array';
import { roundNumber } from '@/utils/number';

interface Props {
  title: string;
  subtitle: string;
  data?: any;
}

const DiscretionnaryOverviewCard = ({ title, subtitle, data }: Props) => {
  const lastDate = data?.[0]?.date;

  function setColor(value: number, unit: string) {
    if (unit === 'yty' || unit === 'mtm' || unit === 'qtq') {
      if (value > 0) {
        return 'text-green-500';
      } else if (value < 0) {
        return 'text-red-500';
      } else {
        return 'text-stone-600';
      }
    } else 'text-stone-600';
  }

  function customCountryName(name: string) {
    if (name === 'CN.3.MHT' || name === 'CN.3.NOMHT') {
      return 'asia';
    } else if (name === 'WO') {
      return 'europe';
    } else {
      return name;
    }
  }

  return (
    <div className="flex h-min min-w-60 flex-auto basis-1 flex-col rounded-2xl bg-card p-5">
      <h1 className="text-nowrap text-xl sm:text-2xl">{title}</h1>
      <h2 className="text-nowrap text-xs text-stone-400">{subtitle}</h2>
      <div className="mt-4 flex h-full w-full items-center justify-between">
        <div className="flex w-full flex-col items-center gap-4">
          {data ? (
            data.map((item: any, index: number) => (
              <div key={index} className="flex w-full items-center justify-between">
                <div className="flex flex-auto basis-1 items-center gap-2">
                  <Image
                    src={`/country-flags/${customCountryName(item.country)?.toLowerCase()}.svg`}
                    alt="national-flag"
                    width={0}
                    height={0}
                    className="h-[14px] w-[14px] rounded-full object-cover"
                  />

                  <p className="text-md w-min overflow-hidden text-ellipsis text-left text-stone-600 hover:overflow-visible hover:text-clip sm:text-base">
                    {getCountryFullName(item.country.toUpperCase())}
                  </p>
                  <p className="text-xs text-stone-300">{item.version ? `${item.version}` : ''}</p>
                </div>
                {item.unit === 'yty' ? (
                  <p
                    className={clsx(
                      'text-md min-w-16 text-right sm:text-base',
                      setColor(item.value, item.unit)
                    )}
                  >
                    {item.value > 0 ? '+' : ''}
                    {roundNumber(item.value, 2)} %
                  </p>
                ) : (
                  ''
                )}
                {item.unit === 'level' || item.unit === 'standardized' ? (
                  <p className={clsx('text-md text-right text-stone-600 sm:text-base')}>
                    {roundNumber(item.value, 2)}
                  </p>
                ) : (
                  ''
                )}
              </div>
            ))
          ) : (
            <p className="text-md text-stone-600 sm:text-base">No data available</p>
          )}
          {data ? (
            <div className="self-end text-xs text-stone-500">
              Updated on {formatApiDateLastUpdate(lastDate)}
            </div>
          ) : (
            <div className="self-end text-xs text-stone-500">No date available</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DiscretionnaryOverviewCard;
