import { Dispatch, SetStateAction } from 'react';
import { useTranslations } from 'next-intl';

import { CircleHelp } from 'lucide-react';

import ModalBasic from '@/components/modals/modal-basic';
import TextWithLineBreaks from '@/components/ui/text-with-line-breaks';

const ModalRaitingDescription = ({
  show,
  setShow,
}: {
  show: boolean;
  setShow: Dispatch<SetStateAction<boolean>>;
}) => {
  const t = useTranslations();

  return (
    <ModalBasic isOpen={show} setIsOpen={setShow} title={t('raiting')}>
      <div className="flex min-h-[30vh] flex-col items-center justify-center space-y-10 text-center">
        <div className="mb-5 text-c42orange">
          <CircleHelp size={60} className="smooth42transition hover:scale-150" />
        </div>
        <TextWithLineBreaks text={t('raiting-description-message')} />
      </div>
    </ModalBasic>
  );
};

export default ModalRaitingDescription;
