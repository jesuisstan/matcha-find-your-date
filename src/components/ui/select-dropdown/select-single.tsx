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
  disabled,
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
    disabled,
  });

  if (!verif.success) {
    console.error(verif.error);
    return null;
  }

  return loading ? (
    <SelectSkeleton showLabel={!!label} />
  ) : (
    <DropdownMenu>
      <div className="flex flex-col items-start justify-start align-middle">
        <div className="mb-1 flex ">
          {label && <div className="text-sm font-normal text-foreground">{capitalize(label)}</div>}
        </div>
        <DropdownMenuSelector
          disabled={disabled}
          asChild
          value={options.find((option) => option.value === selectedItem)?.label || ''}
        />
        <DropdownMenuPortal>
          <DropdownMenuContent sideOffset={5} side="right" align="start">
            <DropdownMenuRadioGroup value={selectedItem} onValueChange={handleSelect}>
              {options.map((option) => {
                return (
                  <DropdownMenuRadioItem key={option.value} value={option.value} disabled={option.disabled}>
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
