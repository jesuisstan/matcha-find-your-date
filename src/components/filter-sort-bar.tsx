'use client';

import { useEffect, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';

import clsx from 'clsx';
import {
  ArrowDown10,
  ArrowDownWideNarrow,
  ArrowUp10,
  ArrowUpWideNarrow,
  ListRestart,
} from 'lucide-react';

import SelectMultiple from '@/components/ui/select-dropdown/select-multiple';
import SelectSingle from '@/components/ui/select-dropdown/select-single';
import FiltersBarSkeleton from '@/components/ui/skeletons/filters-bar-skeleton';
import { TDateProfile } from '@/types/date-profile';
import { TSelectorOption } from '@/types/general';
import { TUser } from '@/types/user';
import { haversineDistance } from '@/utils/server/haversine-distance';

interface FilterSortBarProps {
  user: TUser;
  profileSuggestions: TDateProfile[];
  loading: boolean;
  citiesOptions: string[];
  sexOptions?: TSelectorOption[];
  sexPrefsOptions?: TSelectorOption[];
  ageOptions: TSelectorOption[];
  tagsOptions: string[];
  onFilterChange: (filtered: TDateProfile[]) => void;
  onSortChange: (sorted: TDateProfile[]) => void;
}

const FilterSortBar = ({
  user,
  profileSuggestions,
  loading,
  citiesOptions,
  sexOptions,
  sexPrefsOptions,
  ageOptions,
  tagsOptions,
  onFilterChange,
  onSortChange,
}: FilterSortBarProps) => {
  const t = useTranslations();

  // State to store the currently selected sorting criterion and order
  const [sortCriterion, setSortCriterion] = useState<
    'raiting' | 'location' | 'age' | 'tags' | null
  >(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | null>(null);

  const [filterCities, setFilterCities] = useState<string[]>(citiesOptions);
  const [filterRaiting, setFilterRaiting] = useState('0');
  const [filterAge, setFilterAge] = useState('0');
  const [filterSex, setFilterSex] = useState('0');
  const [filterSexPreferences, setFilterSexPreferences] = useState('0');
  const [filterTags, setFilterTags] = useState<string[]>(tagsOptions);
  const [filterOnline, setFilterOnline] = useState('0');

  // Function to apply all filters to profileSuggestions
  const filteredSuggestions = useMemo(() => {
    return profileSuggestions.filter((dateProfile) => {
      const age = dateProfile.age;

      const matchesAge =
        filterAge === '0' ||
        (filterAge === '1' && age >= 18 && age <= 24) ||
        (filterAge === '2' && age >= 25 && age <= 34) ||
        (filterAge === '3' && age >= 35 && age <= 44) ||
        (filterAge === '4' && age >= 45 && age <= 54) ||
        (filterAge === '5' && age >= 55);

      const matchesSex = filterSex === '0' || dateProfile.sex === filterSex;
      const matchesSexPreferences =
        filterSexPreferences === '0' || dateProfile.sex_preferences === filterSexPreferences;

      const matchesRating =
        filterRaiting === '0' ||
        (filterRaiting === '1' && dateProfile.raiting >= 40) ||
        (filterRaiting === '2' && dateProfile.raiting >= 60) ||
        (filterRaiting === '3' && dateProfile.raiting >= 80);

      const matchesOnline = filterOnline === '0' || dateProfile.online === true;
      const matchesCity = filterCities.includes(dateProfile.address);
      const matchesTags = filterTags.some((tag) => dateProfile.tags.includes(tag));

      return (
        matchesAge &&
        matchesSex &&
        matchesSexPreferences &&
        matchesRating &&
        matchesTags &&
        matchesOnline &&
        matchesCity
      );
    });
  }, [
    profileSuggestions,
    filterAge,
    filterSex,
    filterSexPreferences,
    filterRaiting,
    filterTags,
    filterOnline,
    filterCities,
  ]);

  // Sorting function
  const sortedSuggestions = useMemo(() => {
    if (!sortCriterion || !sortOrder) {
      return filteredSuggestions;
    }

    return [...filteredSuggestions].sort((a, b) => {
      let compareValue = 0;
      switch (sortCriterion) {
        case 'raiting':
          compareValue = a.raiting - b.raiting;
          break;
        case 'age':
          compareValue = a.age - b.age;
          break;
        case 'tags':
          compareValue = a.tags_in_common - b.tags_in_common;
          break;
        case 'location':
          const distanceA = haversineDistance(
            user?.latitude!,
            user?.longitude!,
            a.latitude,
            a.longitude
          );
          const distanceB = haversineDistance(
            user?.latitude!,
            user?.longitude!,
            b.latitude,
            b.longitude
          );
          compareValue = distanceA - distanceB;
          break;
      }
      return sortOrder === 'asc' ? compareValue : -compareValue;
    });
  }, [filteredSuggestions, sortCriterion, sortOrder]);

  // Update parent state with filtered and sorted results after render phase
  useEffect(() => {
    onFilterChange(filteredSuggestions);
    onSortChange(sortedSuggestions);
  }, [filteredSuggestions, sortedSuggestions, onFilterChange, onSortChange]);

  // Reset all filters and sorting
  const resetFiltersAndSorting = () => {
    setFilterAge('0');
    setFilterSex('0');
    setFilterSexPreferences('0');
    setFilterRaiting('0');
    setFilterTags(tagsOptions);
    setFilterOnline('0');
    setFilterCities(citiesOptions);
    setSortCriterion(null);
    setSortOrder(null);
  };

  // Handler to set sorting
  const handleSort = (
    criterion: 'raiting' | 'location' | 'age' | 'tags',
    order: 'asc' | 'desc'
  ) => {
    if (sortCriterion === criterion && sortOrder === order) {
      // Toggle off sorting if clicked again
      setSortCriterion(null);
      setSortOrder(null);
    } else {
      setSortCriterion(criterion);
      setSortOrder(order);
    }
  };

  return (
    <div className="flex flex-col items-stretch gap-4 xs:flex-row ">
      {/* FILTER BAR */}
      {loading ? (
        <FiltersBarSkeleton />
      ) : (
        <div className="flex w-full flex-col flex-wrap items-center justify-center gap-5 overflow-hidden text-ellipsis rounded-2xl bg-card p-4">
          <div className="flex flex-row items-center justify-center gap-2 self-center align-middle">
            <h2 className="max-w-96 truncate text-wrap text-lg font-semibold xs:max-w-fit">
              {t(`filter-sort-suggestions`)}
            </h2>
            {' / '}
            {/* Reset Filters and Sorting */}
            <div className="flex items-center justify-center self-center align-middle">
              <div
                className="group relative flex cursor-pointer flex-row items-center justify-center rounded-full align-middle text-foreground smooth42transition hover:bg-transparent hover:text-c42orange"
                onClick={resetFiltersAndSorting}
              >
                <ListRestart size={20} />
                <div className="absolute -bottom-3 z-50 hidden w-fit transform text-nowrap rounded-2xl border bg-foreground/90 px-1 text-xs text-background group-hover:block">
                  {t('reset-filters-sorting')}
                </div>
              </div>
            </div>
          </div>
          <div className="flex w-full flex-row flex-wrap items-center justify-center gap-5 overflow-hidden text-ellipsis">
            {/* Sex Filter */}
            {sexOptions && (
              <SelectSingle
                options={sexOptions}
                defaultValue="0"
                label={t('sex') + ':'}
                selectedItem={filterSex}
                setSelectedItem={setFilterSex}
                disabled={loading}
              />
            )}

            {/* Sex Preferences Filter */}
            {sexPrefsOptions && (
              <SelectSingle
                options={sexPrefsOptions}
                defaultValue="0"
                label={t('sexual-preferences') + ':'}
                selectedItem={filterSexPreferences}
                setSelectedItem={setFilterSexPreferences}
                disabled={loading}
              />
            )}

            <div className="flex flex-row items-end gap-1">
              {/* Age Filter */}
              <SelectSingle
                options={ageOptions}
                defaultValue="1"
                label={t('age') + ':'}
                selectedItem={filterAge}
                setSelectedItem={setFilterAge}
                disabled={loading}
              />
              {/* Age Sorter */}
              <div className="flex flex-col gap-1">
                <div
                  title={t('sort-ascending')}
                  className={clsx(
                    'cursor-pointer rounded-full smooth42transition hover:text-c42orange',
                    sortCriterion === 'age' && sortOrder === 'asc' && 'text-c42orange'
                  )}
                  onClick={() => handleSort('age', 'asc')}
                >
                  <ArrowUpWideNarrow size={20} />
                </div>
                <div
                  title={t('sort-descending')}
                  className={clsx(
                    'cursor-pointer rounded-full smooth42transition hover:text-c42orange',
                    sortCriterion === 'age' && sortOrder === 'desc' && 'text-c42orange'
                  )}
                  onClick={() => handleSort('age', 'desc')}
                >
                  <ArrowDownWideNarrow size={20} />
                </div>
              </div>
            </div>

            <div className="flex flex-row items-end gap-1">
              {/* Raiting Filter */}
              <SelectSingle
                options={[
                  { value: '0', label: t('selector.select-all') },
                  { value: '1', label: '>= 40' },
                  { value: '2', label: '>= 60' },
                  { value: '3', label: '>= 80' },
                ]}
                defaultValue="0"
                label={t('raiting') + ':'}
                selectedItem={filterRaiting}
                setSelectedItem={setFilterRaiting}
                disabled={loading}
              />
              {/* Raiting Sorter */}
              <div className="flex flex-col gap-1">
                <div
                  title={t('sort-ascending')}
                  className={clsx(
                    'cursor-pointer rounded-full smooth42transition hover:text-c42orange',
                    sortCriterion === 'raiting' && sortOrder === 'asc' && 'text-c42orange'
                  )}
                  onClick={() => handleSort('raiting', 'asc')}
                >
                  <ArrowUpWideNarrow size={20} />
                </div>
                <div
                  title={t('sort-descending')}
                  className={clsx(
                    'cursor-pointer rounded-full smooth42transition hover:text-c42orange',
                    sortCriterion === 'raiting' && sortOrder === 'desc' && 'text-c42orange'
                  )}
                  onClick={() => handleSort('raiting', 'desc')}
                >
                  <ArrowDownWideNarrow size={20} />
                </div>
              </div>
            </div>

            {/* Online Filter */}
            <SelectSingle
              label={t('status') + ':'}
              options={[
                { value: '0', label: t('selector.select-all') },
                { value: '1', label: t('online-only') },
              ]}
              defaultValue="0"
              selectedItem={filterOnline}
              setSelectedItem={setFilterOnline}
              disabled={loading}
            />

            <div className="flex flex-row flex-wrap items-center justify-center gap-5">
              <div className="flex flex-row items-end gap-1">
                {/* Tags Filter */}
                <SelectMultiple
                  label={'#' + t(`tags.tags`) + ':'}
                  options={tagsOptions}
                  defaultValues={[]}
                  selectedItems={filterTags}
                  setSelectedItems={setFilterTags}
                  translator="tags"
                />
                {/* Tags Sorter */}
                <div className="flex flex-col gap-1">
                  <div
                    title={t('sort-ascending') + ' ' + t('by-tags-matches')}
                    className={clsx(
                      'cursor-pointer rounded-full smooth42transition hover:text-c42orange',
                      sortCriterion === 'tags' && sortOrder === 'asc' && 'text-c42orange'
                    )}
                    onClick={() => handleSort('tags', 'asc')}
                  >
                    <ArrowUp10 size={20} />
                  </div>
                  <div
                    title={t('sort-descending') + ' ' + t('by-tags-matches')}
                    className={clsx(
                      'cursor-pointer rounded-full smooth42transition hover:text-c42orange',
                      sortCriterion === 'tags' && sortOrder === 'desc' && 'text-c42orange'
                    )}
                    onClick={() => handleSort('tags', 'desc')}
                  >
                    <ArrowDown10 size={20} />
                  </div>
                </div>
              </div>

              <div className="flex flex-row items-end gap-1">
                {/* Cities Filter */}
                {citiesOptions && citiesOptions.length > 0 && (
                  <SelectMultiple
                    label={t(`city`) + ':'}
                    options={citiesOptions}
                    defaultValues={[]}
                    selectedItems={filterCities}
                    setSelectedItems={setFilterCities!}
                    avoidTranslation
                  />
                )}
                {/* Location Sorter */}
                {citiesOptions && citiesOptions.length > 0 && (
                  <div className="flex flex-col gap-1">
                    <div
                      title={t('sort-ascending') + ' ' + t('by-distance')}
                      className={clsx(
                        'cursor-pointer rounded-full smooth42transition hover:text-c42orange',
                        sortCriterion === 'location' && sortOrder === 'asc' && 'text-c42orange'
                      )}
                      onClick={() => handleSort('location', 'asc')}
                    >
                      <ArrowUp10 size={20} />
                    </div>
                    <div
                      title={t('sort-descending') + ' ' + t('by-distance')}
                      className={clsx(
                        'cursor-pointer rounded-full smooth42transition hover:text-c42orange',
                        sortCriterion === 'location' && sortOrder === 'desc' && 'text-c42orange'
                      )}
                      onClick={() => handleSort('location', 'desc')}
                    >
                      <ArrowDown10 size={20} />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterSortBar;
