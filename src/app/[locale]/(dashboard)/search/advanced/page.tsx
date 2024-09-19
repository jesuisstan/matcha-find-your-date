'use client';

import { use, useRef, useState } from 'react';
import AsyncSelect from 'react-select/async';
import { useTranslations } from 'next-intl';

import clsx from 'clsx';
import { Annoyed, MapPinned, OctagonAlert, Star, UserRoundSearch } from 'lucide-react';

import ModalProfileWarning from '@/components/modals/modal-profile-warning';
import { ButtonMatcha } from '@/components/ui/button-matcha';
import ChipsGroup from '@/components/ui/chips/chips-group';
import { Label } from '@/components/ui/label';
import RadioGroup from '@/components/ui/radio/radio-group';
import { RequiredInput } from '@/components/ui/required-input';
import SmartSuggestionsSeleton from '@/components/ui/skeletons/smart-suggestions-skeleton';
import ProfileCardWrapper from '@/components/ui/wrappers/profile-card-wrapper';
import { getColorByRating } from '@/components/ui/wrappers/raiting-wrapper';
import { TAGS_LIST } from '@/constants/tags-list';
import useSearchFiltersStore from '@/stores/search';
import useUserStore from '@/stores/user';
import { TSelectGeoOption } from '@/types/geolocation';
import { capitalize } from '@/utils/format-string';
import {
  createTSelectGeoOption,
  geocodeCity,
  loadCityOptions,
  reverseGeocode,
} from '@/utils/geolocation-handlers';

const AdvancedSearch = () => {
  const t = useTranslations();
  const formRef = useRef<HTMLFormElement>(null);
  const { user } = useUserStore();
  const { getValueOfSearchFilter, setValueOfSearchFilter, replaceAllItemsOfSearchFilter } =
    useSearchFiltersStore();
  const ageMin: number = getValueOfSearchFilter('age_min') as number;
  const ageMax: number = getValueOfSearchFilter('age_max') as number;
  const flirtFactorMin: number = getValueOfSearchFilter('flirt_factor_min') as number;
  const selectedTags: string[] = getValueOfSearchFilter('tags') as string[];
  const sex: string = String(
    getValueOfSearchFilter('sex')
      ? getValueOfSearchFilter('sex')
      : setValueOfSearchFilter('sex', user?.sex === 'male' ? 'female' : 'male')
  );
  const sexPreferences: string = String(
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
  );
  const latitude: number = Number(
    getValueOfSearchFilter('latitude')
      ? getValueOfSearchFilter('latitude')
      : setValueOfSearchFilter('latitude', user?.latitude!)
  );
  const longitude: number = Number(
    getValueOfSearchFilter('longitude')
      ? getValueOfSearchFilter('longitude')
      : setValueOfSearchFilter('longitude', user?.longitude!)
  );
  const address: string = String(
    getValueOfSearchFilter('address')
      ? getValueOfSearchFilter('address')
      : setValueOfSearchFilter('address', user?.address!)
  );
  const distance: number = getValueOfSearchFilter('distance') as number;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [searchResult, setSearchResult] = useState([]);

  // Location vars
  const [selectedCityOption, setSelectedCityOption] = useState<TSelectGeoOption | null>(
    address ? createTSelectGeoOption(address) : createTSelectGeoOption(user?.address)
  );

  // get user's location based on browser geolocation
  const handleGeoLocatorClick = async () => {
    setError('');
    setSuccessMessage('');
    setLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setValueOfSearchFilter('latitude', latitude);
          setValueOfSearchFilter('longitude', longitude);
          const locationData = await reverseGeocode(latitude, longitude, setError, t);
          if (locationData) {
            setSelectedCityOption(locationData.city);
            setValueOfSearchFilter('address', locationData.city?.value);
          }
        },
        (error) => {
          setError(t('error-getting-location'));
        }
      );
    } else {
      setError(t('geolocation-not-supported'));
    }
    setLoading(false);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setSuccessMessage('');
    setLoading(true);

    const currentForm = formRef.current;
    if (!currentForm) return;

    const formData = new FormData(currentForm);

    // create body for request:
    const body = JSON.stringify({
      id: user?.id,
      ageMin: formData.get('age-min'),
      ageMax: formData.get('age-max'),
      flirtFactorMin: formData.get('raiting'),
      tags: selectedTags,
      sex: sex,
      sexPreferences: sexPreferences,
      latitude: latitude,
      longitude: longitude,
      distance: formData.get('distance'),
      address: address,
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
        setSearchResult(result.data);
      } else {
        setError(t(result.error));
      }
    } catch (error) {
      setError(t(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {user && <ModalProfileWarning user={user} />}
      {/* HEADER */}
      <div className={clsx('mb-4 flex items-center justify-between')}>
        <div className="flex min-w-full flex-col justify-start">
          <div className="mb-2 flex w-fit flex-wrap smooth42transition">
            <h1 className="max-w-96 truncate text-wrap p-2 text-4xl font-bold xs:max-w-fit">
              {t(`search.advanced`)}
            </h1>
          </div>
          <div className="flex flex-col items-stretch gap-4 xs:flex-row ">
            <div className="flex items-center justify-center text-c42orange">
              <OctagonAlert size={25} />
            </div>
            <div className="w-full min-w-28 flex-col items-center justify-center overflow-hidden text-ellipsis rounded-2xl bg-card p-4">
              <p className="text-xs">{t(`search.advanced-search-note`)}</p>
            </div>
          </div>
        </div>
      </div>
      {/* SEARCH FORM */}
      <form
        className={clsx('mb-4 flex items-center justify-between')}
        onSubmit={handleSubmit}
        ref={formRef}
      >
        <div className="flex w-full min-w-28 flex-row flex-wrap items-center justify-center gap-4 overflow-hidden text-ellipsis">
          {/* LOCATION */}
          <div className="flex w-full flex-col rounded-2xl bg-card p-4 smooth42transition sm:w-fit">
            <Label htmlFor="geolocation">{t(`location`) + t(`his-her`) + ':'}</Label>
            <div id="geolocation" className="mt-5 flex flex-col gap-5 xs:flex-row">
              <div className="flex flex-row gap-5">
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
                        setValueOfSearchFilter('address', value?.value!);
                        // set latitude and longitude in store based on selected city
                        geocodeCity(value?.value!).then((data) => {
                          console.log('geocodeCity data', data);
                          if (data) {
                            setValueOfSearchFilter('latitude', data.lat);
                            setValueOfSearchFilter('longitude', data.lng);
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

          <div className="flex w-full flex-col items-center justify-center gap-4 align-middle xs:flex-row xl:w-fit">
            {/* AGE */}
            <div className="flex w-full flex-col items-start gap-3 rounded-2xl bg-card p-4 xl:w-fit">
              <Label>{capitalize(t(`age`) + t(`his-her`) + ':')}</Label>
              <div className="flex flex-row flex-wrap items-center gap-3">
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
            <div className="flex w-full flex-col items-start gap-3 rounded-2xl bg-card p-4 xl:w-fit">
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

          <div className="flex w-full flex-col items-center justify-center gap-3 align-middle sm:flex-row xl:w-fit">
            {/* SEX */}
            <div className="w-full rounded-2xl bg-card p-4 xl:w-fit">
              <RadioGroup
                label={t(`selector.sex`) + t(`his-her`) + ':'}
                options={[
                  { value: 'male', label: t(`male`) },
                  { value: 'female', label: t(`female`) },
                ]}
                defaultValue="male"
                selectedItem={sex}
                onSelectItem={(value) => setValueOfSearchFilter('sex', value)}
              />
            </div>
            {/* SEX PREFERENCES */}
            <div className="w-full rounded-2xl bg-card p-4 xl:w-fit">
              <RadioGroup
                label={t(`selector.preferences`) + t(`his-her`) + ':'}
                options={[
                  { value: 'men', label: t(`selector.men`) },
                  { value: 'women', label: t(`selector.women`) },
                  { value: 'bisexual', label: t(`selector.bisexual`) },
                ]}
                defaultValue="bisexual"
                selectedItem={sexPreferences}
                onSelectItem={(value) => setValueOfSearchFilter('sex_preferences', value)}
              />
            </div>
          </div>
          <div id="tags" className="max-w-fit rounded-2xl bg-card p-4">
            <ChipsGroup
              name="tags"
              label={'#' + t(`tags.tags`) + ':'}
              options={TAGS_LIST || []}
              selectedChips={selectedTags}
              setSelectedChips={(tags) => replaceAllItemsOfSearchFilter('tags', tags)}
            />
          </div>
          <ButtonMatcha
            size="default"
            disabled={!user || loading}
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
        </div>
      </form>

      {/* MAIN CONTENT */}
      {loading ? (
        <SmartSuggestionsSeleton />
      ) : searchResult.length === 0 ? (
        <div className="w-full min-w-28 flex-col items-center justify-center overflow-hidden text-ellipsis rounded-2xl bg-card p-4">
          <div className="m-5 flex items-center justify-center smooth42transition hover:scale-150">
            <Annoyed size={84} />
          </div>
          <p className="text-center text-lg">{t(`search.no-suggestions`)}</p>
        </div>
      ) : (
        //<div className="grid grid-cols-10 items-center gap-4">
        //  <div className={clsx('col-span-10 h-max items-center justify-center')}>
        //    <ButtonMatcha size="icon" disabled={!user || loading}>
        //      <Annoyed size={20} />
        //    </ButtonMatcha>{' '}
        //    <ButtonMatcha size="icon" disabled={!user || loading}>
        //      <Annoyed size={20} />
        //    </ButtonMatcha>{' '}
        //    <ButtonMatcha size="icon" disabled={!user || loading}>
        //      <Annoyed size={20} />
        //    </ButtonMatcha>{' '}
        //    <ButtonMatcha size="icon" disabled={!user || loading}>
        //      <Annoyed size={20} />
        //    </ButtonMatcha>{' '}
        //    <ButtonMatcha size="icon" disabled={!user || loading}>
        //      <Annoyed size={20} />
        //    </ButtonMatcha>{' '}
        //    <ButtonMatcha size="icon" disabled={!user || loading}>
        //      <Annoyed size={20} />
        //    </ButtonMatcha>
        //  </div>
        //</div>
        <div className="flex flex-row flex-wrap items-center justify-center gap-4 smooth42transition">
          {searchResult.map((user: any, index: number) => (
            <ProfileCardWrapper key={`${user.id}-${index}`} profile={user} />
          ))}

        </div>
      )}
    </div>
  );
};

export default AdvancedSearch;
