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

const MAX_BIOGRAPHY_LENGTH = 342;

const ModalProfileComplete = ({ user }: { user: TUser }) => {
  const t = useTranslations();
  const [show, setShow] = useState(false);
  const [layout, setLayout] = useState('basicsLayout');
  const formRef = useRef<HTMLFormElement>(null);
  const [loading, setLoading] = useState(false);
  const [sex, setSex] = useState(user?.sex as string); // <'male' | 'female'>
  const [sexPreferences, setSexPreferences] = useState(user?.preferences as string); // <'men' | 'women' | 'bisexual'>
  const [biography, setBiography] = useState(user?.biography || '');
  const [selectedTags, setSelectedTags] = useState<string[]>(user?.tags || []);

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
    //handleComplete();
  };

  const layouts = {
    basicsLayout: (
      <div className="flex max-h-[50vh] max-w-[90vw] flex-wrap items-center self-center ">
        <form
          className="align-center flex flex-col items-center justify-center text-left"
          onSubmit={handleSubmit}
          ref={formRef}
        >
          <div className="flex flex-wrap items-start justify-center">
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
          </div>

          <ButtonMatcha type="submit" className="m-5 w-32" loading={loading}>
            {t('save')}
          </ButtonMatcha>
        </form>
      </div>
    ),
    biographyLayout: (
      <div className="flex max-h-[50vh] max-w-[90vw] flex-wrap items-center self-center ">
        <form
          className="align-center flex flex-col items-center justify-center text-left"
          onSubmit={handleSubmit}
          ref={formRef}
        >
          <div className="flex flex-wrap items-start justify-center">
            <div id="bio" className="flex flex-col gap-5 p-5">
              <div>
                <Label htmlFor="about" className="mb-2">
                  {t(`about-youself`)}
                </Label>
                <div className="flex flex-col">
                  <textarea
                    id="about"
                    name="about"
                    placeholder={t(`describe-youself`)}
                    className="disabled:opacity-50, flex h-48 w-96 rounded-md border bg-background p-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:ring-offset-0 disabled:cursor-not-allowed"
                    value={biography}
                    onChange={handleBiographyChange}
                  />
                  <span className="text-xs text-muted">
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
          </div>

          <ButtonMatcha type="submit" className="m-5 w-32" loading={loading}>
            {t('save')}
          </ButtonMatcha>
        </form>
      </div>
    ),
    tagsLayout: (
      <div className="flex max-h-[50vh] max-w-[90vw] flex-wrap items-center self-center ">
        <form
          className="align-center flex flex-col items-center justify-center text-left"
          onSubmit={handleSubmit}
          ref={formRef}
        >
          <div className="p-5">
            <ChipsGroup
              name="tags"
              label={t('tags.tags')}
              options={TAGS_LIST || []}
              selectedChips={selectedTags}
              setSelectedChips={setSelectedTags}
            />
          </div>
          <ButtonMatcha type="submit" className="m-5 w-32" loading={loading}>
            {t('save')}
          </ButtonMatcha>
        </form>
      </div>
    ),
    photosLayout: (
      <div className="flex max-h-[50vh] max-w-[90vw] flex-wrap items-center self-center ">
        <form
          className="align-center flex flex-col items-center justify-center text-left"
          onSubmit={handleSubmit}
          ref={formRef}
        >
          <div className="p-5">
            <Label htmlFor="about" className="mb-2">
              {t(`photos`)}
            </Label>
            <AvatarUploader />
          </div>
          <ButtonMatcha type="submit" className="m-5 w-32" loading={loading}>
            {t('save')}
          </ButtonMatcha>
        </form>
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

  return (
    <ModalBasic isOpen={show} setIsOpen={handleClose} title={t('complete-profile')}>
      <div
        className={clsx(
          'flex h-max min-h-[50vh] w-fit min-w-[42vw] flex-col items-center space-y-10 text-center',
          layout === 'userData' ? 'overflow-auto' : 'justify-center'
        )}
      >
        {layouts[layout as keyof typeof layouts]}
      </div>
      {/*{layout === 'start' && (*/}
      <div className="flex flex-row justify-end">
        <ButtonMatcha type="button" onClick={handleNext} className="min-w-32">
          {t('next')}
        </ButtonMatcha>
      </div>
      {/*)}*/}
    </ModalBasic>
  );
};

export default ModalProfileComplete;
