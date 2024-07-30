'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

import clsx from 'clsx';

import { Checkbox } from './checkbox';

import useSmartdataFiltersStore from '@/stores/smartdata';
import { selectMultiplePropsSchema, TSelectMultipleProps } from '@/types/select-multiple';
import { verifyMultipleSelectorDefaultValues } from '@/utils/format-array';
import { capitalize, extractSmartdataName } from '@/utils/format-string';

const CheckboxGroup = ({
  smartdataFilterKey,
  label,
  title,
  subHeader,
  options,
  defaultValues,
  firstBold,
}: TSelectMultipleProps) => {
  const verifiedDefaultValues = verifyMultipleSelectorDefaultValues(options, defaultValues);
  const [allUnselected, setAllUnselected] = useState(false);
  const { getValueOfSmartdata, addOneItemToSmartdata, removeOneItemOfSmartdata } =
    useSmartdataFiltersStore();
  const smartdataName = extractSmartdataName(usePathname());
  const selectedOptions: string[] =
    (getValueOfSmartdata(smartdataName, smartdataFilterKey) as string[]) || [];

  const handleSelect = (value: string) => {
    // allow to unselect all options
    if (selectedOptions?.length === 1 && value === selectedOptions![0]) {
      setAllUnselected(true);
    }

    if (selectedOptions?.includes(value)) {
      removeOneItemOfSmartdata(smartdataName, smartdataFilterKey, value);
    } else {
      addOneItemToSmartdata(smartdataName, smartdataFilterKey, value);
    }
  };

  // initial setting of smartdata value:
  useEffect(() => {
    if (selectedOptions?.length === 0 && !allUnselected) {
      verifiedDefaultValues.map((item) =>
        addOneItemToSmartdata(smartdataName, smartdataFilterKey, item)
      );
    }
  }, [options]);

  /* Verifying the passed Props of the component */
  const verif = selectMultiplePropsSchema.safeParse({
    smartdataFilterKey,
    label,
    title,
    subHeader,
    options,
    defaultValues,
  });

  if (!verif.success) {
    console.error(verif.error);
    return null;
  }

  return (
    <div className="flex flex-col items-start justify-start align-middle">
      {title && (
        <div className="mb-2 block text-base font-normal text-foreground">{capitalize(title)}</div>
      )}

      <div className="flex flex-row flex-wrap items-end space-x-3 space-y-2">
        {subHeader && (
          <div
            className={clsx(
              'text-sm font-bold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
            )}
          >
            {subHeader}
            {':'}
          </div>
        )}

        {options.map((option: any, index: number) => {
          const isChecked = selectedOptions.includes(option.value);

          return (
            <div
              key={option.value}
              className="flex flex-row items-center space-x-1"
              onClick={() => handleSelect(option.value)}
            >
              <Checkbox checked={isChecked} />
              <div
                className={clsx(
                  'text-sm leading-none hover:cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
                  firstBold && index == 0 ? 'font-bold' : 'font-medium'
                )}
              >
                {option.label}
                {firstBold && index == 0 && ':'}
              </div>
            </div>
          );
        })}
      </div>
      {label && <div className="mt-2 text-xs text-secondary">{label}</div>}
    </div>
  );
};

export default CheckboxGroup;
