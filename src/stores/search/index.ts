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
  suggestions: TDateProfile[];
  setSuggestions: (newSuggestions: TDateProfile[]) => void;
  getSuggestionById: (id: string) => TDateProfile | undefined;
  addSuggestion: (newSuggestion: TDateProfile) => void;
  resetSuggestions: () => void;
  updateSuggestion: (updatedUser: Partial<TDateProfile>) => void;

  searchFilters: TSearchFilters;
  setValueOfSearchFilter: (filterKey: string, newValue: string | number) => string | number;
  getValueOfSearchFilter: (filterKey: string) => string | string[] | number;
  addOneItemToSearchFilter: (itemKey: string, newValue: string | number) => void;
  removeOneItemOfSearchFilter: (itemKey: string, valueToRemove: string | number) => void;
  clearAllItemsOfSearchFilter: (filterKey: string) => void;
  replaceAllItemsOfSearchFilter: (itemKey: string, newValue: string[] | number[]) => void;
  resetSearchFilters: () => void;

  resetSearchStore: () => void;
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
  tags: ['english', 'french', 'russian'],
  flirt_factor_min: 42,
};

const useSearchStore = create<TSearchStore>()(
  devtools(
    subscribeWithSelector(
      persist(
        (set, get) => ({
          searchFilters: initialSearchFiltersState,
          suggestions: [],

          setSuggestions: (newSuggestions: TDateProfile[]) => {
            set({ suggestions: newSuggestions });
          },

          getSuggestionById: (id: string) => {
            {
              return get().suggestions.find((suggestion) => suggestion.id === id);
            }
          },

          addSuggestion: (newSuggestion: TDateProfile) => {
            set((state) => ({
              suggestions: [
                ...state.suggestions.filter((suggestion) => suggestion.id !== newSuggestion.id),
                newSuggestion,
              ],
            }));
          },

          // update a suggestion in array if the user exists
          updateSuggestion: (updatedUser: Partial<TDateProfile>) => {
            set((state) => ({
              suggestions: state.suggestions.map((suggestion) =>
                suggestion.id === updatedUser.id ? { ...suggestion, ...updatedUser } : suggestion
              ),
            }));
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

          resetSearchFilters: () => {
            set({ searchFilters: initialSearchFiltersState });
          },

          resetSuggestions: () => {
            set({ suggestions: [] });
          },

          resetSearchStore: () => {
            set({
              searchFilters: initialSearchFiltersState,
              suggestions: [],
            });
          },
        }),
        { name: 'matcha-search-store', storage: createJSONStorage(() => localStorage) }
      )
    ),
    { anonymousActionType: 'searchFiltersActionStore' }
  )
);

export default useSearchStore;
