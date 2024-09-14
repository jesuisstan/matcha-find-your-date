import { Dispatch, SetStateAction } from 'react';
import { useTranslations } from 'next-intl';

import { CircleCheck } from 'lucide-react';

import ModalBasic from '@/components/modals/modal-basic';
import TextWithLineBreaks from '@/components/ui/text-with-line-breaks';

const ModalProfileCongrats = ({
  show,
  setShow,
}: {
  show: boolean;
  setShow: Dispatch<SetStateAction<boolean>>;
}) => {
  const t = useTranslations();

  return (
    <ModalBasic isOpen={show} setIsOpen={setShow} title={t('congrats')}>
      <div className="flex min-h-[30vh] flex-col items-center justify-center gap-10 text-center">
        <div className="mb-5 text-c42green">
          <CircleCheck size={60} className="smooth42transition hover:scale-150" />
        </div>
        <TextWithLineBreaks text={t('profile-is-completed')} />
      </div>
    </ModalBasic>
  );
};

export default ModalProfileCongrats;
