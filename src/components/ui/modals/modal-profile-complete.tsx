import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';

import clsx from 'clsx';

import AvatarUploader from '@/components/avatar-uploader/avatar-uploader';
import { ButtonMatcha } from '@/components/ui/button-matcha';
import ChipsGroup from '@/components/ui/chips/chips-group';
import { Label } from '@/components/ui/label';
import ModalBasic from '@/components/ui/modals/modal-basic';
import RadioGroup from '@/components/ui/radio/radio-group';
import { RequiredInput } from '@/components/ui/required-input';
import { TAGS_LIST } from '@/constants/tags-list';
import { TUser } from '@/types/user';
import { formatDateForInput } from '@/utils/format-date';
import { Save } from 'lucide-react';

const MAX_BIOGRAPHY_LENGTH = 442;
type TProfileCompleteLayout = 'basicsLayout' | 'biographyLayout' | 'tagsLayout' | 'photosLayout';

const ModalProfileComplete = ({
  user,
  startLayout,
}: {
  user: TUser;
  startLayout?: TProfileCompleteLayout;
}) => {
  const t = useTranslations();
  const [show, setShow] = useState(false);
  const [layout, setLayout] = useState<TProfileCompleteLayout>(startLayout ?? 'basicsLayout');
  const formRef = useRef<HTMLFormElement>(null);
  const [loading, setLoading] = useState(false);
  const [sex, setSex] = useState(user?.sex as string); // <'male' | 'female'>
  const [sexPreferences, setSexPreferences] = useState(user?.sex_preferences as string); // <'men' | 'women' | 'bisexual'>
  const [biography, setBiography] = useState(user?.biography || '');
  const [selectedTags, setSelectedTags] = useState<string[]>(user?.tags || []);
  const [photosURLs, setPhotosURLs] = useState<string[]>(user?.photos || []);

  const handleBiographyChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = event.target.value;
    if (text.length <= MAX_BIOGRAPHY_LENGTH) {
      setBiography(text);
    } else {
      setBiography(text.substring(0, MAX_BIOGRAPHY_LENGTH));
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    const currentForm = formRef.current;
    if (!currentForm) return;

    const formData = new FormData(currentForm);
    //const data = Object.fromEntries(formData.entries());

    // create body for request:
    let body: any = {};
    if (layout === 'basicsLayout') {
      body = JSON.stringify({
        id: user?.id,
        firstname: formData.get('firstname'),
        lastname: formData.get('lastname'),
        nickname: formData.get('nickname'),
        birthdate: formData.get('birthdate'),
        sex: sex,
      });
    } else if (layout === 'biographyLayout') {
      body = JSON.stringify({
        id: user?.id,
        biography: biography,
        sex_preferences: sexPreferences,
        // add location
      });
    } else if (layout === 'tagsLayout') {
      body = JSON.stringify({
        id: user?.id,
        tags: selectedTags,
      });
    } else if (layout === 'photosLayout') {
      body = JSON.stringify({
        id: user?.id,
        photos: photosURLs,
      });
    }

    console.log('body', body);
  };

  const layouts = {
    basicsLayout: (
      <div id="basics" className="flex flex-col p-5">
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
            className="mb-2"
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
            className="mb-2"
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
            className="mb-2"
            value={user?.nickname}
          />
        </div>
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
    ),
    biographyLayout: (
      <div id="bio" className="flex flex-col gap-5 p-5">
        <div>
          <Label htmlFor="about" className="mb-2">
            {t(`about-youself`)}
          </Label>
          <div className="flex flex-col">
            <textarea
              id="biography"
              name="biography"
              placeholder={t(`describe-youself`)}
              className="disabled:opacity-50, flex h-48 w-[42vw] rounded-md border bg-background p-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:ring-offset-0 disabled:cursor-not-allowed"
              value={biography}
              onChange={handleBiographyChange}
            />
            <span className="mt-1 text-xs text-muted">
              {t('auth.max-char') + ': ' + MAX_BIOGRAPHY_LENGTH}
            </span>
          </div>
        </div>
        <div className="flex flex-col">
          <RadioGroup
            label={t(`selector.preferences`) + ':'}
            options={[
              { value: 'men', label: t(`selector.men`) },
              { value: 'women', label: t(`selector.women`) },
              { value: 'bisexual', label: t(`selector.bisexual`) },
            ]}
            defaultValue="bisexual"
            selectedItem={sexPreferences}
            onSelectItem={setSexPreferences}
          />
        </div>
        <div>LOCATION!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!</div>
      </div>
    ),
    tagsLayout: (
      <div className="p-5">
        <ChipsGroup
          name="tags"
          label={t('tags.tags')}
          options={TAGS_LIST || []}
          selectedChips={selectedTags}
          setSelectedChips={setSelectedTags}
        />
      </div>
    ),
    photosLayout: (
      <div className="p-5">
        <Label htmlFor="about" className="mb-2">
          {t(`photos`)}
        </Label>
        <AvatarUploader />
      </div>
    ),
  };

  useEffect(() => {
    if (!user?.complete) {
      setShow(true);
    }
  }, []);

  const handleClose = () => {
    setShow(false);
  };

  const handleNext = () => {
    switch (layout) {
      case 'basicsLayout':
        setLayout('biographyLayout');
        break;
      case 'biographyLayout':
        setLayout('tagsLayout');
        break;
      case 'tagsLayout':
        setLayout('photosLayout');
        break;
      case 'photosLayout':
        handleClose();
        break;
      default:
        break;
    }
  };

  const handlePrevious = () => {
    switch (layout) {
      case 'biographyLayout':
        setLayout('basicsLayout');
        break;
      case 'tagsLayout':
        setLayout('biographyLayout');
        break;
      case 'photosLayout':
        setLayout('tagsLayout');
        break;
      default:
        break;
    }
  };

  return (
    <ModalBasic isOpen={show} setIsOpen={handleClose} title={t('complete-profile')}>
      <div
        className={clsx(
          'flex h-max min-h-[10vh] w-fit min-w-[42vw] flex-col items-center justify-center space-y-10 text-center'
        )}
      >
        {layout !== 'photosLayout' ? (
          <form
            className="align-center flex flex-col items-center justify-center text-left"
            onSubmit={handleSubmit}
            ref={formRef}
          >
            {layouts[layout as keyof typeof layouts]}
            <ButtonMatcha type="submit" size="icon" loading={loading} title={t('save')}>
              <Save size={24} />
            </ButtonMatcha>
          </form>
        ) : (
          <div>{layouts[layout as keyof typeof layouts]}</div>
        )}
      </div>
      <div
        className={clsx(
          'flex flex-row',
          layout === 'basicsLayout' ? 'justify-end' : 'justify-between'
        )}
      >
        {layout !== 'basicsLayout' && (
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
          {t('next')}
        </ButtonMatcha>
      </div>
    </ModalBasic>
  );
};

export default ModalProfileComplete;
