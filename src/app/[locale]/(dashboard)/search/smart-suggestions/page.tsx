'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

import clsx from 'clsx';
import { Frown, RefreshCw } from 'lucide-react';

import ModalProfileWarning from '@/components/modals/modal-profile-warning';
import { ButtonMatcha } from '@/components/ui/button-matcha';
import SelectMultiple from '@/components/ui/select-dropdown/select-multiple';
import SelectSingle from '@/components/ui/select-dropdown/select-single';
import FiltersBarSkeleton from '@/components/ui/skeletons/filters-bar-skeleton';
import SuggestionsSkeleton from '@/components/ui/skeletons/suggestions-skeleton';
import ProfileCardWrapper from '@/components/wrappers/profile-card-wrapper';
import useSearchStore from '@/stores/search';
import useUserStore from '@/stores/user';

const SmartSuggestions = () => {
  const t = useTranslations();
  const { user, setUser, globalLoading } = useUserStore();
  const { smartSuggestions, setSmartSuggestions } = useSearchStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [sexOptions, setSexOptions] = useState([] as string[]);
  const [sexPrefsOptions, setSexPrefsOptions] = useState([] as string[]);
  const [citiesOptions, setCitiesOptions] = useState([] as string[]);

  const [filterCities, setFilterCities] = useState((citiesOptions?.[0] || []) as string[]); // Filter by distance
  const [filterRaiting, setFilterRaiting] = useState('0'); // Filter by raiting
  const [filterAge, setFilterAge] = useState('0'); // Filter by age
  const [filterSexPreferences, setFilterSexPreferences] = useState(''); // Filter by sex preferences
  const [filterTags, setFilterTags] = useState(user?.tags || []); // Filter by user's tags
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
      } else {
        setError(result.error ? result.error : 'error-fetching-suggestions');
      }
    } catch (error) {
      setError(String(error));
    } finally {
      setLoading(false);
    }
  };

  // Fetch smart suggestions on component mount
  useEffect(() => {
    if (user) fetchSmartSuggestions();
  }, []);

  const handleRefreshSuggestions = () => {
    fetchSmartSuggestions();
  };

  return (
    <div>
      {user && <ModalProfileWarning user={user} />}
      {/* HEADER */}
      <div className={clsx('mb-4 flex items-center justify-between')}>
        <div className="flex min-w-full flex-col justify-start">
          <div className="mb-2 flex w-fit flex-wrap smooth42transition">
            <h1 className="max-w-96 truncate p-2 text-4xl font-bold xs:max-w-fit">
              {t(`search.smart-suggestions`)}
            </h1>
          </div>
          <div className="mb-2 w-full min-w-28 flex-col items-center justify-center overflow-hidden text-ellipsis rounded-2xl bg-card px-4 py-1">
            <p className="text-left text-xs italic">{t(`use-smart-suggestions`)}</p>
          </div>

          <div className="flex flex-col items-stretch gap-4 xs:flex-row ">
            {/* FILTER BAR */}
            {loading ? (
              <FiltersBarSkeleton />
            ) : (
              <div className="flex w-full flex-col flex-wrap items-center justify-center gap-5 overflow-hidden text-ellipsis rounded-2xl bg-card p-4">
                <div className="flex w-full flex-row flex-wrap items-center justify-center gap-5 overflow-hidden text-ellipsis">
                  {/* Age Filter */}
                  <SelectSingle
                    options={[
                      { value: '0', label: t('selector.select-all') },
                      { value: '1', label: '18-24' },
                      { value: '2', label: '25-34' },
                      { value: '3', label: '35-44' },
                      { value: '4', label: '45-54' },
                      { value: '5', label: '55+' },
                    ]}
                    defaultValue="1"
                    label={t('age') + ':'}
                    selectedItem={filterAge}
                    setSelectedItem={setFilterAge}
                    disabled={loading}
                  />

                  {/* Sex Filter */}
                  <SelectSingle
                    options={[
                      { value: '0', label: t('selector.select-all') },
                      { value: '1', label: '18-24' },
                      { value: '2', label: '25-34' },
                      { value: '3', label: '35-44' },
                      { value: '4', label: '45-54' },
                      { value: '5', label: '55+' },
                    ]}
                    defaultValue="1"
                    label={t('sex') + ':'}
                    selectedItem={filterAge}
                    setSelectedItem={setFilterAge}
                    disabled={loading}
                  />

                  {/* Sex Preferences Filter */}
                  <SelectSingle
                    options={[
                      { value: '0', label: t('selector.select-all') },
                      { value: '1', label: '18-24' },
                      { value: '2', label: '25-34' },
                      { value: '3', label: '35-44' },
                      { value: '4', label: '45-54' },
                      { value: '5', label: '55+' },
                    ]}
                    defaultValue="1"
                    label={t('sexual-preferences') + ':'}
                    selectedItem={filterAge}
                    setSelectedItem={setFilterAge}
                    disabled={loading}
                  />

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
                </div>
                <div className="flex w-full flex-row flex-wrap items-center justify-center gap-5 overflow-hidden text-ellipsis">
                  {/* Cities Filter */}
                  {citiesOptions && (
                    <SelectMultiple
                      label={t(`city`) + ':'}
                      options={citiesOptions || []}
                      defaultValues={[]}
                      selectedItems={filterCities}
                      setSelectedItems={setFilterCities!}
                    />
                  )}

                  {/* Tags Filter */}
                  <SelectMultiple
                    label={'#' + t(`tags.tags`) + ':'}
                    options={user?.tags || []}
                    defaultValues={[]}
                    selectedItems={filterTags}
                    setSelectedItems={setFilterTags}
                    translator="tags"
                  />
                </div>
              </div>
            )}
            {/* REFRESH BUTTON */}
            <div className="flex items-center justify-center">
              <ButtonMatcha
                size="default"
                disabled={!user || loading}
                title={t(`search.refresh-suggestions`)}
                onClick={handleRefreshSuggestions}
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
        </div>
      </div>

      {/* MAIN CONTENT */}
      {loading || globalLoading || !user ? (
        <SuggestionsSkeleton />
      ) : smartSuggestions.length === 0 || error ? (
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
          {smartSuggestions.map((dateProfile: any, index: number) => (
            <ProfileCardWrapper key={`${dateProfile.id}-${index}`} profile={dateProfile} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SmartSuggestions;
