import { Dispatch, SetStateAction, useState } from 'react';
import { useTranslations } from 'next-intl';

import { OctagonAlert } from 'lucide-react';

import ModalBasic from '@/components/modals/modal-basic';
import { ButtonMatcha } from '@/components/ui/button-matcha';
import TextWithLineBreaks from '@/components/ui/text-with-line-breaks';
import { useRouter } from '@/navigation';
import useUserStore from '@/stores/user';

const ModalChangePassword = ({
  show,
  setShow,
}: {
  show: boolean;
  setShow: Dispatch<SetStateAction<boolean>>;
}) => {
  const t = useTranslations();
  const { logout } = useUserStore();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleProceed = async () => {
    setLoading(true);
    logout();
    // wait for some time to ensure logout is processed
    await new Promise((resolve) => setTimeout(resolve, 100));
    setLoading(false);
    router.push('/login');
  };

  return (
    <ModalBasic isOpen={show} setIsOpen={setShow} title={t('attension')}>
      <div className="flex min-h-[30vh] flex-col items-center justify-center space-y-10 text-center">
        <div className="mb-5 text-c42orange">
          <OctagonAlert size={60} className="smooth42transition hover:scale-150" />
        </div>
        <TextWithLineBreaks text={t('auth.password-change-message')} />
        {/*<p className="max-w-[50vh]">{}</p>*/}
      </div>

      <div className="flex flex-row justify-center">
        <ButtonMatcha type="button" onClick={handleProceed} className="min-w-32" loading={loading}>
          {t('proceed')}
        </ButtonMatcha>
      </div>
    </ModalBasic>
  );
};

export default ModalChangePassword;
