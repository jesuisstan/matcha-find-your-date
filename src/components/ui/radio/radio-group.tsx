'use client';

import { useEffect, useState } from 'react';

import RadioOption from '@/components/ui/radio/radio-option';
import { radioGroupPropsSchema, TRadioGroupProps } from '@/types/radio-button';
import { capitalize } from '@/utils/format-string';

const RadioGroup = ({ name, label, options, defaultValue }: TRadioGroupProps) => {
  const optionsValues = options.map((option) => option.value);
  const [selectedValue, setSelectedValue] = useState<string | null>(null);

  // Verify defaultValue: if valid, use it, otherwise use the first option's value
  const verifiedDefaultValue = defaultValue
    ? optionsValues.includes(defaultValue)
      ? defaultValue
      : options?.[0]?.value
    : options?.[0]?.value;

  const handleRadioSelect = (value: string) => {
    setSelectedValue(value);
  };

  // initial setting of value:
  useEffect(() => {
    if (!selectedValue) {
      setSelectedValue(verifiedDefaultValue);
    }
  }, [options]);

  /* Verifying the passed Props of the component */
  const verif = radioGroupPropsSchema.safeParse({
    name,
    label,
    options,
    defaultValue,
  });

  if (!verif.success) {
    console.error(verif.error);
    return null;
  }

  return (
    <div id={`radio`}>
      {label && (
        <div className="mb-3 block text-base font-normal text-foreground">{capitalize(label)}</div>
      )}
      <div className="flex flex-row flex-wrap justify-start gap-5">
        {options.map((option, index) => (
          <RadioOption
            key={`${option.value}-${index}`}
            value={option.value}
            isSelected={option.value === selectedValue}
            onSelect={handleRadioSelect}
            name={name}
          >
            {option.label}
          </RadioOption>
        ))}
      </div>
      <input type="hidden" name={name} value={selectedValue ?? ''} />
    </div>
  );
};

export default RadioGroup;
