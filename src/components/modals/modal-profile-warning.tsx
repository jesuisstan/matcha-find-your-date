import { useTranslations } from 'next-intl';

import { OctagonAlert } from 'lucide-react';

import ModalBasic from '@/components/modals/modal-basic';
import { ButtonMatcha } from '@/components/ui/button-matcha';
import { usePathname, useRouter } from '@/navigation';
import { TUser } from '@/types/user';

const ModalProfileWarning = ({ user }: { user: TUser }) => {
  const t = useTranslations();
  const pathname = usePathname();
  const router = useRouter();

  //useEffect(() => {
  //  if (!user?.complete) {
  //    setShow(true);
  //  }
  //}, []);

  const handleProceed = () => {
    if (pathname !== '/profile') {
      router.push('/profile'); // Navigate to /profile if not already there
    }
  };

  return (
    <ModalBasic isOpen={!user?.complete} title={t('attension')}>
      <div className="flex min-h-[30vh] flex-col items-center justify-center space-y-5 text-center">
        <div className="text-c42orange">
          <OctagonAlert size={60} className="smooth42transition hover:scale-150" />
        </div>
        <div>
          <p className="max-w-[60vh]">{t('complete-your-profile-message')}</p>
          <br />
          <p className="max-w-[60vh]">{t('not-available-for-search')}</p>
        </div>
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
