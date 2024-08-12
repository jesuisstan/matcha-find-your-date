import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

import { OctagonAlert } from 'lucide-react';

import { ButtonMatcha } from '@/components/ui/button-matcha';
import ModalBasic from '@/components/ui/modals/modal-basic';
import { TUser } from '@/types/user';

const ModalCompleteProfile = ({ user }: { user: TUser }) => {
  const t = useTranslations();
  const [show, setShow] = useState(false);
  const [layout, setLayout] = useState('start');
  const layouts = {
    start: (
      <>
        <div className="text-c42orange">
          <OctagonAlert size={60} />
        </div>
        <p>{t('complete-your-profile-message')}</p>
      </>
    ),
    names: <>firstname, lastname, nickname, birthdate </>,
    bio: <>biography, birthdate</>,
    contacts: <>email, coordinates</>,
    photos: <>avatars</>,
    sex: <>sex, preferences</>,
    tags: <>tags</>,
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
    // carousel with user profile data to complete
    switch (layout) {
      case 'start':
        setLayout('names');
        break;
      case 'names':
        setLayout('bio');
        break;
      case 'bio':
        setLayout('contacts');
        break;
      case 'contacts':
        setLayout('photos');
        break;
      case 'photos':
        setLayout('sex');
        break;
      case 'sex':
        setLayout('tags');
        break;
      case 'tags':
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
          {t('no')}
        </ButtonMatcha>
        <ButtonMatcha type="button" onClick={handleComplete} className="min-w-32">
          {layout === 'start' && t('yes')}
          {layout !== 'start' && layout !== 'tags' && t('next')}
          {layout === 'tags' && t('finish')}
        </ButtonMatcha>
      </div>
    </ModalBasic>
  );
};

export default ModalCompleteProfile;
