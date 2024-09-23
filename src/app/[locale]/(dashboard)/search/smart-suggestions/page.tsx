'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

import clsx from 'clsx';
import { Frown, RefreshCw } from 'lucide-react';

import ModalProfileWarning from '@/components/modals/modal-profile-warning';
import { ButtonMatcha } from '@/components/ui/button-matcha';
import SelectMultiple from '@/components/ui/select-dropdown/select-multiple';
import SelectSingle from '@/components/ui/select-dropdown/select-single';
import SuggestionsSkeleton from '@/components/ui/skeletons/suggestions-skeleton';
import ProfileCardWrapper from '@/components/ui/wrappers/profile-card-wrapper';
import useSearchStore from '@/stores/search';
import useUserStore from '@/stores/user';

const SmartSuggestions = () => {
  const t = useTranslations();
  const { user, setUser, globalLoading } = useUserStore();
  const { smartSuggestions, setSmartSuggestions } = useSearchStore();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [sortOption, setSortOption] = useState('raiting'); // Sorting option
  const [filterDistance, setFilterDistance] = useState('21'); // Filter by distance
  const [filterRaiting, setFilterRaiting] = useState('0'); // Filter by raiting
  const [filterAge, setFilterAge] = useState(''); // Filter by age
  const [filterSexPreferences, setFilterSexPreferences] = useState(''); // Filter by sex preferences
  const [filterTags, setFilterTags] = useState(user?.tags || []); // Filter by user's tags
  const [filterOnline, setFilterOnline] = useState(false); // Filter by online status

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

  const handleSortChange = (e: any) => {
    setSortOption(e.target.value);
    console.log('Sort option:', e.target.value); // debug
  };

  const handleFilterChange = (e: any, filter: string) => {
    switch (filter) {
      case 'distance':
        setFilterDistance(e.target.value);
        console.log('Distance filter:', e.target.value); // debug
        break;
      case 'age':
        setFilterAge(e.target.value);
        console.log('Age filter:', e.target.value); // debug
        break;
      case 'sexPreferences':
        setFilterSexPreferences(e.target.value);
        console.log('sex Preferences:', e.target.value); // debug
        break;
      case 'tags':
        setFilterTags(e.target.value);
        console.log('Tags filter:', e.target.value); // debug
        break;
      default:
        console.error('Unknown filter:', filter);
    }
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
            {/* FILTER & SORTINN BAR */}
            <div className="flex w-full min-w-28 flex-row flex-wrap items-center justify-center gap-4 overflow-hidden text-ellipsis rounded-2xl bg-card p-4">
              {/* Distance Filter */}
              <SelectSingle
                options={[
                  { value: '10', label: '10' },
                  { value: '21', label: '21' },
                  { value: '42', label: '42' },
                  { value: '84', label: '84' },
                  { value: 'infinity', label: 'infinity' },
                ]}
                defaultValue="21"
                label={t('distance') + ':'}
                selectedItem={filterDistance}
                setSelectedItem={setFilterDistance}
                loading={loading}
              />

              {/* raiting Filter */}
              <SelectSingle
                options={[
                  { value: '0', label: 'All' },
                  { value: '1', label: '>=40' },
                  { value: '2', label: '>=60' },
                  { value: '3', label: '>=80' },
                ]}
                defaultValue="0"
                label={t('raiting') + ':'}
                selectedItem={filterRaiting}
                setSelectedItem={setFilterRaiting}
                loading={loading}
              />

              {/* Tags Filter */}
              <SelectMultiple
                label={'#' + t(`tags.tags`) + ':'}
                options={user?.tags || []}
                defaultValues={['10', '100']}
                selectedItems={filterTags}
                setSelectedItems={setFilterTags}
                loading={loading}
              />

              {/* Sex Preferences Filter */}

              {/* Online Filter */}
              <label htmlFor="online" className="mb-2 block text-sm font-medium">
                Only Online:
              </label>
              <input
                type="checkbox"
                id="online"
                checked={filterOnline}
                onChange={(e) => handleFilterChange(e, 'online')}
                className="mb-4 rounded border p-2"
              />
            </div>
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
