'use client';

import React from 'react';
import { useTranslations } from 'next-intl';

import clsx from 'clsx';
import { SquarePen } from 'lucide-react';

const UserLocation = ({
  address,
  modifiable,
  onModify,
}: {
  address: string | null | undefined;
  modifiable?: boolean;
  onModify?: () => void;
}) => {
  const t = useTranslations();

  return (
    <div className="relative flex items-center">
      {address ? (
        <span className="flex items-center gap-2">{address}</span>
      ) : (
        <span className="flex items-center gap-2">???</span>
      )}

      {modifiable && (
        <div className="absolute right-1 top-1 text-foreground opacity-60 hover:opacity-100">
          <SquarePen size={18} onClick={onModify} />
        </div>
      )}
    </div>
  );
};

export default UserLocation;
