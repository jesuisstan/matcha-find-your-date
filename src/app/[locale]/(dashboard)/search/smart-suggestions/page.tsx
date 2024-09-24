'use client';

import { useEffect, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';

import clsx from 'clsx';
import {
  ArrowDown10,
  ArrowDownWideNarrow,
  ArrowUp10,
  ArrowUpWideNarrow,
  Frown,
  ListRestart,
  RefreshCw,
} from 'lucide-react';

import ModalProfileWarning from '@/components/modals/modal-profile-warning';
import { ButtonMatcha } from '@/components/ui/button-matcha';
import SelectMultiple from '@/components/ui/select-dropdown/select-multiple';
import SelectSingle from '@/components/ui/select-dropdown/select-single';
import FiltersBarSkeleton from '@/components/ui/skeletons/filters-bar-skeleton';
import SuggestionsSkeleton from '@/components/ui/skeletons/suggestions-skeleton';
import ProfileCardWrapper from '@/components/wrappers/profile-card-wrapper';
import useSearchStore from '@/stores/search';
import useUserStore from '@/stores/user';
import { TSelectorOption } from '@/types/general';
import { calculateAge } from '@/utils/format-string';

const SmartSuggestions = () => {
  const t = useTranslations();
  const { user, setUser, globalLoading } = useUserStore();
  const { smartSuggestions, setSmartSuggestions } = useSearchStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // State to store the currently selected sorting criterion and order
  const [sortCriterion, setSortCriterion] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | null>(null);

  const [ageOptions, setAgeOptions] = useState<TSelectorOption[]>([
    { value: '0', label: t('selector.select-all') },
    { value: '1', label: '18-24' },
    { value: '2', label: '25-34' },
    { value: '3', label: '35-44' },
    { value: '4', label: '45-54' },
    { value: '5', label: '55+' },
  ]);
  const [sexOptions, setSexOptions] = useState<TSelectorOption[]>([
    { value: '0', label: t('selector.select-all') },
    { value: 'male', label: t('male') },
    { value: 'female', label: t('female') },
  ]);
  const [sexPrefsOptions, setSexPrefsOptions] = useState<TSelectorOption[]>([
    { value: '0', label: t('selector.select-all') },
    { value: 'men', label: t('selector.men') },
    { value: 'women', label: t('selector.women') },
    { value: 'bisexual', label: t('selector.bisexual') },
  ]);
  const [citiesOptions, setCitiesOptions] = useState([] as string[]);

  const [filterCities, setFilterCities] = useState([] as string[]); // Filter by cities
  const [filterRaiting, setFilterRaiting] = useState('0'); // Filter by raiting
  const [filterAge, setFilterAge] = useState('0'); // Filter by age
  const [filterSex, setFilterSex] = useState('0'); // Filter by sex
  const [filterSexPreferences, setFilterSexPreferences] = useState('0'); // Filter by sex preferences
  const [filterTags, setFilterTags] = useState(user?.tags || ([] as string[])); // Filter by user's tags
  const [filterOnline, setFilterOnline] = useState('0'); // Filter by online status

  const fetchSmartSuggestions = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/search/smart-suggestions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user?.id,
          latitude: user?.latitude,
          longitude: user?.longitude,
          sex: user?.sex,
          sexPreferences: user?.sex_preferences || 'bisexual',
          tags: user?.tags || [],
        }),
      });

      const result = await response.json();
      if (response.ok) {
        setSmartSuggestions(result.matchingUsers);
        setUser({ ...user, ...result.updatedUserData });

        // Calculate ages based on birthdates and categorize them
        const uniqueAges = result.matchingUsers.map((u: any) => calculateAge(u.birthdate));

        const uniqueAgeRanges = {
          '1': uniqueAges.filter((age: number) => age >= 18 && age <= 24).length > 0,
          '2': uniqueAges.filter((age: number) => age >= 25 && age <= 34).length > 0,
          '3': uniqueAges.filter((age: number) => age >= 35 && age <= 44).length > 0,
          '4': uniqueAges.filter((age: number) => age >= 45 && age <= 54).length > 0,
          '5': uniqueAges.filter((age: number) => age >= 55).length > 0,
        };

        // Update ageOptions to disable ranges that are not present
        setAgeOptions((prevOptions) =>
          prevOptions.map((option) => ({
            ...option,
            disabled:
              option.value !== '0' &&
              !uniqueAgeRanges[option.value as keyof typeof uniqueAgeRanges],
          }))
        );

        // Process unique values for sex, sex_preferences, and cities as strings
        const uniqueSexOptions = Array.from(
          new Set(result.matchingUsers.map((u: any) => u.sex as string))
        );
        const uniqueSexPrefsOptions = Array.from(
          new Set(result.matchingUsers.map((u: any) => u.sex_preferences as string))
        );
        const uniqueCitiesOptions = Array.from(
          new Set(result.matchingUsers.map((u: any) => u.address as string))
        ) as string[];

        // Update the options state, disabling unavailable options
        setSexOptions((prevOptions) =>
          prevOptions.map((option) => ({
            ...option,
            disabled: !uniqueSexOptions.includes(option.value) && option.value !== '0',
          }))
        );

        setSexPrefsOptions((prevOptions) =>
          prevOptions.map((option) => ({
            ...option,
            disabled: !uniqueSexPrefsOptions.includes(option.value) && option.value !== '0',
          }))
        );

        setCitiesOptions(uniqueCitiesOptions);
        setFilterCities(uniqueCitiesOptions);
      } else {
        setError(result.error ? result.error : 'error-fetching-suggestions');
      }
    } catch (error) {
      setError(String(error));
    } finally {
      setLoading(false);
    }
  };

  // Function to apply all filters to smartSuggestions
  const filteredSuggestions = useMemo(() => {
    return smartSuggestions.filter((dateProfile) => {
      const age = calculateAge(dateProfile.birthdate);

      const matchesAge =
        filterAge === '0' || // Select all
        (filterAge === '1' && age >= 18 && age <= 24) ||
        (filterAge === '2' && age >= 25 && age <= 34) ||
        (filterAge === '3' && age >= 35 && age <= 44) ||
        (filterAge === '4' && age >= 45 && age <= 54) ||
        (filterAge === '5' && age >= 55);

      const matchesSex = filterSex === '0' || dateProfile.sex === filterSex;
      const matchesSexPreferences =
        filterSexPreferences === '0' || dateProfile.sex_preferences === filterSexPreferences;

      // Logic to match the raiting thresholds (>= 40, >= 60, >= 80)
      const matchesRating =
        filterRaiting === '0' || // Select all
        (filterRaiting === '1' && dateProfile.raiting >= 40) ||
        (filterRaiting === '2' && dateProfile.raiting >= 60) ||
        (filterRaiting === '3' && dateProfile.raiting >= 80);
      const matchesOnline = filterOnline === '0' || dateProfile.online === true;
      const matchesCity = filterCities.includes(dateProfile.address);

      // And at least one tag should match
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
    smartSuggestions,
    filterAge,
    filterSex,
    filterSexPreferences,
    filterRaiting,
    filterTags,
    filterOnline,
    filterCities,
  ]);

  // Sorting function for selected criterion
  const sortSuggestions = (suggestions: any[], criterion: string, order: 'desc' | 'asc') => {
    if (order === 'desc') {
      switch (criterion) {
        case 'raiting':
          return [...suggestions].sort((a, b) => b.raiting - a.raiting);
        case 'age':
          return [...suggestions].sort(
            (a, b) => calculateAge(b.birthdate) - calculateAge(a.birthdate)
          );
        case 'online':
          return [...suggestions].sort((a, b) => (b.online ? 1 : -1)); // Corrected for online: true first
        case 'tags':
          return [...suggestions].sort((a, b) => {
            const matchesA = user?.tags.filter((tag) => a.tags.includes(tag)).length || 0;
            const matchesB = user?.tags.filter((tag) => b.tags.includes(tag)).length || 0;
            return matchesB - matchesA; // Sort by descending tag matches
          });
        case 'cities':
          return [...suggestions].sort((a, b) => {
            const matchesA = filterCities.filter((city) => a.address === city).length || 0;
            const matchesB = filterCities.filter((city) => b.address === city).length || 0;
            return matchesB - matchesA; // Sort by descending city matches
          });
        default:
          return suggestions;
      }
    } else {
      switch (criterion) {
        case 'raiting':
          return [...suggestions].sort((a, b) => a.raiting - b.raiting);
        case 'age':
          return [...suggestions].sort(
            (a, b) => calculateAge(a.birthdate) - calculateAge(b.birthdate)
          );
        case 'online':
          return [...suggestions].sort((a, b) => (b.online ? -1 : 1)); // Corrected for offline first
        case 'tags':
          return [...suggestions].sort((a, b) => {
            const matchesA = user?.tags.filter((tag) => a.tags.includes(tag)).length || 0;
            const matchesB = user?.tags.filter((tag) => b.tags.includes(tag)).length || 0;
            return matchesA - matchesB; // Sort by ascending tag matches
          });
        case 'cities':
          return [...suggestions].sort((a, b) => {
            const matchesA = filterCities.filter((city) => a.address === city).length || 0;
            const matchesB = filterCities.filter((city) => b.address === city).length || 0;
            return matchesA - matchesB; // Sort by ascending city matches
          });
        default:
          return suggestions;
      }
    }
  };

  // Apply the sorting on filtered suggestions
  const sortedSuggestions = useMemo(() => {
    if (!sortCriterion || !sortOrder) return filteredSuggestions;
    return sortSuggestions(filteredSuggestions, sortCriterion, sortOrder);
  }, [filteredSuggestions, sortCriterion, sortOrder]);

  // Reset all filters and sorting
  const resetFiltersAndSorting = () => {
    setFilterAge('0');
    setFilterSex('0');
    setFilterSexPreferences('0');
    setFilterRaiting('0');
    setFilterTags(user?.tags || ([] as string[]));
    setFilterOnline('0');
    setFilterCities(citiesOptions);
    setSortCriterion(null);
    setSortOrder(null);
  };

  // Handler to set sorting
  const handleSort = (criterion: string, order: 'asc' | 'desc') => {
    if (sortCriterion === criterion && sortOrder === order) {
      // Toggle off sorting if clicked again
      setSortCriterion(null);
      setSortOrder(null);
    } else {
      setSortCriterion(criterion);
      setSortOrder(order);
    }
  };

  useEffect(() => {
    if (user) fetchSmartSuggestions();
  }, []);

  return (
    <div>
      {user && <ModalProfileWarning user={user} />}
      {/* HEADER */}
      <div className={clsx('mb-4 flex items-center justify-between')}>
        <div className="flex min-w-full flex-col justify-start">
          <div className="mb-2 flex w-fit flex-wrap smooth42transition">
            <h1 className="max-w-96 truncate text-wrap p-2 text-4xl font-bold xs:max-w-fit">
              {t(`search.smart-suggestions`)}
            </h1>
          </div>
          <div className="mb-2 flex flex-col items-stretch justify-center gap-2 align-middle xs:flex-row">
            <div className="w-full min-w-28 flex-col items-center justify-center self-center overflow-hidden text-ellipsis rounded-2xl bg-card px-4 py-1">
              <p className="text-left text-sm italic">{t(`use-smart-suggestions`)}</p>
            </div>
            <div className="flex items-center justify-center text-c42orange">
              <ButtonMatcha
                size="default"
                disabled={!user || loading}
                title={t(`search.refresh-suggestions`)}
                onClick={fetchSmartSuggestions}
                loading={loading}
                className="min-w-40"
              >
                <div className="flex flex-row items-center space-x-3">
                  <div>
                    <RefreshCw size={20} />
                  </div>
                  <span>{t('refresh')}</span>
                </div>
              </ButtonMatcha>
            </div>
          </div>

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
                      onClick={resetFiltersAndSorting}
                      className="cursor-pointer rounded-full smooth42transition hover:text-c42orange"
                      title={t('reset-filters-sorting')}
                    >
                      <ListRestart size={20} />
                    </div>
                  </div>
                </div>
                <div className="flex w-full flex-row flex-wrap items-center justify-center gap-5 overflow-hidden text-ellipsis">
                  {/* Sex Filter */}
                  <SelectSingle
                    options={sexOptions}
                    defaultValue="0"
                    label={t('sex') + ':'}
                    selectedItem={filterSex}
                    setSelectedItem={setFilterSex}
                    disabled={loading}
                  />

                  {/* Sex Preferences Filter */}
                  <SelectSingle
                    options={sexPrefsOptions}
                    defaultValue="0"
                    label={t('sexual-preferences') + ':'}
                    selectedItem={filterSexPreferences}
                    setSelectedItem={setFilterSexPreferences}
                    disabled={loading}
                  />

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
                        options={user?.tags || []}
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
                      {/* Cities Sorter */}
                      {citiesOptions && citiesOptions.length > 0 && (
                        <div className="flex flex-col gap-1">
                          <div
                            title={t('sort-ascending')}
                            className={clsx(
                              'cursor-pointer rounded-full smooth42transition hover:text-c42orange',
                              sortCriterion === 'cities' && sortOrder === 'asc' && 'text-c42orange'
                            )}
                            onClick={() => handleSort('cities', 'asc')}
                          >
                            <ArrowUpWideNarrow size={20} />
                          </div>
                          <div
                            title={t('sort-descending')}
                            className={clsx(
                              'cursor-pointer rounded-full smooth42transition hover:text-c42orange',
                              sortCriterion === 'cities' && sortOrder === 'desc' && 'text-c42orange'
                            )}
                            onClick={() => handleSort('cities', 'desc')}
                          >
                            <ArrowDownWideNarrow size={20} />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      {loading || globalLoading || !user ? (
        <SuggestionsSkeleton />
      ) : sortedSuggestions.length === 0 || error ? (
        <div className="w-full min-w-28 flex-col items-center justify-center overflow-hidden text-ellipsis rounded-2xl bg-card p-4">
          <div className="m-5 flex items-center justify-center smooth42transition hover:scale-150">
            <Frown size={84} />
          </div>
          <p className="text-center text-lg">
            {error ? t(`${error}`) : t(`search.no-suggestions`)}
          </p>
        </div>
      ) : (
        <div className="flex flex-row flex-wrap items-center justify-center gap-5 smooth42transition">
          {sortedSuggestions.map((dateProfile: any, index: number) => (
            <ProfileCardWrapper key={`${dateProfile.id}-${index}`} profile={dateProfile} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SmartSuggestions;
