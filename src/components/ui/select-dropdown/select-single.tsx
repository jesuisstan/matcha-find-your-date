'use client';

import { useEffect } from 'react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSelector,
} from '@/components/ui/dropdown-primitives';
import SelectSkeleton from '@/components/ui/skeletons/select-skeleton';
import { SelectSinglePropsSchema, TSelectSingleProps } from '@/types/select-single';
import { capitalize } from '@/utils/format-string';

const SelectSingle = ({
  label,
  options,
  defaultValue,
  selectedItem,
  setSelectedItem,
  loading,
}: TSelectSingleProps) => {
  const optionsValues = options.map((option) => option.value);

  const verifiedDefaultValue = optionsValues.includes(defaultValue)
    ? defaultValue
    : options[0]?.value;

  const handleSelect = (value: string) => {
    setSelectedItem(value);
  };

  // Initial setting of value:
  useEffect(() => {
    if (selectedItem === undefined && defaultValue) {
      setSelectedItem(verifiedDefaultValue!);
    }
  }, [options]);

  /* Verifying the passed Props of the component */
  const verif = SelectSinglePropsSchema.safeParse({
    label,
    options,
    defaultValue,
    selectedItem,
    setSelectedItem,
    loading,
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
        <div className="mb-4 flex ">
          {label && (
            <div className="text-base font-normal text-foreground">{capitalize(label)}</div>
          )}
        </div>
        <DropdownMenuSelector
          asChild
          value={options.find((option) => option.value === selectedItem)?.label || ''}
        />
        <DropdownMenuPortal>
          <DropdownMenuContent sideOffset={5} side="right" align="start">
            <DropdownMenuRadioGroup value={selectedItem} onValueChange={handleSelect}>
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
