import { produce } from 'immer';
import { create } from 'zustand';
import { createJSONStorage, devtools, persist, subscribeWithSelector } from 'zustand/middleware';

import { TDateProfile } from '@/types/date-profile';
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

export type TSearchStore = {
  searchFilters: TSearchFilters;
  smartSuggestions: TDateProfile[];
  setSmartSuggestions: (newSuggestions: TDateProfile[]) => void;
  setValueOfSearchFilter: (filterKey: string, newValue: string | number) => string | number;
  getValueOfSearchFilter: (filterKey: string) => string | string[] | number;
  addOneItemToSearchFilter: (itemKey: string, newValue: string | number) => void;
  removeOneItemOfSearchFilter: (itemKey: string, valueToRemove: string | number) => void;
  clearAllItemsOfSearchFilter: (filterKey: string) => void;
  replaceAllItemsOfSearchFilter: (itemKey: string, newValue: string[] | number[]) => void;
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
  distance: 10,
  tags: [],
  flirt_factor_min: 42,
};

const useSearchStore = create<TSearchStore>()(
  devtools(
    subscribeWithSelector(
      persist(
        (set, get) => ({
          searchFilters: initialSearchFiltersState,
          smartSuggestions: [],

          setSmartSuggestions: (newSuggestions: TDateProfile[]) => {
            set({ smartSuggestions: newSuggestions });
          },

          setValueOfSearchFilter: (
            filterKey: string,
            newValue: string | number
          ): string | number => {
            set(
              produce((draft) => {
                draft.searchFilters[filterKey] = newValue || '';
              }),
              false,
              `set${capitalize(filterKey)}`
            );

            return newValue || '';
          },

          addOneItemToSearchFilter: (filterKey: string, newValue: string | number) =>
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

          removeOneItemOfSearchFilter: (filterKey: string, valueToRemove: string | number) =>
            set(
              produce((draft) => {
                {
                  const index = draft.searchFilters[filterKey]?.findIndex(
                    (el: string) => el === valueToRemove
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

          replaceAllItemsOfSearchFilter: (filterKey: string, newValue: string[] | number[]) =>
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
        { name: 'matcha-search-store', storage: createJSONStorage(() => localStorage) }
      )
    ),
    { anonymousActionType: 'searchFiltersActionStore' }
  )
);

export default useSearchStore;
