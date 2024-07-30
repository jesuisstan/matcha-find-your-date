import { produce } from 'immer';
import { create } from 'zustand';
import { createJSONStorage, devtools, persist, subscribeWithSelector } from 'zustand/middleware';

import { capitalize, kebabToSnake } from '@/utils/format-string';

export type TSmartdataFilters = {
  approach?: string;
  frequency?: string;
  indicator?: string;
  country?: string;
  countries?: string[];
  countries_imports?: string[];
  countries_exports?: string[];
  years?: string[];
  regions?: string[];
  cities?: string[];
  commodity?: string;
  commodity_overview?: string;
  commodities?: string[];
  commodities_regional?: string[];
  overview?: string;
  components?: string[];
  sectors?: string[];
  ports?: string[];
  vessels?: string[];
  topic?: string;
  geoIdHeatmap?: string;
  category?: string;
  vesselsOverview?: string;
  vesselsCountry?: string[];
  years_country?: string[];
  component?: string;
  geoIds?: string[];
  smartdata?: string[];
};

export type TSmartdataCollection = {
  manufacturing_nowcast: TSmartdataFilters;
};

export type TSmartdataStore = {
  smartdata: TSmartdataCollection;

  /* "setValueOfSmartdata" foo is to set value of a smartdata filter.
  Example:
    smartdataKey - "economic-growth";
    filterKey - "approach" (comes with RadioGroup "smartdataFilterKey" prop);
    newValue - "long" (value of the selected RadioOption); */
  setValueOfSmartdata: (
    smartdataKey: string,
    filterKey: string,
    newValue: string,
    country?: string
  ) => void;

  /* "addOneItemToSmartdata" foo is to add one more item to values[] of a smartdata filter.
  Example:
    smartdataKey - "economic-growth";
    itemKey - "countries" (comes with ChipsGroup "smartdataFilterKey" prop);
    newValue - "fr" (value of the selected ChipsOption); */
  addOneItemToSmartdata: (
    smartdataKey: string,
    itemKey: string,
    newValue: string,
    country?: string
  ) => void;

  /* "removeOneItemOfSmartdata" foo is to remove one item from values[] of a smartdata filter. */
  removeOneItemOfSmartdata: (
    smartdataKey: string,
    itemKey: string,
    newValue: string,
    country?: string
  ) => void;

  /* "clearAllItemsOfSmartdata" foo is to remove all items from values[] of a smartdata filter. */
  clearAllItemsOfSmartdata: (smartdata: string, filterKey: string, country?: string) => void;

  /* "getValueOfSmartdata" foo is to get value of a smartdata filter. */
  getValueOfSmartdata: (
    smartdataKey: string,
    filterKey: string,
    country?: string
  ) => string | string[];

  /* "replaceAllItemsOfSmartdata" foo is to replace current values[] of a smartdata with newValue[]. */
  replaceAllItemsOfSmartdata: (
    smartdataKey: string,
    itemKey: string,
    newValue: string[],
    country?: string
  ) => void;

  /* "resetSmartdataStore" foo is to set the Store to initial state. */
  resetSmartdataStore: () => void;
};

// Define your initial state here
const initialSmartdataState: TSmartdataCollection = {
  manufacturing_nowcast: {
    indicator: '',
    frequency: '',
    approach: '',
    countries: [],
  },
};

const useSmartdataFiltersStore = create<TSmartdataStore>()(
  devtools(
    subscribeWithSelector(
      persist(
        (set, get) => ({
          smartdata: initialSmartdataState,

          setValueOfSmartdata: (
            smartdataKey: string,
            filterKey: string,
            newValue: string,
            country?: string
          ) =>
            set(
              produce((draft) => {
                if (!newValue) return; // (!) NO null-able value is acceptable
                // If country is provided and typeof draft.smartdata[smartdataKey][kebabToSnake(filterKey)] is string then create an array of objects with country and subFilter
                if (country) {
                  if (typeof draft.smartdata[smartdataKey][kebabToSnake(filterKey)] === 'string') {
                    draft.smartdata[smartdataKey][kebabToSnake(filterKey)] = [
                      { country, subFilter: newValue },
                    ];
                  } else {
                    if (
                      !draft.smartdata[smartdataKey][kebabToSnake(filterKey)]?.find(
                        (el: any) => el.country === country
                      )
                    ) {
                      draft.smartdata[smartdataKey][kebabToSnake(filterKey)]?.push({
                        country,
                        subFilter: newValue,
                      });
                    } else {
                      let countryIndex = draft.smartdata[smartdataKey][
                        kebabToSnake(filterKey)
                      ]?.findIndex((el: any) => el.country === country);
                      draft.smartdata[smartdataKey][kebabToSnake(filterKey)][countryIndex] = {
                        country,
                        subFilter: newValue,
                      };
                    }
                  }
                } else {
                  draft.smartdata[smartdataKey][kebabToSnake(filterKey)] = newValue;
                }
              }),
              false,
              `set${capitalize(kebabToSnake(filterKey))}`
            ),

          addOneItemToSmartdata: (
            smartdataKey: string,
            filterKey: string,
            newValue: string,
            country?: string
          ) =>
            set(
              produce((draft) => {
                if (!newValue) return; // (!) NO null-able value is acceptable
                if (country) {
                  if (
                    !draft.smartdata[smartdataKey][kebabToSnake(filterKey)]?.find(
                      (el: any) => el.country === country
                    )
                  ) {
                    draft.smartdata[smartdataKey][kebabToSnake(filterKey)]?.push({
                      country,
                      subFilter: [newValue],
                    });
                  } else {
                    draft.smartdata[smartdataKey][kebabToSnake(filterKey)]
                      ?.find((el: any) => el.country === country)
                      ?.subFilter.push(newValue);
                  }
                } else {
                  if (!draft.smartdata[smartdataKey][kebabToSnake(filterKey)]?.includes(newValue)) {
                    draft.smartdata[smartdataKey][kebabToSnake(filterKey)]?.push(newValue);
                  }
                }
              }),
              false,
              `set${capitalize(kebabToSnake(filterKey))}`
            ),

          removeOneItemOfSmartdata: (
            smartdataKey: string,
            filterKey: string,
            newValue: string,
            country?: string
          ) =>
            set(
              produce((draft) => {
                if (country) {
                  const countryIndex = draft.smartdata[smartdataKey][
                    kebabToSnake(filterKey)
                  ]?.findIndex((el: any) => el.country === country);
                  const subFilterIndex = draft.smartdata[smartdataKey][kebabToSnake(filterKey)][
                    countryIndex
                  ].subFilter.findIndex((el: string) => el === newValue);

                  draft.smartdata[smartdataKey][kebabToSnake(filterKey)][
                    countryIndex
                  ].subFilter.splice(subFilterIndex, 1);
                } else {
                  const index = draft.smartdata[smartdataKey][kebabToSnake(filterKey)]?.findIndex(
                    (el: string) => el === newValue
                  );
                  draft.smartdata[smartdataKey][kebabToSnake(filterKey)]?.splice(index, 1);
                }
              }),
              false,
              `set${capitalize(kebabToSnake(filterKey))}`
            ),

          clearAllItemsOfSmartdata: (smartdataKey: string, filterKey: string, country?: string) =>
            set(
              produce((draft) => {
                if (country) {
                  draft.smartdata[smartdataKey][kebabToSnake(filterKey)] = draft.smartdata[
                    smartdataKey
                  ][kebabToSnake(filterKey)].filter(
                    (el: { country: string; subFilter: string[] }) => el.country !== country
                  );
                } else {
                  draft.smartdata[smartdataKey][kebabToSnake(filterKey)] = [];
                }
              }),
              false,
              `set${capitalize(kebabToSnake(filterKey))}`
            ),

          getValueOfSmartdata: (
            smartdataKey: string,
            filterKey: string,
            country?: string
          ): string | string[] => {
            if (country) {
              if (
                typeof get().smartdata[smartdataKey as keyof TSmartdataCollection][
                  kebabToSnake(filterKey) as keyof TSmartdataFilters
                ] === 'string'
              ) {
                return get().smartdata[smartdataKey as keyof TSmartdataCollection][
                  kebabToSnake(filterKey) as keyof TSmartdataFilters
                ] as string;
              }
              return get().smartdata[smartdataKey as keyof TSmartdataCollection][
                kebabToSnake(filterKey) as keyof TSmartdataFilters
                //@ts-ignore
              ]?.find((el: { country: string; subFilter: string[] }) => el?.country === country)
                ?.subFilter;
            } else {
              return get().smartdata[smartdataKey as keyof TSmartdataCollection][
                kebabToSnake(filterKey) as keyof TSmartdataFilters
              ] as string[];
            }
          },

          replaceAllItemsOfSmartdata: (
            smartdataKey: string,
            filterKey: string,
            newValue: string[],
            country?: string
          ) =>
            set(
              produce((draft) => {
                if (!newValue) return; // (!) NO null-able value is acceptable
                if (country) {
                  //replace only for the country and not for the whole filter
                  const countryIndex = draft.smartdata[smartdataKey][
                    kebabToSnake(filterKey)
                  ]?.findIndex((el: any) => el.country === country);
                  draft.smartdata[smartdataKey][kebabToSnake(filterKey)][countryIndex].subFilter =
                    newValue;
                } else {
                  draft.smartdata[smartdataKey][kebabToSnake(filterKey)] = newValue;
                }
              }),
              false,
              `replace${capitalize(kebabToSnake(filterKey))}`
            ),

          resetSmartdataStore: () => {
            set({ smartdata: initialSmartdataState });
          },
        }),
        { name: 'macro-smartdata-filters', storage: createJSONStorage(() => localStorage) }
      )
    ),
    { anonymousActionType: 'filtersActionStore' }
  )
);

export default useSmartdataFiltersStore;
