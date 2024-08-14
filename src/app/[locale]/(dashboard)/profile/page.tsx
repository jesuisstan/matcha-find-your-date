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
      <ModalProfileComplete user={user!} />
      CONTENT
    </div>
  );
};

export default ProfilePage;
