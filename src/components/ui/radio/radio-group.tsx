'use client';

import { useEffect } from 'react';

import clsx from 'clsx';

import { Label } from '@/components/ui/label';
import RadioOption from '@/components/ui/radio/radio-option';
import { radioGroupPropsSchema, TRadioGroupProps } from '@/types/radio-button';
import { capitalize } from '@/utils/format-string';

const RadioGroup = ({
  label,
  options,
  defaultValue,
  selectedItem,
  onSelectItem,
}: TRadioGroupProps) => {
  const optionsValues = options.map((option) => option.value);

  // Verify defaultValue: if valid, use it, otherwise use the first option's value
  const verifiedDefaultValue = defaultValue
    ? optionsValues.includes(defaultValue)
      ? defaultValue
      : options?.[0]?.value
    : options?.[0]?.value;

  const handleRadioSelect = (value: string) => {
    onSelectItem(value);
  };

  // Initial setting of value:
  useEffect(() => {
    if (selectedItem === undefined && defaultValue) {
      onSelectItem(verifiedDefaultValue!);
    }
  }, [options]);

  // Verifying the passed Props of the component
  const verif = radioGroupPropsSchema.safeParse({
    label,
    options,
    defaultValue,
    selectedItem,
    onSelectItem,
  });

  if (!verif.success) {
    console.error(verif.error);
    return null;
  }

  return (
    <div id={`radio`}>
      {label && <Label htmlFor={`radio-${label}`}>{capitalize(label)}</Label>}
      <div
        id={`radio-${label}`}
        className={clsx('flex flex-row flex-wrap justify-start gap-5', label ? 'mt-4' : '')}
      >
        {options.map((option, index) => (
          <RadioOption
            key={`${option.value}-${index}`}
            value={option.value}
            isSelected={option.value === selectedItem}
            onSelect={handleRadioSelect}
          >
            {option.label}
          </RadioOption>
        ))}
      </div>
      <input type="hidden" value={selectedItem ?? ''} />
    </div>
  );
};

export default RadioGroup;
