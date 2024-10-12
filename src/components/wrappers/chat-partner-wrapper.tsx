import React from 'react';
import { useTranslations } from 'next-intl';

import clsx from 'clsx';

type Props = {
  partner: any;
  isSelected: boolean;
  onClick: () => void;
};

const ChatPartnerWrapper: React.FC<Props> = ({ partner, isSelected, onClick }) => {
  const t = useTranslations();

  return (
    <div
      className={clsx(
        'h-16 cursor-pointer rounded-2xl bg-card p-4 text-sm shadow transition-all hover:opacity-100',
        isSelected ? 'bg-muted opacity-100' : 'opacity-60'
      )}
      onClick={onClick}
    >
      <p
        className="truncate font-bold"
        title={`${partner.firstname} "${partner.nickname}" ${partner.lastname}`}
      >
        {`"${partner.nickname}" ${partner.firstname} ${partner.lastname}`}
      </p>
      {partner.unread_count > 0 && (
        <p className="truncate text-xs text-negative">
          {partner.unread_count} {t('unread')}{' '}
        </p>
      )}
    </div>
  );
};

export default ChatPartnerWrapper;
