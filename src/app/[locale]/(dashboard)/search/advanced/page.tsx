'use client';

import { useState } from 'react';
import AsyncSelect from 'react-select/async';
import { useTranslations } from 'next-intl';

import clsx from 'clsx';
import { Annoyed, RefreshCw } from 'lucide-react';
import { MapPinned } from 'lucide-react';

import ModalProfileWarning from '@/components/modals/modal-profile-warning';
import { ButtonMatcha } from '@/components/ui/button-matcha';
import ChipsGroup from '@/components/ui/chips/chips-group';
import { Label } from '@/components/ui/label';
import RadioGroup from '@/components/ui/radio/radio-group';
import { RequiredInput } from '@/components/ui/required-input';
import SmartSuggestionsSeleton from '@/components/ui/skeletons/smart-suggestions-skeleton';
import { TAGS_LIST } from '@/constants/tags-list';
import useUserStore from '@/stores/user';
import { TGeoCoordinates, TSelectGeoOption } from '@/types/geolocation';
import { capitalize } from '@/utils/format-string';
import { createTGeoCoordinates, createTSelectGeoOption } from '@/utils/geolocation-handlers';

const AdvancedSearch = () => {
  // Translate hook
  const t = useTranslations();
  const { user } = useUserStore();
  const [loading, setLoading] = useState(false); // todo
  const [suggestions, setSuggestions] = useState([]);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const [sexPreferences, setSexPreferences] = useState(user?.sex_preferences as string); // <'men' | 'women' | 'bisexual'>
  const [selectedTags, setSelectedTags] = useState<string[]>(user?.tags || []);
  const [sex, setSex] = useState(user?.sex === 'male' ? 'female' : 'male'); // <'male' | 'female'>
  // Location vars
  const [selectedCityOption, setSelectedCityOption] = useState<TSelectGeoOption | null>(
    createTSelectGeoOption(user?.address)
  );
  const [geoCoordinates, setGeoCoordinates] = useState<TGeoCoordinates | null>(
    createTGeoCoordinates(user?.latitude, user?.longitude)
  );

  const loadCityOptions = async (inputValue: string): Promise<TSelectGeoOption[]> => {
    setError('');
    if (inputValue) {
      try {
        const response = await fetch(`/api/location-proxy?input=${inputValue}&type=autocomplete`);
        const data = await response.json();
        return (
          data?.predictions?.map((place: any) => ({
            value: place.description,
            label: place.description,
          })) || []
        );
      } catch (error) {
        setError(t('error-loading-city-options'));
        return [];
      }
    }
    return [];
  };

  const reverseGeocode = async (lat: number, lng: number) => {
    setError('');
    try {
      const response = await fetch(
        `/api/location-proxy?lat=${lat}&lng=${lng}&type=reverse-geocode`
      );
      const data = await response.json();
      const addressComponents = data?.results[0]?.address_components || [];
      const country = addressComponents.find((c: any) => c.types.includes('country'));

      const city = addressComponents.find(
        (c: any) => c.types.includes('locality') || c.types.includes('sublocality')
      );
      return {
        city: city
          ? { value: city.long_name, label: `${city.long_name}, ${country.long_name}` }
          : null,
      };
    } catch (error) {
      setError(t('error-getting-location'));
      return null;
    }
  };

  const handleGeoLocatorClick = async () => {
    setError('');
    setSuccessMessage('');
    setLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setGeoCoordinates({ lat: latitude, lng: longitude });
          const locationData = await reverseGeocode(latitude, longitude);
          if (locationData) setSelectedCityOption(locationData.city);
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

  const handleRefreshSuggestions = () => {
    setLoading(true);
    // todo
    setTimeout(() => {
      setLoading(false);
    }, 2000); // todo delete
    //setLoading(false); // todo
  };

  return (
    <div>
      {user && <ModalProfileWarning user={user} />}
      {/* HEADER */}
      <div className={clsx('mb-4 flex items-center justify-between')}>
        <div className="flex min-w-full flex-col justify-start">
          <div className="mb-2 flex w-fit flex-wrap smooth42transition">
            <h1 className="max-w-96 truncate p-2 text-4xl font-bold xs:max-w-fit">
              {t(`search.advanced`)}
            </h1>
          </div>
          {/* DESCRIPTION */}
          <div className="w-full min-w-28 flex-col items-center justify-center overflow-hidden text-ellipsis rounded-2xl bg-card p-4">
            <p className="text-justify text-sm">{t(`use-advanced-search`)}</p>
          </div>
          {/* SEARCH FORM */}
          <div className="mt-4 flex w-full min-w-28 flex-row flex-wrap items-center justify-center gap-4 overflow-hidden text-ellipsis">
            {/* AGE */}
            <div className="flex w-full flex-col items-start gap-3 rounded-2xl bg-card p-4 md:w-fit">
              <Label>{capitalize(t(`age`) + ':')}</Label>
              <div className="flex flex-row flex-wrap items-center gap-3">
                <RequiredInput
                  type="number"
                  id="from-age"
                  name="from-age"
                  placeholder={t(`from`)}
                  errorMessage="18-99"
                  className="-mb-1 w-20"
                  min={18}
                  max={99}
                />
                <p className="self-start pt-2">{' - '}</p>
                <RequiredInput
                  type="number"
                  id="to-age"
                  name="to-age"
                  placeholder={t(`to`)}
                  errorMessage="18-999"
                  className="-mb-1 w-20"
                  min={18}
                  max={999}
                />
              </div>
            </div>
            {/* LOCATION */}
            <div className="flex w-full flex-col rounded-2xl bg-card p-4 smooth42transition md:w-fit">
              <Label htmlFor="geolocation" className="mb-2 ml-5">
                {t(`location`) + ':'}
              </Label>
              <div id="geolocation" className="m-5 flex flex-col gap-5 md:flex-row">
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
                        onChange={setSelectedCityOption}
                        loadOptions={loadCityOptions}
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
                  <Label>{capitalize(t('distance') + ':')}</Label>
                  <div className="flex flex-row flex-wrap items-center gap-3">
                    <RequiredInput
                      type="number"
                      id="from-distance"
                      name="from-distance"
                      placeholder={t(`from`)}
                      errorMessage="0-999"
                      className="-mb-1 w-20"
                      min={0}
                      max={999}
                    />
                    <p className="self-start pt-2">{' - '}</p>
                    <RequiredInput
                      type="number"
                      id="to-distance"
                      name="to-distance"
                      placeholder={t(`to`)}
                      errorMessage="1-1000"
                      className="-mb-1 w-20"
                      min={1}
                      max={1000}
                    />
                  </div>
                </div>
              </div>
            </div>
            {/* RAITING */}
            <div className="flex w-full flex-col items-start gap-3 rounded-2xl bg-card p-4 md:w-fit">
              <Label>{capitalize(t('raiting') + ':')}</Label>
              <div className="flex flex-row flex-wrap items-center gap-3">
                <RequiredInput
                  type="number"
                  id="from-raiting"
                  name="from-raiting"
                  placeholder={t(`from`)}
                  errorMessage="0-99"
                  className="-mb-1 w-20"
                  min={0}
                  max={99}
                />
                <p className="self-start pt-2">{' - '}</p>
                <RequiredInput
                  type="number"
                  id="to-raiting"
                  name="to-raiting"
                  placeholder={t(`to`)}
                  errorMessage="1-100"
                  className="-mb-1 w-20"
                  min={1}
                  max={100}
                />
              </div>
            </div>

            <div className="flex flex-col items-center justify-center gap-3 align-middle md:flex-row">
              <div className="flex w-full min-w-48 flex-col items-center justify-center gap-3 align-middle md:w-fit">
                {/* SEX */}
                <div className="w-full rounded-2xl bg-card p-4 md:w-fit">
                  <RadioGroup
                    label={t(`selector.sex`) + ':'}
                    options={[
                      { value: 'male', label: t(`male`) },
                      { value: 'female', label: t(`female`) },
                    ]}
                    defaultValue="male"
                    selectedItem={sex}
                    onSelectItem={setSex}
                  />
                </div>
                {/* SEX PREFERENCES */}
                <div className="w-full rounded-2xl bg-card p-4 md:w-fit">
                  <RadioGroup
                    label={t(`selector.preferences`) + ':'}
                    options={[
                      { value: 'men', label: t(`selector.men`) },
                      { value: 'women', label: t(`selector.women`) },
                      { value: 'bisexual', label: t(`selector.bisexual`) },
                    ]}
                    defaultValue="bisexual"
                    selectedItem={sexPreferences ?? 'bisexual'}
                    onSelectItem={setSexPreferences}
                  />
                </div>
              </div>
              {/* TAGS */}
              <div className="max-w-fit rounded-2xl bg-card p-4">
                <ChipsGroup
                  name="tags"
                  label={t('tags.tags')}
                  options={TAGS_LIST || []}
                  selectedChips={selectedTags}
                  setSelectedChips={setSelectedTags}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      {loading ? (
        <SmartSuggestionsSeleton />
      ) : suggestions.length === 0 ? (
        <div className="w-full min-w-28 flex-col items-center justify-center overflow-hidden text-ellipsis rounded-2xl bg-card p-4">
          <div className="m-5 flex items-center justify-center smooth42transition hover:scale-150">
            <Annoyed size={84} />
          </div>
          <p className="text-center text-lg">{t(`search.no-suggestions`)}</p>
        </div>
      ) : (
        <div className="grid grid-cols-10 items-center gap-4">
          <div className={clsx('col-span-10 h-max items-center justify-center')}>
            <ButtonMatcha size="icon" disabled={!user || loading}>
              <RefreshCw size={20} />
            </ButtonMatcha>{' '}
            <ButtonMatcha size="icon" disabled={!user || loading}>
              <RefreshCw size={20} />
            </ButtonMatcha>{' '}
            <ButtonMatcha size="icon" disabled={!user || loading}>
              <RefreshCw size={20} />
            </ButtonMatcha>{' '}
            <ButtonMatcha size="icon" disabled={!user || loading}>
              <RefreshCw size={20} />
            </ButtonMatcha>{' '}
            <ButtonMatcha size="icon" disabled={!user || loading}>
              <RefreshCw size={20} />
            </ButtonMatcha>{' '}
            <ButtonMatcha size="icon" disabled={!user || loading}>
              <RefreshCw size={20} />
            </ButtonMatcha>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedSearch;
