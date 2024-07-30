'use client';

import React from 'react';

import clsx from 'clsx';

import useSmartdataFiltersStore from '@/stores/smartdata';
import { capitalize } from '@/utils/format-string';

const DiscretionnarySmartdataBtn = (props: any) => {
  const { availableSmartdata } = props;
  const { getValueOfSmartdata, addOneItemToSmartdata, removeOneItemOfSmartdata } =
    useSmartdataFiltersStore();
  const smartdataName = 'discretionnary_smartdata';
  const smartdataFilterKey = 'smartdata';
  const smartdataValue: string[] =
    (getValueOfSmartdata(smartdataName, smartdataFilterKey) as string[]) || [];

  const handleSelect = (value: string) => {
    if (smartdataValue?.includes(value)) {
      removeOneItemOfSmartdata(smartdataName, smartdataFilterKey, value);
    } else {
      addOneItemToSmartdata(smartdataName, smartdataFilterKey, value);
    }
  };

  return (
    <div className="flex divide-x divide-slate-300">
      {availableSmartdata?.map((smartdata: any, i: number) => (
        <button
          key={i}
          onClick={() => handleSelect(smartdata.value)}
          className={clsx(
            'relative flex-auto basis-1  bg-card p-4 text-center first:first-of-type:rounded-l-xl last-of-type:rounded-r-xl hover:underline',
            'transition-all duration-300 ease-in-out',
            smartdataValue.includes(smartdata.value)
              ? 'shadow-[inset_rgba(0,0,0,0.1)_0px_4px_16px]'
              : 'text-primary'
          )}
        >
          <h1>{capitalize(smartdata.name)}</h1>
          <div
            className={clsx(
              'absolute bottom-2 left-1/2 mx-auto h-1.5 w-1.5 rounded-full transition-all duration-300 ease-in-out',
              smartdataValue.includes(smartdata.value) ? 'bg-red-600' : 'bg-transparent'
            )}
          ></div>
        </button>
      ))}
    </div>
  );
};

export default DiscretionnarySmartdataBtn;
