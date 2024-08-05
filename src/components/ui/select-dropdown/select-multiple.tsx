'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import useTranslation from 'next-translate/useTranslation';

import SelectSkeleton from './select-skeleton';

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuMultipleSelector,
  DropdownMenuPortal,
} from '@/components/ui/dropdown-primitives';
import useSmartdataFiltersStore from '@/stores/smartdata';
import { selectMultiplePropsSchema, TSelectMultipleProps } from '@/types/select-multiple';
import { verifyMultipleSelectorDefaultValues } from '@/utils/format-array';
import { capitalize, extractSmartdataName } from '@/utils/format-string';

const SelectMultiple = ({
  smartdataFilterKey,
  smartdataSubFilterKey,
  label,
  title,
  options,
  defaultValues,
  loading,
  selection,
}: TSelectMultipleProps) => {
  const { t } = useTranslation();
  const [allUnselected, setAllUnselected] = useState(false);
  const optionsValues = options.map((option) => option.value);

  const verifiedDefaultValues = verifyMultipleSelectorDefaultValues(options, defaultValues);

  const {
    getValueOfSmartdata,
    addOneItemToSmartdata,
    removeOneItemOfSmartdata,
    clearAllItemsOfSmartdata,
  } = useSmartdataFiltersStore();
  const smartdataName = extractSmartdataName(usePathname());
  const smartdataValue: string[] =
    (getValueOfSmartdata(smartdataName, smartdataFilterKey, smartdataSubFilterKey) as string[]) ||
    [];

  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // to handle closing on outside click
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const handleSelect = (value: string) => {
    setAllUnselected(false);
    if (smartdataValue.length === 1 && value === smartdataValue[0]) {
      setAllUnselected(true);
    }
    if (smartdataValue?.includes(value)) {
      removeOneItemOfSmartdata(smartdataName, smartdataFilterKey, value, smartdataSubFilterKey);
    } else {
      addOneItemToSmartdata(smartdataName, smartdataFilterKey, value, smartdataSubFilterKey);
    }
  };

  /* Select All or Unselect All */
  const handleSelectAll = () => {
    optionsValues.forEach((value) => {
      if (!smartdataValue.includes(value)) {
        addOneItemToSmartdata(smartdataName, smartdataFilterKey, value, smartdataSubFilterKey);
      }
    });
  };

  const handleUnselectAll = () => {
    clearAllItemsOfSmartdata(smartdataName, smartdataFilterKey, smartdataSubFilterKey);
    setAllUnselected(true);
  };

  /* Event listener to close DropdownMenu when clicking outside */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    if (isDropdownOpen) {
      document.addEventListener('click', handleClickOutside);
    }
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isDropdownOpen]);

  // initial setting of smartdata value:
  useEffect(() => {
    if (allUnselected === false && !smartdataValue?.length) {
      if (verifiedDefaultValues.length && verifiedDefaultValues.length > 0) {
        verifiedDefaultValues.map((value) => {
          addOneItemToSmartdata(smartdataName, smartdataFilterKey, value, smartdataSubFilterKey);
        });
      }
    }
  }, [options]);

  /* Verifying the passed Props of the component */
  const verif = selectMultiplePropsSchema.safeParse({
    smartdataFilterKey,
    label,
    title,
    options,
    defaultValues,
  });

  if (!verif.success) {
    console.error(verif.error);
    return null;
  }

  /* Find labels corresponding to queryValues */
  const selectedLabels = options
    .filter((option) => smartdataValue.includes(option.value))
    .map((selectedOption) => selectedOption.label);

  return loading || options?.length === 0 ? (
    <SelectSkeleton showLabel={!!label} showTitle={!!title} />
  ) : (
    <DropdownMenu open={isDropdownOpen}>
      <div className="flex max-w-24 flex-col items-start justify-start align-middle">
        <div className="mb-4 flex flex-row items-end gap-5">
          {title && (
            <div className="text-base font-normal text-foreground">{capitalize(title)}</div>
          )}
          {selection && (
            <div className="flex flex-row gap-7 text-xs font-normal text-secondary">
              <button
                className="hover:text-c42orange min-w-fit text-left"
                onClick={handleSelectAll}
              >
                {t`common:selector.show-all`}
              </button>
              <button
                className="hover:text-c42orange min-w-fit text-left"
                onClick={handleUnselectAll}
              >
                {t`common:selector.hide-all`}
              </button>
            </div>
          )}
        </div>
        <DropdownMenuMultipleSelector
          asChild
          value={selectedLabels.join(', ')}
          onClick={() => setIsDropdownOpen(true)}
          className="flex w-full items-center justify-between"
        />
        {label && <div className="mt-1 text-xs text-secondary">{label}</div>}
        <DropdownMenuPortal>
          <DropdownMenuContent sideOffset={5} align="start">
            <DropdownMenuGroup ref={dropdownRef}>
              {options.map((option) => {
                const isChecked = smartdataValue.includes(option.value);
                return (
                  <DropdownMenuCheckboxItem
                    key={option.value}
                    checked={isChecked}
                    onClick={() => handleSelect(option.value)}
                  >
                    {option.label}
                  </DropdownMenuCheckboxItem>
                );
              })}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenuPortal>
      </div>
    </DropdownMenu>
  );
};

export default SelectMultiple;
