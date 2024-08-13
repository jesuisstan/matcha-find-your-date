import { ALL_COUNTRY_ISO_CODES } from '@/constants/all-country-iso-codes';
import { TSelectorOption } from '@/utils/create-tags';

export const getOptionLabelByValue = (
  value: string,
  selectorOptions: TSelectorOption[]
): string => {
  const result = selectorOptions?.find((item) => item.value.split('_')[0] === value);
  return result ? result.label : '';
};

export const getCountryFullName = (countryCode: string) => {
  const country = ALL_COUNTRY_ISO_CODES.find((item) => item.code === countryCode);
  return country ? country.name : 'unknown country';
};

export const sortCountriesOptionsByCode = (
  countriesOptions: TSelectorOption[],
  order?: string[]
): TSelectorOption[] => {
  const defaultOrder = ['US', 'CN', 'EU'];

  // If order is not provided, use default order
  const sortOrder = order || defaultOrder;

  // Create a map to quickly lookup index of country codes in sortOrder
  const orderMap = {} as Record<string, number>;
  sortOrder.forEach((code, index) => {
    orderMap[code] = index;
  });

  // Sort countriesOptions based on order
  countriesOptions.sort((a, b) => {
    const indexA =
      orderMap[a.value.split('_')[0]] !== undefined ? orderMap[a.value.split('_')[0]] : Infinity;
    const indexB =
      orderMap[b.value.split('_')[0]] !== undefined ? orderMap[b.value.split('_')[0]] : Infinity;

    // If countries have the same order, sort alphabetically
    if (indexA === indexB) {
      return a.label.localeCompare(b.label);
    }

    return indexA - indexB;
  });

  return countriesOptions;
};

export const verifyMultipleSelectorDefaultValues = (
  options: TSelectorOption[],
  defaultValues: string[]
): string[] => {
  if (!options || options.length === 0) return [];

  if (defaultValues.length === 0) return [options[0].value] as string[];

  const filteredDefaults = defaultValues.filter((value) =>
    options.some((option) => option.value === value)
  );

  if (filteredDefaults.length === 0) return [options[0].value];

  return filteredDefaults.length === defaultValues.length ? defaultValues : filteredDefaults;
};

export function onlyUnique(value: any, index: any, array: any) {
  return array.indexOf(value) === index;
}

export function mergeArrays(arr1: any, arr2: any) {
  // Iterate through the second array
  for (let i = 0; i < arr2?.length; i++) {
    const currentDate = arr2[i]?.date;

    // Find the corresponding object in the first array based on the date
    const matchingObject = arr1?.find((obj: any) => obj.date === currentDate);

    // If a matching object is found, merge it into the current object in the second array
    if (matchingObject) {
      arr2[i] = { ...arr2[i], ...matchingObject };
    }
  }

  return arr2;
}

/**
 * Utility function to create an array of default values for ChipsGroup
 * @param {Array} options - The options array
 * @param {Array} sequences - The array of sequences to match in the value
 * @returns {Array} - Array of default values matching the sequences
 */
export function createDefaultChipsArray(
  options: TSelectorOption[],
  sequences: Array<string>
): Array<string> {
  return options
    .filter((option) => sequences.some((seq) => option.value.includes(seq)))
    .map((option) => option.value);
}

/**
 * Utility function to sort options array (for Dropdown, Chips, etc) by a keyword, which always should be 1st in the options array
 * @param {Array} componentsOptions - The options array
 * @param {string} keyWord - Thee keyword, which always should be 1st in the options array
 * @returns {Array} - The sorted options array
 */
export const sortOptionsByKeyWord = (
  componentsOptions: TSelectorOption[],
  keyWord: string
): TSelectorOption[] => {
  componentsOptions.sort((a, b) => {
    if (a.value === keyWord) {
      return -1;
    }
    if (b.value === keyWord) {
      return 1;
    }
    if (a.value.includes(keyWord) && b.value.includes(keyWord)) {
      return a.value.localeCompare(b.value);
    }
    if (a.value.includes(keyWord)) {
      return -1;
    }
    if (b.value.includes(keyWord)) {
      return 1;
    }
    return a.value.localeCompare(b.value);
  });

  return componentsOptions;
};
