import { ALL_COUNTRY_ISO_CODES } from '@/constants/all-country-iso-codes';

// export const sortOptionsArray = (arr: { label: string; value: string }[]) => {
//   if (arr.length <= 1) {
//     return arr;
//   }
//   return arr
//     .slice()
//     .sort((a, b) => a.value.localeCompare(b.value, undefined, { sensitivity: 'base' }));
// };

// export const lowercaseOptionsArrayValues = (arr: { label: string; value: string }[]) => {
//   return arr.map((item) => {
//     return {
//       ...item,
//       value: item.value.toLowerCase(),
//     };
//   });
// };

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

export type TSelectorOption = {
  value: string;
  label: string;
  version?: string;
  drilldown?: any[];
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

type TCountryDataOption = {
  id: string;
  name: string;
  date: string;
  unit: string;
  value: number | null;
};

export const sortCountriesForTableOverview = (
  countries: TCountryDataOption[]
): TCountryDataOption[] => {
  countries?.sort((a, b) => {
    if (a.name.includes('US')) {
      return -1;
    } else if (b.name.includes('US')) {
      return 1;
    } else if (a.name === 'CN') {
      return -1;
    } else if (b.name === 'CN') {
      return 1;
    } else if (a.name === 'EU') {
      return -1;
    } else if (b.name === 'EU') {
      return 1;
    } else {
      return a.name.localeCompare(b.name);
    }
  });

  return countries;
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

type TComponentsData = {
  id: string;
  name: string;
  date: string;
  unit: string;
  value: number | null;
};

export const sortComponentsForTableOverview = (
  componentsData: TComponentsData[]
): TComponentsData[] => {
  componentsData.sort((a, b) => {
    if (a.name === 'cpi') {
      return -1;
    } else if (b.name === 'cpi') {
      return 1;
    } else {
      return a.name.localeCompare(b.name);
    }
  });

  return componentsData;
};

export const sortSectorsForTableOverview = (
  componentsData: TComponentsData[]
): TComponentsData[] => {
  componentsData.sort((a, b) => {
    if (a.name === 'national') {
      return -1;
    } else if (b.name === 'national') {
      return 1;
    } else {
      return a.name.localeCompare(b.name);
    }
  });

  return componentsData;
};

export const sortYearsForTableOverview = (componentsData: TComponentsData[]): TComponentsData[] => {
  componentsData.sort((a, b) => {
    if (a.name === 'marketingYears') {
      return -1;
    } else if (b.name === 'marketingYears') {
      return 1;
    } else {
      return a.name.localeCompare(b.name);
    }
  });

  return componentsData;
};

export const sortRegionsForTableOverview = (
  componentsData: TComponentsData[]
): TComponentsData[] => {
  componentsData?.sort((a, b) => {
    if (a.name === 'name') {
      return -1;
    } else if (b.name === 'name') {
      return 1;
    } else {
      return a.name.localeCompare(b.name);
    }
  });

  return componentsData;
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

type Unit = {
  name: string;
  value: number | null;
  version?: string;
};

type InputItem = {
  id: string;
  name: string;
  unit: Unit[];
  version?: string;
};

type OutputItem = {
  item: string;
  versionLength: number;
};

export function processVersions(input: InputItem[]): OutputItem[] {
  // Create a map to keep track of the versions for each country
  const versionMap: { [key: string]: Set<string> } = {};

  input.forEach(({ id, unit }) => {
    // Extract the country code (e.g., "us" from "us-bls_v1")
    const countryCode = id.split('_')[0];
    if (!versionMap[countryCode]) {
      versionMap[countryCode] = new Set();
    }

    // Iterate over the unit versions
    unit.forEach(({ version }) => {
      if (version) {
        versionMap[countryCode].add(version);
      }
    });
  });

  // Convert the version map to the desired output format
  const output: OutputItem[] = Object.keys(versionMap).map((countryCode) => {
    return {
      item: countryCode,
      versionLength: versionMap[countryCode].size,
    };
  });

  return output;
}

export type InputItemChips = {
  value: string;
  label: string;
  version: string;
  name?: string;
};

type VersionCountItem = {
  item: string;
  versionLength: number;
};

export function processVersionsChips(inputArray: InputItemChips[]): VersionCountItem[] {
  const versionMap: { [key: string]: Set<string> } = {};

  inputArray?.forEach((item) => {
    const [countryMethod] = item.value.split('_');
    if (!versionMap[countryMethod]) {
      versionMap[countryMethod] = new Set();
    }
    versionMap[countryMethod].add(item.version);
  });

  const result: VersionCountItem[] = Object.keys(versionMap).map((item) => ({
    item,
    versionLength: versionMap[item].size,
  }));

  return result;
}

type VersionLengthItem = {
  item: string;
  versionLength: number;
};

export function checkVersionLength(
  inputItem: InputItem,
  versionLengthArray: VersionLengthItem[]
): boolean {
  // Extract the country code (e.g., "gb" from "gb_v1")
  const countryCode = inputItem.id.split('_')[0].toUpperCase();

  // Find the corresponding entry in the versionLengthArray
  const foundItem = versionLengthArray.find((v) => v.item.toUpperCase() === countryCode);

  // Return true if found and versionLength is greater than 1
  return foundItem ? foundItem.versionLength > 1 : false;
}

export function checkVersionLengthChips(
  value: string,
  versionLengths: VersionCountItem[]
): boolean {
  const [itemMethod] = value.split('_');
  const foundItem = versionLengths.find((item) => item.item === itemMethod);
  return foundItem ? foundItem.versionLength > 1 : false;
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
