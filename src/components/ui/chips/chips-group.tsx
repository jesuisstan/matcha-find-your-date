'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import useTranslation from 'next-translate/useTranslation';

import ChipsOption from '@/components/ui/chips/chips-option';
import ChipsSkeleton from '@/components/ui/chips/chips-skeleton';
import Spinner from '@/components/ui/spinner';
import useSmartdataFiltersStore from '@/stores/smartdata';
import { chipsGroupPropsSchema, TChipGroupProps } from '@/types/chips';
import {
  checkVersionLengthChips,
  processVersionsChips,
  verifyMultipleSelectorDefaultValues,
} from '@/utils/format-array';
import { capitalize, extractSmartdataName } from '@/utils/format-string';

const ChipsGroup = ({
  smartdataFilterKey,
  smartdataSubFilterKey,
  label,
  options,
  defaultValues,
  singleSelection,
  showSpinner,
  loading,
  errorMessage,
  versionLength,
}: TChipGroupProps) => {
  const { t } = useTranslation();
  const [hideAllClicked, setHideAllClicked] = useState(false);
  const optionsValues = options?.map((option) => option.value);
  const verifiedDefaultValues = verifyMultipleSelectorDefaultValues(options, defaultValues);

  const {
    getValueOfSmartdata,
    addOneItemToSmartdata,
    removeOneItemOfSmartdata,
    clearAllItemsOfSmartdata,
    replaceAllItemsOfSmartdata,
  } = useSmartdataFiltersStore();
  const smartdataName = extractSmartdataName(usePathname());
  const smartdataValue: string[] =
    (getValueOfSmartdata(smartdataName, smartdataFilterKey, smartdataSubFilterKey) as string[]) ||
    [];

  const handleShowAll = (event: React.FormEvent) => {
    event.preventDefault();
    setHideAllClicked(false);
    optionsValues.map((option) =>
      addOneItemToSmartdata(smartdataName, smartdataFilterKey, option, smartdataSubFilterKey)
    );
  };

  const handleHideAll = (event: React.FormEvent) => {
    event.preventDefault();
    setHideAllClicked(true);
    clearAllItemsOfSmartdata!(smartdataName, smartdataFilterKey, smartdataSubFilterKey);
  };

  const handleChipSelect = (value: string) => {
    if (!singleSelection) {
      setHideAllClicked(false);
      if (smartdataValue?.length === 1 && value === smartdataValue![0]) {
        setHideAllClicked(true);
      }
      if (smartdataValue?.includes(value)) {
        removeOneItemOfSmartdata(smartdataName, smartdataFilterKey, value, smartdataSubFilterKey);
      } else {
        addOneItemToSmartdata(smartdataName, smartdataFilterKey, value, smartdataSubFilterKey);
      }
    } else {
      replaceAllItemsOfSmartdata(smartdataName, smartdataFilterKey, [value], smartdataSubFilterKey);
    }
  };

  // initial setting of smartdata value:
  useEffect(() => {
    if (
      hideAllClicked === false &&
      (!smartdataValue?.length || smartdataValue?.[0] === null || smartdataValue?.[0] === undefined)
    ) {
      if (verifiedDefaultValues.length && verifiedDefaultValues.length > 0) {
        verifiedDefaultValues.map((value) => {
          addOneItemToSmartdata(smartdataName, smartdataFilterKey, value, smartdataSubFilterKey);
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options]);

  /* Verifying the passed Props of the component */
  const verif = chipsGroupPropsSchema.safeParse({
    smartdataFilterKey,
    label,
    options,
    defaultValues,
  });

  if (!verif.success) {
    console.error(verif.error);
    return null;
  }
  //@ts-ignore
  const processedOptions = processVersionsChips(options);

  return loading || errorMessage || !options || options?.length === 0 ? (
    <ChipsSkeleton message={errorMessage} />
  ) : (
    <div
      id={`${smartdataFilterKey}-chips`}
      // name={smartdataFilterKey}
      className="relative flex flex-col justify-center"
    >
      <div className="mb-4 flex flex-row items-end gap-8">
        {label && <div className="text-base font-normal text-foreground">{label}</div>}
        {!singleSelection && (
          <div className="flex flex-row gap-7 text-xs font-normal text-secondary">
            <button className="min-w-fit text-left hover:text-c42orange" onClick={handleShowAll}>
              {t`common:selector.show-all`}
            </button>
            <button className="min-w-fit text-left hover:text-c42orange" onClick={handleHideAll}>
              {t`common:selector.hide-all`}
            </button>
          </div>
        )}
      </div>
      <div className="relative flex flex-row flex-wrap justify-start gap-2">
        {showSpinner && (
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform">
            <Spinner size={5} />
          </div>
        )}
        {options.map((option: any, index: number) => {
          const showVersion =
            versionLength && versionLength > 1
              ? true
              : checkVersionLengthChips(option.value, processedOptions);
          return (
            <ChipsOption
              key={`${option.value}-${index}`}
              paramName={smartdataFilterKey}
              value={option.value}
              isSelected={smartdataValue!.includes(option.value)}
              onSelect={handleChipSelect}
            >
              <div>{capitalize(option.label)}</div>
              {showVersion && <div className="ml-2">{option.version}</div>}
            </ChipsOption>
          );
        })}
      </div>
    </div>
  );
};

export default ChipsGroup;
