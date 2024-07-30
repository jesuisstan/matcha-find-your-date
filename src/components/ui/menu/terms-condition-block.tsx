import { useState } from 'react';

import clsx from 'clsx';
import { Handshake } from 'lucide-react';

const TermsConditionBlock = ({ translate }: { translate: (key: string) => string }) => {
  const [isOpen, setOpen] = useState(false);

  return (
    <div>
      {/* horizontal divider */}
      <div className="mb-3 ml-3 w-52 border-t border-secondary opacity-40" />

      {/* T&C modal */}
      {/*{<ModalTermsCondition readOnly isOpen={isOpen} setIsOpen={setOpen} />}*/}

      {/* T&C link */}
      <div className="group ml-3 flex items-center gap-2 text-xs text-foreground">
        <Handshake size={16} />
        <span
          className={clsx(
            `group flex w-full cursor-pointer items-center text-secondary transition duration-75`,
            `hover:text-negative`
          )}
          onClick={() => {
            setOpen(true);
          }}
        >
          {translate(`common:terms-condition`)}
        </span>
      </div>
    </div>
  );
};

export default TermsConditionBlock;
