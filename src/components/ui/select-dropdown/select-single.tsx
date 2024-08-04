'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

import SelectSkeleton from './select-skeleton';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSelector,
} from '@/components/ui/dropdown-primitives';
import useSmartdataFiltersStore from '@/stores/smartdata';
import { SelectSinglePropsSchema, TSelectSingleProps } from '@/types/select-single';
import { extractSmartdataName } from '@/utils/format-string';

const SelectSingle = ({
  smartdataFilterKey,
  smartdataSubFilterKey,
  label,
  options,
  defaultValue,
  loading,
}: TSelectSingleProps) => {
  const optionsValues = options.map((option) => option.value);

  const verifiedDefaultValue = optionsValues.includes(defaultValue)
    ? defaultValue
    : options[0]?.value;

  const { getValueOfSmartdata, setValueOfSmartdata } = useSmartdataFiltersStore();
  const smartdataName = extractSmartdataName(usePathname());
  const smartdataValue = getValueOfSmartdata(
    smartdataName,
    smartdataFilterKey,
    smartdataSubFilterKey
  ) as string;

  const updateSearchParams = (smartdataName: string, paramName: string, newValue: string) => {
    setValueOfSmartdata(smartdataName, paramName, newValue, smartdataSubFilterKey);
  };

  const handleSelect = (value: string) => {
    updateSearchParams(smartdataName, smartdataFilterKey, value);
  };

  // initial setting of smartdata value:
  useEffect(() => {
    if (!smartdataValue) {
      setValueOfSmartdata(
        smartdataName,
        smartdataFilterKey,
        verifiedDefaultValue,
        smartdataSubFilterKey
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [smartdataSubFilterKey, options]);

  /* Verifying the passed Props of the component */
  const verif = SelectSinglePropsSchema.safeParse({
    smartdataFilterKey,
    label,
    options,
    defaultValue,
  });

  if (!verif.success) {
    console.error(verif.error);
    return null;
  }

  return loading || !options || options?.length === 0 ? (
    <SelectSkeleton showLabel={!!label} />
  ) : (
    <DropdownMenu>
      <div className="flex flex-col items-start justify-start align-middle">
        <DropdownMenuSelector
          asChild
          value={options.find((option) => option.value === smartdataValue)?.label || ''}
        />
        {label && <div className="mt-1 text-xs text-secondary">{label}</div>}
        <DropdownMenuPortal>
          <DropdownMenuContent sideOffset={5} side="right" align="start">
            <DropdownMenuRadioGroup value={smartdataValue} onValueChange={handleSelect}>
              {options.map((option) => {
                return (
                  <DropdownMenuRadioItem key={option.value} value={option.value}>
                    {option.label}
                  </DropdownMenuRadioItem>
                );
              })}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenuPortal>
      </div>
    </DropdownMenu>
  );
};

export default SelectSingle;