'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

import clsx from 'clsx';

import ModalProfileComplete from '@/components/ui/modals/modal-profile-complete';
import useUserStore from '@/stores/user';

const ProfilePage = () => {
  const t = useTranslations();
  const user = useUserStore((state) => state.user);

  return (
    <div>
      {/* HEADER */}
      <ModalProfileComplete />
      CONTENT:
      <h1>{t('profile')}</h1>
      {user && JSON.stringify(user, null, 2)}
    </div>
  );
};

export default ProfilePage;
