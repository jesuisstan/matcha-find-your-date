'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuMultipleSelector,
  DropdownMenuPortal,
} from '@/components/ui/dropdown-primitives';
import SelectSkeleton from '@/components/ui/skeletons/select-skeleton';
import { TSelectMultipleProps, TSelectMultiplePropsSchema } from '@/types/select-multiple';
import { verifyMultipleSelectorDefaultValues } from '@/utils/format-array'; // todo
import { capitalize } from '@/utils/format-string';

const SelectMultiple = ({
  label,
  options,
  defaultValues,
  selectedItems,
  setSelectedItems,
  loading,
}: TSelectMultipleProps) => {
  const t = useTranslations();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // to handle closing on outside click
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const handleSelectAll = (event: React.FormEvent) => {
    event.preventDefault();
    setSelectedItems(options);
  };

  const handleUnselectAll = (event: React.FormEvent) => {
    event.preventDefault();
    setSelectedItems([]);
  };

  const handleSelect = (value: string) => {
    if (selectedItems?.includes(value)) {
      // If the chip is already selected, remove it from the array
      setSelectedItems(selectedItems.filter((item) => item !== value));
    } else {
      // If the chip is not selected, add it to the array
      setSelectedItems([...selectedItems, value]);
    }
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

  /* Verifying the passed Props of the component */
  const verif = TSelectMultiplePropsSchema.safeParse({
    label,
    options,
    defaultValues,
    selectedItems,
    setSelectedItems,
    loading,
  });

  if (!verif.success) {
    console.error(verif.error);
    return null;
  }

  /* Find labels corresponding to queryValues */
  const selectedLabels = options
    .filter((option) => selectedItems.includes(option))
    .map((selectedOption) => selectedOption);

  return loading || options?.length === 0 ? (
    <SelectSkeleton showLabel={!!label} />
  ) : (
    <DropdownMenu open={isDropdownOpen}>
      <div className="flex max-w-24 flex-col items-start justify-start align-middle">
        <div className="mb-4 flex flex-row items-end gap-5">
          {label && (
            <div className="text-base font-normal text-foreground">{capitalize(label)}</div>
          )}

          <div className="flex flex-row gap-7 text-xs font-normal text-secondary">
            <button className="min-w-fit text-left hover:text-negative" onClick={handleSelectAll}>
              {t(`selector.select-all`)}
            </button>
            <button className="min-w-fit text-left hover:text-negative" onClick={handleUnselectAll}>
              {t(`selector.unselect-all`)}
            </button>
          </div>
        </div>
        <DropdownMenuMultipleSelector
          asChild
          value={selectedLabels.join(', ')}
          onClick={() => setIsDropdownOpen(true)}
          className="flex w-full items-center justify-between"
        />
        <DropdownMenuPortal>
          <DropdownMenuContent sideOffset={5} align="start">
            <DropdownMenuGroup ref={dropdownRef}>
              {options.map((option) => {
                const isChecked = selectedItems.includes(option);
                return (
                  <DropdownMenuCheckboxItem
                    key={option}
                    checked={isChecked}
                    onClick={() => handleSelect(option)}
                  >
                    {option}
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
