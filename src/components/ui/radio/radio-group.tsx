/* Component for managing a set of radio options.
    Manages selected values through search parameters in the URL.
    Provides functionality to update search parameters based on selected value.

  Props for the RadioGroup component:
  - smartdataFilterKey: Name attribute for the form and query-string element;
  - label: Label for the entire radio group;
  - options: Array of objects containing values and labels for radio options;
  - defaultValue: Optional default value for the radio group
    (if undefined - automatically setted as the value of the 1st Options object (options[0].value)) or LocalStorage*/

'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

import RadioOption from '@/components/ui/radio/radio-option';
import useSmartdataFiltersStore from '@/stores/smartdata';
import { radioGroupPropsSchema, TRadioGroupProps } from '@/types/radio-button';
import { capitalize, extractSmartdataName } from '@/utils/format-string';

const RadioGroup = ({ smartdataFilterKey, label, options, defaultValue }: TRadioGroupProps) => {
  const optionsValues = options.map((option) => option.value);

  // Verify defaultValue: if valid, use it, otherwise use the first option's value
  const verifiedDefaultValue = defaultValue
    ? optionsValues.includes(defaultValue)
      ? defaultValue
      : options?.[0]?.value
    : options?.[0]?.value;

  const { getValueOfSmartdata, setValueOfSmartdata } = useSmartdataFiltersStore();
  const smartdataName = extractSmartdataName(usePathname());
  const smartdataValue = getValueOfSmartdata(smartdataName, smartdataFilterKey);

  const handleRadioSelect = (value: string) => {
    setValueOfSmartdata(smartdataName, smartdataFilterKey, value);
  };

  // initial setting of smartdata value:
  useEffect(() => {
    if (!smartdataValue) {
      setValueOfSmartdata(smartdataName, smartdataFilterKey, verifiedDefaultValue);
    }
  }, [options]);

  /* Verifying the passed Props of the component */
  const verif = radioGroupPropsSchema.safeParse({
    smartdataFilterKey,
    label,
    options,
    defaultValue,
  });

  if (!verif.success) {
    console.error(verif.error);
    return null;
  }

  return (
    <div id={`${smartdataFilterKey}-radio`}>
      {label && (
        <div className="mb-3 block text-base font-normal text-foreground">{capitalize(label)}</div>
      )}
      <div className="flex flex-row flex-wrap justify-start gap-5">
        {options.map((option, index) => (
          <RadioOption
            key={`${option.value}-${index}`}
            value={option.value}
            isSelected={option.value === smartdataValue}
            onSelect={handleRadioSelect}
          >
            {option.label}
          </RadioOption>
        ))}
      </div>
    </div>
  );
};

export default RadioGroup;
