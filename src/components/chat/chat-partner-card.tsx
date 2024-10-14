import React from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

import clsx from 'clsx';

import { TChatPartner } from '@/stores/chat-store';

type Props = {
  partner: TChatPartner;
  isSelected: boolean;
  onClick: () => void;
};

const ChatPartnerWrapper: React.FC<Props> = ({ partner, isSelected, onClick }) => {
  const t = useTranslations();

  return (
    <div
      className={clsx(
        'flex h-20 cursor-pointer flex-col gap-2 rounded-2xl bg-card px-4 py-2 text-sm shadow-md transition-all hover:opacity-100',
        isSelected ? 'bg-muted opacity-100' : 'opacity-60'
      )}
      onClick={onClick}
    >
      <Link
        href={`/search/${partner.chat_partner}`}
        passHref
        className="w-max max-w-full truncate hover:underline"
      >
        <p
          className="truncate font-bold"
          title={`${partner.firstname} "${partner.nickname}" ${partner.lastname}`}
        >
          {`"${partner.nickname}" ${partner.firstname} ${partner.lastname}`}
        </p>
      </Link>

      <p
        className={clsx(
          'truncate text-xs font-normal',
          partner.online ? 'animate-pulse text-positive' : 'text-negative'
        )}
      >{`${partner.online ? t('online') : t('offline')}`}</p>
      {partner.unread_count > 0 && (
        <p className="truncate text-xs text-c42orange">
          {partner.unread_count} {t('unread')}{' '}
        </p>
      )}
    </div>
  );
};

export default ChatPartnerWrapper;
