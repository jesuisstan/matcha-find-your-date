'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

import clsx from 'clsx';

import ModalCompleteProfile from '@/components/ui/modals/modal-complete-profile';
import useUserStore from '@/stores/user';

const ProfilePage = () => {
  const t = useTranslations();
  const user = useUserStore((state) => state.user);

  return (
    <div>
      {/* HEADER */}
      <ModalCompleteProfile user={user!} />
      CONTENT
    </div>
  );
};

export default ProfilePage;
