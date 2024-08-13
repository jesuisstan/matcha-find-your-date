import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';

import { OctagonAlert } from 'lucide-react';

import { ButtonMatcha } from '@/components/ui/button-matcha';
import { Label } from '@/components/ui/label';
import ModalBasic from '@/components/ui/modals/modal-basic';
import RadioGroup from '@/components/ui/radio/radio-group';
import { RequiredInput } from '@/components/ui/required-input';
import { TUser } from '@/types/user';

const ModalCompleteProfile = ({ user }: { user: TUser }) => {
  const t = useTranslations();
  const [show, setShow] = useState(false);
  const [layout, setLayout] = useState('start');
  const [sex, setSex] = useState(user.sex as string); // <'male' | 'female'>
  const formRef = useRef<HTMLFormElement>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    //handleComplete();
  };

  const layouts = {
    start: (
      <>
        <div className="text-c42orange">
          <OctagonAlert size={60} />
        </div>
        <p>{t('complete-your-profile-message')}</p>
      </>
    ),
    userData: (
      <form className="flex flex-col text-left" onSubmit={handleSubmit} ref={formRef}>
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
            errorMessage={t('auth.max-char') + ' 21: a-Z, -'}
            className="mb-2"
            value={user.firstname}
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
            errorMessage={t('auth.max-char') + ' 21: a-Z, -'}
            className="mb-2"
            value={user.lastname}
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
            errorMessage={t('auth.max-char') + ' 21: a-Z 0-9 - @'}
            className="mb-2"
            value={user.nickname}
          />
        </div>
        <div className="flex flex-row gap-10">
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
              value={user.birthdate}
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
        <ButtonMatcha type="submit" className="mb-5" loading={loading}>
          {t('save')}
        </ButtonMatcha>
      </form>
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

  const handleComplete = () => {
    switch (layout) {
      case 'start':
        setLayout('userData');
        break;
      case 'userData':
        handleClose();
        break;
      default:
        break;
    }
  };

  return (
    <ModalBasic isOpen={show} setIsOpen={handleClose} title={t('attension')}>
      <div className="mt-10 flex min-h-[600px] w-auto max-w-[90vw] flex-col items-center justify-center space-y-10 p-10 text-center align-middle">
        {layouts[layout as keyof typeof layouts]}
      </div>
      <div className="flex flex-row flex-wrap justify-evenly">
        <ButtonMatcha type="button" onClick={handleClose} className="min-w-32">
          {t('close')}
        </ButtonMatcha>
        {layout === 'start' && (
          <ButtonMatcha type="button" onClick={handleComplete} className="min-w-32">
            {t('proceed')}
          </ButtonMatcha>
        )}
      </div>
    </ModalBasic>
  );
};

export default ModalCompleteProfile;
