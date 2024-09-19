import { produce } from 'immer';
import { create } from 'zustand';
import { createJSONStorage, devtools, persist, subscribeWithSelector } from 'zustand/middleware';

import { capitalize } from '@/utils/format-string';

export type TSearchFilters = {
  sex: string;
  age_min: number;
  age_max: number;
  sex_preferences: string;
  latitude: number;
  longitude: number;
  address: string;
  distance: number;
  tags: string[];
  flirt_factor_min: number;
};

export type TSearchFiltersStore = {
  searchFilters: TSearchFilters;

  setValueOfSearchFilter: (filterKey: string, newValue: string) => void;

  addOneItemToSearchFilter: (itemKey: string, newValue: string) => void;

  removeOneItemOfSearchFilter: (itemKey: string, newValue: string) => void;

  clearAllItemsOfSearchFilter: (filterKey: string) => void;

  getValueOfSearchFilter: (filterKey: string) => string | string[] | number;

  replaceAllItemsOfSearchFilter: (itemKey: string, newValue: string[]) => void;

  resetSearchFiltersStore: () => void;
};

// initial state
const initialSearchFiltersState: TSearchFilters = {
  sex: '',
  age_min: 18,
  age_max: 69,
  sex_preferences: 'bisexual',
  latitude: 0,
  longitude: 0,
  address: '',
  distance: 42,
  tags: [],
  flirt_factor_min: 42,
};

const useSearchFiltersStore = create<TSearchFiltersStore>()(
  devtools(
    subscribeWithSelector(
      persist(
        (set, get) => ({
          searchFilters: initialSearchFiltersState,

          setValueOfSearchFilter: (filterKey: string, newValue: string) =>
            set(
              produce((draft) => {
                if (!newValue) return; // (!) NO null-able value is acceptable
                {
                  draft.searchFilters[filterKey] = newValue;
                }
              }),
              false,
              `set${capitalize(filterKey)}`
            ),

          addOneItemToSearchFilter: (filterKey: string, newValue: string) =>
            set(
              produce((draft) => {
                if (!newValue) return; // (!) NO null-able value is acceptable
                {
                  if (!draft.searchFilters[filterKey]?.includes(newValue)) {
                    draft.searchFilters[filterKey]?.push(newValue);
                  }
                }
              }),
              false,
              `set${capitalize(filterKey)}`
            ),

          removeOneItemOfSearchFilter: (filterKey: string, newValue: string) =>
            set(
              produce((draft) => {
                {
                  const index = draft.searchFilters[filterKey]?.findIndex(
                    (el: string) => el === newValue
                  );
                  draft.searchFilters[filterKey]?.splice(index, 1);
                }
              }),
              false,
              `set${capitalize(filterKey)}`
            ),

          clearAllItemsOfSearchFilter: (filterKey: string) =>
            set(
              produce((draft) => {
                {
                  draft.searchFilters[filterKey] = [];
                }
              }),
              false,
              `set${capitalize(filterKey)}`
            ),

          getValueOfSearchFilter: (filterKey: string) => {
            {
              return get().searchFilters[filterKey as keyof TSearchFilters] as string[];
            }
          },

          replaceAllItemsOfSearchFilter: (filterKey: string, newValue: string[]) =>
            set(
              produce((draft) => {
                if (!newValue) return; // (!) NO null-able value is acceptable
                {
                  draft.searchFilters[filterKey] = newValue;
                }
              }),
              false,
              `replace${capitalize(filterKey)}`
            ),

          resetSearchFiltersStore: () => {
            set({ searchFilters: initialSearchFiltersState });
          },
        }),
        { name: 'matcha-search-filters', storage: createJSONStorage(() => localStorage) }
      )
    ),
    { anonymousActionType: 'filtersActionStore' }
  )
);

export default useSearchFiltersStore;
