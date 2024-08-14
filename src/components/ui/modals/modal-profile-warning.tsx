import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

import { OctagonAlert } from 'lucide-react';

import { ButtonMatcha } from '@/components/ui/button-matcha';
import ModalBasic from '@/components/ui/modals/modal-basic';
import { usePathname, useRouter } from '@/navigation';
import { TUser } from '@/types/user';

const ModalProfileWarning = ({ user }: { user: TUser }) => {
  const t = useTranslations();
  const [show, setShow] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!user?.complete) {
      setShow(true);
    }
  }, []);

  const handleProceed = () => {
    if (pathname !== '/profile') {
      router.push('/profile'); // Navigate to /profile if not already there
    } else {
      setShow(false); // Close the modal if already on /profile
    }
  };

  return (
    <ModalBasic isOpen={show} setIsOpen={setShow} title={t('attension')}>
      <div className="flex min-h-[30vh] flex-col items-center justify-center space-y-10 text-center">
        <div className="text-c42orange">
          <OctagonAlert size={60} />
        </div>
        <p className="max-w-[50vh]">{t('complete-your-profile-message')}</p>
      </div>

      <div className="flex flex-row justify-center">
        <ButtonMatcha type="button" onClick={handleProceed} className="min-w-32">
          {t('proceed')}
        </ButtonMatcha>
      </div>
    </ModalBasic>
  );
};

export default ModalProfileWarning;
