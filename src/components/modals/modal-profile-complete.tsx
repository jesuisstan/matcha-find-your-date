import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import AsyncSelect from 'react-select/async';
import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';

import clsx from 'clsx';
import { OctagonAlert, Save } from 'lucide-react';
import { MapPinned, MapPinOff } from 'lucide-react';

import FilledOrNot from '../ui/filled-or-not';

import ImageUploader from '@/components/avatar-uploader/image-uploader';
import ModalBasic from '@/components/modals/modal-basic';
import { ButtonMatcha } from '@/components/ui/button-matcha';
import ChipsGroup from '@/components/ui/chips/chips-group';
import { Label } from '@/components/ui/label';
import RadioGroup from '@/components/ui/radio/radio-group';
import { RequiredInput } from '@/components/ui/required-input';
import TextWithLineBreaks from '@/components/ui/text-with-line-breaks';
import { TAGS_LIST } from '@/constants/tags-list';
import useUserStore from '@/stores/user';
import { TGeoCoordinates, TSelectGeoOption } from '@/types/geolocation';
import { TUser } from '@/types/user';
import { formatDateForInput } from '@/utils/format-date';
import {
  createTGeoCoordinates,
  createTSelectGeoOption,
  getFakeLocation,
} from '@/utils/geolocation-handlers';
import { isProfileCategoryFilled } from '@/utils/user-handlers';

const MAX_BIOGRAPHY_LENGTH = 442;

export type TProfileCompleteLayout =
  | 'basics'
  | 'biography'
  | 'location'
  | 'sexpreferences'
  | 'tags'
  | 'photos';

const ModalProfileComplete = ({
  show,
  setShow,
  startLayout,
}: {
  show: boolean;
  setShow: Dispatch<SetStateAction<boolean>>;
  startLayout: TProfileCompleteLayout;
}) => {
  const t = useTranslations();
  const { user, setUser } = useUserStore((state) => ({
    user: state.user,
    setUser: state.setUser,
  }));
  const localeActive = useLocale();
  const [layout, setLayout] = useState<TProfileCompleteLayout>(startLayout ?? 'photos');
  const formRef = useRef<HTMLFormElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [sex, setSex] = useState(user?.sex as string); // <'male' | 'female'>
  const [sexPreferences, setSexPreferences] = useState(user?.sex_preferences as string); // <'men' | 'women' | 'bisexual'>
  const [biography, setBiography] = useState(user?.biography || '');
  const [selectedTags, setSelectedTags] = useState<string[]>(user?.tags || []);
  const [photosURLs, setPhotosURLs] = useState<string[]>(user?.photos || []);

  // Location vars
  const [selectedCityOption, setSelectedCityOption] = useState<TSelectGeoOption | null>(
    createTSelectGeoOption(user?.address)
  );
  const [geoCoordinates, setGeoCoordinates] = useState<TGeoCoordinates | null>(
    createTGeoCoordinates(user?.latitude, user?.longitude)
  );

  const handleBiographyChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = event.target.value;
    if (text.length <= MAX_BIOGRAPHY_LENGTH) {
      setBiography(text);
    } else {
      setBiography(text.substring(0, MAX_BIOGRAPHY_LENGTH));
    }
  };

  const handleFakeLocatorClick = () => {
    setError('');
    setSuccessMessage('');
    const fakeLocation = getFakeLocation(localeActive);
    setGeoCoordinates({ lat: fakeLocation.latitude, lng: fakeLocation.longitude });
    setSelectedCityOption({ value: fakeLocation.address, label: fakeLocation.address });
  };

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

  const getGeoCoordinates = async (address: string) => {
    setError('');
    try {
      const response = await fetch(`/api/location-proxy?input=${address}&type=geocode`);
      const data = await response.json();
      const location = data?.results[0]?.geometry?.location;
      return location || null;
    } catch (error) {
      setError(t('error-getting-geolocation'));
      return null;
    }
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

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setSuccessMessage('');
    setLoading(true);

    const currentForm = formRef.current;
    if (!currentForm) return;

    const formData = new FormData(currentForm);
    //const data = Object.fromEntries(formData.entries());

    // create body for request:
    let body: any = {};
    if (layout === 'basics') {
      body = JSON.stringify({
        id: user?.id,
        firstname: formData.get('firstname'),
        lastname: formData.get('lastname'),
        nickname: formData.get('nickname'),
        birthdate: formData.get('birthdate'),
        sex: sex,
      });
    } else if (layout === 'biography') {
      body = JSON.stringify({
        id: user?.id,
        biography: biography,
      });
    } else if (layout === 'location') {
      body = JSON.stringify({
        id: user?.id,
        latitude: geoCoordinates?.lat,
        longitude: geoCoordinates?.lng,
        address: selectedCityOption?.label,
      });
    } else if (layout === 'sexpreferences') {
      body = JSON.stringify({
        id: user?.id,
        sex_preferences: sexPreferences,
      });
    } else if (layout === 'tags') {
      if (selectedTags.length < 3) {
        setError(t('error-minimum-tags-array'));
        setLoading(false);
        return;
      }
      body = JSON.stringify({
        id: user?.id,
        tags: selectedTags,
      });
    } else if (layout === 'photos') {
      body = JSON.stringify({
        id: user?.id,
        photos: photosURLs,
      });
    }

    let response: any;
    try {
      response = await fetch(`/api/profile/update/${layout}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: body,
      });

      const result = await response.json();
      const updatedUserData: TUser = result.user;
      if (response.ok) {
        setSuccessMessage(t(result.message));
        if (updatedUserData) {
          setUser({ ...user, ...updatedUserData });
        }
      } else {
        setError(t(result.error));
      }
    } catch (error) {
      setError(t(error));
    } finally {
      setLoading(false);
    }
  };

  const layouts = {
    basics: (
      <div
        id="basics"
        className={clsx(
          'flex flex-col items-center justify-center self-center align-middle',
          `sm:flex-row sm:items-center sm:justify-center sm:space-x-10 sm:space-y-0 sm:self-center sm:align-middle`
        )}
      >
        <div className="flex flex-col self-start">
          <div className="flex flex-col">
            <Label htmlFor="firstname" className="mb-2">
              {t(`firstname`)}
            </Label>
            <RequiredInput
              type="text"
              id="firstname"
              name="firstname"
              placeholder={t(`firstname`)}
              pattern="^[A-Za-z\-]{1,21}$"
              maxLength={21}
              errorMessage={t('auth.max-char') + ' 21: a-Z, -'}
              value={user?.firstname}
            />
          </div>
          <div className="flex flex-col">
            <Label htmlFor="lastname" className="mb-2">
              {t(`lastname`)}
            </Label>
            <RequiredInput
              type="text"
              id="lastname"
              name="lastname"
              placeholder={t('lastname')}
              pattern="^[A-Za-z\-]{1,21}$"
              maxLength={21}
              errorMessage={t('auth.max-char') + ' 21: a-Z, -'}
              value={user?.lastname}
            />
          </div>
          <div className="flex flex-col">
            <Label htmlFor="nickname" className="mb-2">
              {t(`nickname`)}
            </Label>
            <RequiredInput
              type="text"
              id="nickname"
              name="nickname"
              placeholder={t(`nickname`)}
              pattern="^[A-Za-z0-9\-@]{1,21}$"
              maxLength={21}
              errorMessage={t('auth.max-char') + ' 21: a-Z 0-9 - @'}
              value={user?.nickname}
            />
          </div>
        </div>

        <div className="flex flex-col self-start">
          <div className="flex flex-col">
            <Label htmlFor="birthdate" className="mb-2">
              {t(`birthdate`)}
            </Label>
            <RequiredInput
              type="date"
              id="birthdate"
              name="birthdate"
              placeholder={t(`birthdate`)}
              className="mb-2"
              value={formatDateForInput(user?.birthdate)}
            />
          </div>
          <div className="flex flex-col self-start">
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
        </div>
      </div>
    ),
    biography: (
      <div>
        <Label htmlFor="about" className="mb-2">
          {t(`bio`) + ':'}
        </Label>
        <div className="flex flex-col">
          <textarea
            id="biography"
            name="biography"
            placeholder={t(`describe-youself`)}
            className="disabled:opacity-50, flex h-48 min-w-[30vw] rounded-md border bg-background p-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:ring-offset-0 disabled:cursor-not-allowed"
            value={biography}
            onChange={handleBiographyChange}
          />
          <span className="mt-1 text-xs text-muted">
            {t('auth.max-char') + ': ' + MAX_BIOGRAPHY_LENGTH}
          </span>
        </div>
      </div>
    ),
    location: (
      <div className="flex flex-col">
        <Label htmlFor="geolocation" className="mb-2 ml-5">
          {t(`location`) + ':'}
        </Label>
        <div id="geolocation" className="m-5 flex flex-row gap-5 self-center">
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
                className="w-52 text-xs text-foreground/85 placeholder-foreground placeholder-opacity-25"
                value={selectedCityOption}
                onChange={setSelectedCityOption}
                loadOptions={loadCityOptions}
                id="city"
                placeholder={t('selector.select-city')}
                required
              />
            </div>
          </div>
          {/* vertical divider */}
          <div className={clsx('w-[1px] bg-secondary opacity-40', 'xl:block')} />
          {/* fake location */}
          <div id="geo-locator" className="self-center" title={t('set-fake-location')}>
            <MapPinOff
              size={24}
              onClick={handleFakeLocatorClick}
              className="cursor-pointer transition-all duration-300 ease-in-out hover:scale-110"
            />
          </div>
        </div>
        {/* warning */}
        <div className="flex flex-row items-center justify-center gap-3 space-y-1 text-center">
          <div className="text-c42orange">
            <OctagonAlert size={25} />
          </div>
          <div className="max-w-[400px] text-left text-xs">
            <TextWithLineBreaks text={t('location-need-message')} />
          </div>
        </div>
      </div>
    ),
    sexpreferences: (
      <div className="m-5 flex flex-col">
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
    ),
    tags: (
      <div className="m-5">
        <ChipsGroup
          name="tags"
          label={t('tags.tags')}
          options={TAGS_LIST || []}
          selectedChips={selectedTags}
          setSelectedChips={setSelectedTags}
        />
      </div>
    ),
    photos: (
      <div className="flex min-h-96 min-w-96 flex-col gap-1 text-left">
        <Label htmlFor="about" className="mb-3 text-left">
          {t(`photo-gallery`) + ':'}
        </Label>
        <ImageUploader id={0} />
        <ImageUploader id={1} />
        <ImageUploader id={2} />
        <ImageUploader id={3} />
        <ImageUploader id={4} />
      </div>
    ),
  };

  const handleClose = () => {
    setError('');
    setSuccessMessage('');
    setShow(false);
  };

  const handleNext = () => {
    setError('');
    setSuccessMessage('');
    switch (layout) {
      case 'basics':
        setLayout('biography');
        break;
      case 'biography':
        setLayout('location');
        break;
      case 'location':
        setLayout('sexpreferences');
        break;
      case 'sexpreferences':
        setLayout('tags');
        break;
      case 'tags':
        setLayout('photos');
        break;
      case 'photos':
        handleClose();
        break;
      default:
        break;
    }
  };

  const handlePrevious = () => {
    setError('');
    setSuccessMessage('');
    switch (layout) {
      case 'biography':
        setLayout('basics');
        break;
      case 'location':
        setLayout('biography');
        break;
      case 'sexpreferences':
        setLayout('location');
        break;
      case 'tags':
        setLayout('sexpreferences');
        break;
      case 'photos':
        setLayout('tags');
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    if (show) {
      setLayout(startLayout ?? 'basics');
    }
  }, [show, startLayout]);

  useEffect(() => {
    // Get geolocation for selected home city
    if (layout !== 'location') return;
    let isMounted = true;
    const fetchData = async () => {
      if (selectedCityOption) {
        const geoLocation = await getGeoCoordinates(selectedCityOption.value);
        if (isMounted) {
          setGeoCoordinates(geoLocation);
        }
      }
    };
    fetchData();
    return () => {
      isMounted = false;
    };
  }, [selectedCityOption]);

  return (
    <ModalBasic isOpen={show} setIsOpen={handleClose} title={t('complete-profile')}>
      <div className="max-h-[70vh] overflow-y-auto">
        <div
          className={clsx(
            'flex h-max min-h-[40vh] min-w-[30vw] flex-col items-center justify-center space-y-10 text-center'
          )}
        >
          {layout !== 'photos' ? (
            <form
              className="align-center flex flex-col items-center justify-center gap-5 text-left"
              onSubmit={handleSubmit}
              ref={formRef}
            >
              {layouts[layout as keyof typeof layouts]}
              <div className="flex flex-row items-center justify-center gap-3 self-center text-center">
                <FilledOrNot size={24} filled={isProfileCategoryFilled(layout, user)} />
                <ButtonMatcha type="submit" size="icon" loading={loading} title={t('save')}>
                  <Save size={24} />
                </ButtonMatcha>
              </div>
            </form>
          ) : (
            <div>{layouts[layout as keyof typeof layouts]}</div>
          )}
        </div>
        <div className="min-h-6">
          {error && <p className="mb-5 text-center text-sm text-negative">{error}</p>}
          {successMessage && (
            <p className="mb-5 text-center text-sm text-positive">{successMessage}</p>
          )}
        </div>
      </div>

      {/* Next and Previous buttons */}
      <div
        className={clsx('flex flex-row', layout === 'basics' ? 'justify-end' : 'justify-between')}
      >
        {layout !== 'basics' && (
          <ButtonMatcha
            type="button"
            onClick={handlePrevious}
            className="min-w-32"
            disabled={loading}
          >
            {t('back')}
          </ButtonMatcha>
        )}
        <ButtonMatcha type="button" onClick={handleNext} className="min-w-32" disabled={loading}>
          {layout !== 'photos' ? t('next') : t('finish')}
        </ButtonMatcha>
      </div>
    </ModalBasic>
  );
};

export default ModalProfileComplete;
