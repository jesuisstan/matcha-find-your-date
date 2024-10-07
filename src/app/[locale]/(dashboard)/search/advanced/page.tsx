'use client';

import { useEffect, useRef, useState } from 'react';
import AsyncSelect from 'react-select/async';
import { useTranslations } from 'next-intl';

import clsx from 'clsx';
import { Frown, MapPinned, OctagonAlert, Star, UserRoundSearch } from 'lucide-react';

import FilterSortBar from '@/components/filter-sort-bar';
import ModalProfileWarning from '@/components/modals/modal-profile-warning';
import { ButtonMatcha } from '@/components/ui/button-matcha';
import ChipsGroup from '@/components/ui/chips/chips-group';
import { Label } from '@/components/ui/label';
import RadioGroup from '@/components/ui/radio/radio-group';
import { RequiredInput } from '@/components/ui/required-input';
import FiltersBarSkeleton from '@/components/ui/skeletons/filters-bar-skeleton';
import SuggestionsSkeleton from '@/components/ui/skeletons/suggestions-skeleton';
import ProfileCardWrapper from '@/components/wrappers/profile-card-wrapper';
import { getColorByRating } from '@/components/wrappers/raiting-wrapper';
import { TAGS_LIST } from '@/constants/tags-list';
import useSearchStore from '@/stores/search';
import useUserStore from '@/stores/user';
import { TDateProfile } from '@/types/date-profile';
import { TSelectorOption } from '@/types/general';
import { TSelectGeoOption } from '@/types/geolocation';
import { calculateAge, capitalize } from '@/utils/format-string';
import {
  createTSelectGeoOption,
  geocodeCity,
  loadCityOptions,
  reverseGeocode,
} from '@/utils/geolocation-handlers';

const AdvancedSearch = () => {
  const t = useTranslations();
  const formRef = useRef<HTMLFormElement>(null);
  const { user, setUser, globalLoading } = useUserStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const searchMenuRef = useRef<HTMLDivElement | null>(null); // to handle closing on outside click
  const {
    getValueOfSearchFilter,
    setValueOfSearchFilter,
    replaceAllItemsOfSearchFilter,
    advancedSuggestions,
    setAdvancedSuggestions,
  } = useSearchStore();

  const [ageMin, setAgeMin] = useState<number>(getValueOfSearchFilter('age_min') as number);
  const [ageMax, setAgeMax] = useState<number>(getValueOfSearchFilter('age_max') as number);
  const [flirtFactorMin, setFlirtFactorMin] = useState<number>(
    getValueOfSearchFilter('flirt_factor_min') as number
  );
  const [selectedTags, setSelectedTags] = useState<string[]>(
    getValueOfSearchFilter('tags') as string[]
  );
  const [sex, setSex] = useState<string>(
    String(
      getValueOfSearchFilter('sex')
        ? getValueOfSearchFilter('sex')
        : setValueOfSearchFilter('sex', user?.sex === 'male' ? 'female' : 'male')
    )
  );
  const [sexPreferences, setSexPreferences] = useState<string>(
    String(
      getValueOfSearchFilter('sex_preferences')
        ? getValueOfSearchFilter('sex_preferences')
        : setValueOfSearchFilter(
            'sex_preferences',
            user?.sex_preferences === 'women'
              ? 'men'
              : user?.sex_preferences === 'men'
                ? 'women'
                : 'bisexual'
          )
    )
  );
  const [latitude, setLatitude] = useState<number>(
    Number(
      getValueOfSearchFilter('latitude')
        ? getValueOfSearchFilter('latitude')
        : setValueOfSearchFilter('latitude', user?.latitude!)
    )
  );
  const [longitude, setLongitude] = useState<number>(
    Number(
      getValueOfSearchFilter('longitude')
        ? getValueOfSearchFilter('longitude')
        : setValueOfSearchFilter('longitude', user?.longitude!)
    )
  );
  const [address, setAddress] = useState<string>(
    String(
      getValueOfSearchFilter('address')
        ? getValueOfSearchFilter('address')
        : setValueOfSearchFilter('address', user?.address!)
    )
  );
  const [distance, setDistance] = useState<number>(getValueOfSearchFilter('distance') as number);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const [filteredSuggestions, setFilteredSuggestions] = useState<TDateProfile[]>([]);
  const [sortedSuggestions, setSortedSuggestions] = useState<TDateProfile[]>([]);

  // Location vars
  const [selectedCityOption, setSelectedCityOption] = useState<TSelectGeoOption | null>(
    address ? createTSelectGeoOption(address) : createTSelectGeoOption(user?.address)
  );
  const [ageOptions, setAgeOptions] = useState<TSelectorOption[]>([
    { value: '0', label: t('selector.select-all') },
    { value: '1', label: '18-24' },
    { value: '2', label: '25-34' },
    { value: '3', label: '35-44' },
    { value: '4', label: '45-54' },
    { value: '5', label: '55+' },
  ]);
  const [citiesOptions, setCitiesOptions] = useState([] as string[]);

  // Update filters in the store after initialization
  useEffect(() => {
    setValueOfSearchFilter('age_min', ageMin);
    setValueOfSearchFilter('age_max', ageMax);
    setValueOfSearchFilter('flirt_factor_min', flirtFactorMin);
    setValueOfSearchFilter('sex', sex);
    setValueOfSearchFilter('sex_preferences', sexPreferences);
    setValueOfSearchFilter('latitude', latitude);
    setValueOfSearchFilter('longitude', longitude);
    setValueOfSearchFilter('address', address);
    setValueOfSearchFilter('distance', distance);
  }, [ageMin, ageMax, flirtFactorMin, sex, sexPreferences, latitude, longitude, address, distance]);

  // get user's location based on browser geolocation
  const handleGeoLocatorClick = async () => {
    setError('');
    setSuccessMessage('');
    setLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setLatitude(latitude);
          setLongitude(longitude);
          const locationData = await reverseGeocode(latitude, longitude, setError, t);
          if (locationData) {
            setSelectedCityOption(locationData.city);
            setAddress(locationData.city?.value);
            //setValueOfSearchFilter('address', locationData.city?.value);
          }
        },
        (error) => {
          setError('error-getting-location');
        }
      );
    } else {
      setError('geolocation-not-supported');
    }
    setLoading(false);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setSuccessMessage('');
    if (selectedTags.length === 0) {
      setError('error-no-tags-selected');
      return;
    }
    setLoading(true);

    const currentForm = formRef.current;
    if (!currentForm) return;

    const formData = new FormData(currentForm);

    // create body for request:
    const body = JSON.stringify({
      id: user?.id,
      latitude: latitude,
      longitude: longitude,
      distance: formData.get('distance'),
      ageMin: formData.get('age-min'),
      ageMax: formData.get('age-max'),
      flirtFactorMin: formData.get('raiting'),
      sex: sex,
      sexPreferences: sexPreferences,
      tags: selectedTags,
    });

    let response: any;
    try {
      response = await fetch(`/api/search/advanced`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: body,
      });

      const result = await response.json();

      if (response.ok) {
        setSuccessMessage(t(result.message));
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

        setUser({ ...user, ...result.user });
        setSearchResult(matchingUsers);
        setAdvancedSuggestions(matchingUsers);
        // Update filter options based on unique values
        setAgeOptions((prevOptions) =>
          prevOptions.map((option) => ({
            ...option,
            disabled:
              option.value !== '0' &&
              !uniqueAgeRanges[option.value as keyof typeof uniqueAgeRanges],
          }))
        );

        setCitiesOptions(Array.from(uniqueCitiesOptions));
      } else {
        setError(result.error ? result.error : 'error-fetching-suggestions');
      }
    } catch (error) {
      setError(String(error));
    } finally {
      toggleSidebar();
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

  const toggleSidebar: () => void = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  /* Event listener to close Menu when clicking outside */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchMenuRef.current && !searchMenuRef.current.contains(event.target as Node)) {
        setIsSidebarOpen(false);
      }
    };
    if (isSidebarOpen) {
      document.addEventListener('click', handleClickOutside);
    }
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isSidebarOpen]);

  return (
    <div>
      {user && <ModalProfileWarning user={user} />}
      <div className={clsx('mb-2 flex items-center justify-between')}>
        <div className="flex min-w-full flex-col justify-start">
          {/* HEADER */}
          <div className="mb-2 flex w-fit flex-wrap smooth42transition">
            <h1 className="max-w-96 truncate text-wrap p-2 text-4xl font-bold xs:max-w-fit">
              {t(`search.advanced`)}
            </h1>
          </div>

          {/* SUBHEADER */}
          <div className="flex flex-col items-stretch justify-center gap-2 align-middle xs:flex-row">
            <div className="flex items-center justify-center text-c42orange">
              <OctagonAlert size={21} />
            </div>
            <div className="w-full min-w-28 flex-row items-center justify-center self-center overflow-hidden text-ellipsis rounded-2xl bg-card px-4 py-1">
              <p className="text-left text-sm italic">{t(`search.advanced-search-note`)}</p>
            </div>
            <div className="flex items-center justify-center text-c42orange">
              <ButtonMatcha
                size="default"
                disabled={!user || loading || globalLoading}
                title={t(`search.refresh-suggestions`)}
                loading={loading}
                className="min-w-36"
                onClick={toggleSidebar}
              >
                <div className="flex flex-row items-center space-x-3">
                  <div>
                    <UserRoundSearch size={20} />
                  </div>
                  <span>{t('search.search')}</span>
                </div>
              </ButtonMatcha>
            </div>
          </div>
        </div>
      </div>

      {/* SEARCH SIDEBAR */}
      <div
        id="search-bar"
        className={clsx(
          `fixed right-0 top-0 z-50 max-h-screen w-fit overflow-y-auto bg-transparent p-4 transition-transform`, // basic part
          isSidebarOpen ? 'translate-x-0 drop-shadow-2xl' : 'translate-x-[900px]'
        )}
        aria-label="searchBar"
        ref={searchMenuRef}
      >
        <div
          id="rounded-menu-container"
          className="relative flex w-fit flex-col overflow-y-auto rounded-2xl bg-card p-4"
        >
          {/* SEARCH FORM */}
          <form
            className="flex w-full flex-col items-center justify-center text-ellipsis"
            onSubmit={handleSubmit}
            ref={formRef}
          >
            {/* LOCATION */}
            <div className="mb-5 flex w-full flex-col rounded-2xl bg-card smooth42transition sm:w-fit">
              {/*<Label htmlFor="geolocation" className="ml-5 xs:ml-0">
                {t(`location`) + t(`his-her`) + ':'}
              </Label>*/}
              <div
                id="geolocation"
                className="mt-3 flex scale-90 flex-row gap-3 smooth42transition xs:scale-100"
              >
                <div className="flex flex-row gap-3">
                  <div id="geo-locator" className="self-center" title={t('get-location')}>
                    <MapPinned
                      size={24}
                      onClick={handleGeoLocatorClick}
                      className="cursor-pointer transition-all duration-300 ease-in-out hover:scale-110"
                    />
                  </div>
                  {/* vertical divider */}
                  <div className={clsx('w-[1px] bg-secondary opacity-40', 'xl:block')} />
                  {/* city selector */}
                  <div id="geo-selector" className="flex flex-col gap-3">
                    <div className="w-full">
                      <Label htmlFor="city" className="mb-2">
                        {t(`city`)}
                      </Label>
                      <AsyncSelect
                        className="mt-1 w-52 text-xs text-foreground/85 placeholder-foreground placeholder-opacity-25"
                        value={selectedCityOption}
                        onChange={(value) => {
                          setSelectedCityOption(value);
                          //setValueOfSearchFilter('address', value?.value!);
                          setAddress(value?.value!);
                          // set latitude and longitude in store based on selected city
                          geocodeCity(value?.value!).then((data) => {
                            if (data) {
                              setLatitude(data.lat);
                              setLongitude(data.lng);
                              //setValueOfSearchFilter('latitude', data.lat);
                              //setValueOfSearchFilter('longitude', data.lng);
                            }
                          });
                        }}
                        loadOptions={(input) => loadCityOptions(input, setError, t)}
                        id="city"
                        placeholder={t('selector.select-city')}
                        required
                      />
                    </div>
                  </div>
                </div>
                {/* vertical divider */}
                <div className={clsx('w-[1px] bg-secondary opacity-40', 'xl:block')} />
                {/* DISTANCE */}
                <div className="flex max-w-fit flex-col items-start gap-3">
                  <Label>{capitalize(t('distance') + ' (' + t('max') + ')' + ':')}</Label>
                  <div className="flex flex-row items-center gap-2">
                    <RequiredInput
                      type="number"
                      id="distance"
                      name="distance"
                      placeholder={t(`max`)}
                      value={distance}
                      errorMessage="0-9999"
                      className="-mb-1 w-20"
                      min={0}
                      max={9999}
                      onChange={(e) => setValueOfSearchFilter('distance', Number(e.target.value))}
                    />
                    <p className="self-start pt-2">{t('km')}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center align-middle xs:flex-row xs:gap-x-10">
              {/* AGE */}
              <div className="flex flex-col items-start gap-3 rounded-2xl bg-card">
                <Label>{capitalize(t(`age`) + t(`his-her`) + ':')}</Label>
                <div className="flex flex-row items-center gap-3">
                  <RequiredInput
                    type="number"
                    id="age-min"
                    name="age-min"
                    placeholder={t(`from`)}
                    value={ageMin}
                    errorMessage="18-99"
                    className="-mb-1 w-20"
                    min={18}
                    max={99}
                    onChange={(e) => setValueOfSearchFilter('age_min', Number(e.target.value))}
                  />
                  <p className="self-start pt-2">{' - '}</p>
                  <RequiredInput
                    type="number"
                    id="age-max"
                    name="age-max"
                    placeholder={t(`to`)}
                    value={ageMax}
                    errorMessage="18-999"
                    className="-mb-1 w-20"
                    min={18}
                    max={999}
                    onChange={(e) => setValueOfSearchFilter('age_max', Number(e.target.value))}
                  />
                </div>
              </div>

              {/* RAITING */}
              <div className="flex flex-col items-start gap-3 rounded-2xl bg-card">
                <Label>{capitalize(t('raiting') + ' (' + t('min') + ')' + ':')}</Label>
                <div className="flex flex-row items-center gap-2">
                  <Star
                    size={28}
                    className={clsx(
                      'animate-bounce smooth42transition',
                      getColorByRating(flirtFactorMin)
                    )}
                  />
                  <RequiredInput
                    type="number"
                    id="raiting"
                    name="raiting"
                    placeholder={t(`min`)}
                    value={flirtFactorMin}
                    errorMessage="0-100"
                    className="-mb-1 w-20"
                    min={0}
                    max={100}
                    onChange={(e) =>
                      setValueOfSearchFilter('flirt_factor_min', Number(e.target.value))
                    }
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center gap-y-5 align-middle xs:flex-row xs:gap-x-10">
              {/* SEX */}
              <div className="rounded-2xl bg-card">
                <RadioGroup
                  label={t(`selector.sex`) + t(`his-her`) + ':'}
                  options={[
                    { value: 'male', label: t(`male`) },
                    { value: 'female', label: t(`female`) },
                  ]}
                  defaultValue="male"
                  selectedItem={sex}
                  onSelectItem={(value) => setSex(value)}
                />
              </div>
              {/* SEX PREFERENCES */}
              <div className="rounded-2xl bg-card">
                <RadioGroup
                  label={t(`selector.preferences`) + t(`his-her`) + ':'}
                  options={[
                    { value: 'men', label: t(`selector.men`) },
                    { value: 'women', label: t(`selector.women`) },
                    { value: 'bisexual', label: t(`selector.bisexual`) },
                  ]}
                  defaultValue="bisexual"
                  selectedItem={sexPreferences}
                  onSelectItem={(value) => setSexPreferences(value)}
                />
              </div>
            </div>

            {/* TAGS */}
            <div
              id="tags"
              className="max-w-96 rounded-2xl bg-card p-4 smooth42transition md:max-w-[800px]"
            >
              <ChipsGroup
                name="tags"
                label={'#' + t(`tags.tags`) + ':'}
                options={TAGS_LIST || []}
                selectedChips={selectedTags}
                setSelectedChips={(tags) => {
                  setSelectedTags(tags);
                  replaceAllItemsOfSearchFilter('tags', tags);
                }}
              />
            </div>
            <ButtonMatcha
              size="default"
              disabled={!user || loading || globalLoading}
              title={t(`search.refresh-suggestions`)}
              loading={loading}
              className="min-w-40"
            >
              <div className="flex flex-row items-center space-x-3">
                <div>
                  <UserRoundSearch size={20} />
                </div>
                <span>{t('search.search')}</span>
              </div>
            </ButtonMatcha>
          </form>
        </div>
      </div>

      {/* MAIN CONTENT */}
      {loading || globalLoading ? (
        <div className="flex flex-col gap-4">
          <FiltersBarSkeleton />
          <SuggestionsSkeleton />
        </div>
      ) : searchResult.length === 0 || error ? (
        <div className="w-full min-w-28 flex-col items-center justify-center overflow-hidden text-ellipsis rounded-2xl bg-card p-4">
          <div className="m-5 flex items-center justify-center smooth42transition hover:scale-150">
            <Frown size={84} onClick={toggleSidebar} className='cursor-pointer' />
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
        <div className="flex flex-col gap-4">
          <FilterSortBar
            user={user!}
            profileSuggestions={searchResult}
            citiesOptions={citiesOptions}
            loading={loading || globalLoading}
            ageOptions={ageOptions}
            tagsOptions={selectedTags}
            onFilterChange={handleFilterChange}
            onSortChange={handleSortChange}
          />

          <div className="flex flex-row flex-wrap items-center justify-center gap-4 smooth42transition">
            {sortedSuggestions.map((dateProfile: TDateProfile, index: number) => (
              <ProfileCardWrapper key={`${dateProfile.id}-${index}`} profile={dateProfile} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedSearch;
