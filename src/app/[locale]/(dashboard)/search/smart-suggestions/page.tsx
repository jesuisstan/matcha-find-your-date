'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

import clsx from 'clsx';
import { Frown, RefreshCw } from 'lucide-react';

import FilterSortBar from '@/components/filter-sort-bar';
import ModalProfileWarning from '@/components/modals/modal-profile-warning';
import { ButtonMatcha } from '@/components/ui/button-matcha';
import FiltersBarSkeleton from '@/components/ui/skeletons/filters-bar-skeleton';
import SuggestionsSkeleton from '@/components/ui/skeletons/suggestions-skeleton';
import ProfileCardWrapper from '@/components/wrappers/profile-card-wrapper';
import useSearchStore from '@/stores/search';
import useUserStore from '@/stores/user';
import { TDateProfile } from '@/types/date-profile';
import { TSelectorOption } from '@/types/general';
import { calculateAge } from '@/utils/format-string';

const SmartSuggestions = () => {
  const t = useTranslations();
  const { user, setUser, globalLoading } = useUserStore();
  const { smartSuggestions, setSmartSuggestions } = useSearchStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [filteredSuggestions, setFilteredSuggestions] = useState<TDateProfile[]>([]);
  const [sortedSuggestions, setSortedSuggestions] = useState<TDateProfile[]>([]);

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
        const uniqueAges: number[] = [];
        const uniqueAgeRanges: Record<string, boolean> = {
          '1': false,
          '2': false,
          '3': false,
          '4': false,
          '5': false,
        };
        const uniqueSexOptions = new Set<string>();
        const uniqueSexPrefsOptions = new Set<string>();
        const uniqueCitiesOptions = new Set<string>();

        // Single iteration to process age, tags_in_common, and collect unique values
        const matchingUsers = result.matchingUsers.map((u: any) => {
          const age = calculateAge(u.birthdate);
          const tagsInCommon = user?.tags.filter((tag) => u.tags.includes(tag)).length || 0;

          // Add unique values
          uniqueAges.push(age);
          uniqueSexOptions.add(u.sex);
          uniqueSexPrefsOptions.add(u.sex_preferences);
          uniqueCitiesOptions.add(u.address);

          // Track age ranges
          if (age >= 18 && age <= 24) uniqueAgeRanges['1'] = true;
          if (age >= 25 && age <= 34) uniqueAgeRanges['2'] = true;
          if (age >= 35 && age <= 44) uniqueAgeRanges['3'] = true;
          if (age >= 45 && age <= 54) uniqueAgeRanges['4'] = true;
          if (age >= 55) uniqueAgeRanges['5'] = true;

          return {
            ...u,
            age,
            tags_in_common: tagsInCommon,
          };
        });

        setSmartSuggestions(matchingUsers);
        setUser({ ...user, ...result.user });

        // Update filter options based on unique values
        setAgeOptions((prevOptions) =>
          prevOptions.map((option) => ({
            ...option,
            disabled:
              option.value !== '0' &&
              !uniqueAgeRanges[option.value as keyof typeof uniqueAgeRanges],
          }))
        );

        setSexOptions((prevOptions) =>
          prevOptions.map((option) => ({
            ...option,
            disabled: !uniqueSexOptions.has(option.value) && option.value !== '0',
          }))
        );

        setSexPrefsOptions((prevOptions) =>
          prevOptions.map((option) => ({
            ...option,
            disabled: !uniqueSexPrefsOptions.has(option.value) && option.value !== '0',
          }))
        );

        setCitiesOptions(Array.from(uniqueCitiesOptions));
      } else {
        setError(result.error ? result.error : 'error-fetching-suggestions');
      }
    } catch (error) {
      setError(String(error));
    } finally {
      setLoading(false);
    }
  };

  // Handle the filtered suggestions (from FilterSortBar)
  const handleFilterChange = (filtered: TDateProfile[]) => {
    setFilteredSuggestions(filtered);
    //setSortedSuggestions(filtered); // Reset sorted suggestions when filters change
  };

  // Handle the sorted suggestions (from FilterSortBar)
  const handleSortChange = (sorted: TDateProfile[]) => {
    setSortedSuggestions(sorted);
  };

  useEffect(() => {
    if (user) fetchSmartSuggestions();
  }, []);

  return (
    <div>
      {user && <ModalProfileWarning user={user} />}
      <div className={clsx('mb-4 flex items-center justify-between')}>
        <div className="flex min-w-full flex-col justify-start">
          {/* HEADER */}
          <div className="mb-2 flex w-fit flex-wrap smooth42transition">
            <h1 className="max-w-96 truncate text-wrap p-2 text-4xl font-bold xs:max-w-fit">
              {t(`search.smart-suggestions`)}
            </h1>
          </div>

          {/* SUBHEADER */}
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
                className="min-w-36"
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

          {loading || !user ? (
            <FiltersBarSkeleton />
          ) : (
            <FilterSortBar
              user={user}
              profileSuggestions={smartSuggestions}
              citiesOptions={citiesOptions}
              loading={loading || globalLoading}
              sexOptions={sexOptions}
              sexPrefsOptions={sexPrefsOptions}
              ageOptions={ageOptions}
              tagsOptions={user.tags}
              onFilterChange={handleFilterChange}
              onSortChange={handleSortChange}
            />
          )}
        </div>
      </div>

      {/* MAIN CONTENT */}
      {loading || globalLoading ? (
        <SuggestionsSkeleton />
      ) : sortedSuggestions.length === 0 || smartSuggestions.length === 0 || error || !user ? (
        <div className="w-full min-w-28 flex-col items-center justify-center overflow-hidden text-ellipsis rounded-2xl bg-card p-4">
          <div className="m-5 flex items-center justify-center smooth42transition hover:scale-150">
            <Frown size={84} />
          </div>
          <p className="text-center text-lg">
            {error
              ? t(`${error}`)
              : sortedSuggestions.length === 0
                ? t(`search.no-suggestions-for-filters-sorting`)
                : t(`search.no-suggestions`)}
          </p>
        </div>
      ) : (
        <div className="flex flex-row flex-wrap items-center justify-center gap-5 smooth42transition">
          {sortedSuggestions.map((dateProfile: TDateProfile, index: number) => (
            <ProfileCardWrapper key={`${dateProfile.id}-${index}`} profile={dateProfile} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SmartSuggestions;
