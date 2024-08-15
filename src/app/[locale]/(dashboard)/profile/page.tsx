'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

import clsx from 'clsx';

import ModalChangeEmail from '@/components/ui/modals/modal-change-email';
import ModalProfileComplete from '@/components/ui/modals/modal-profile-complete';
import useUserStore from '@/stores/user';

const ProfilePage = () => {
  const t = useTranslations();
  const user = useUserStore((state) => state.user);
  const [showChangeEmailModal, setShowChangeEmailModal] = useState(false);

  return (
    <div className='flex flex-col'>
      <ModalChangeEmail show={showChangeEmailModal} setShow={setShowChangeEmailModal} />
      <ModalProfileComplete />
      {/* HEADER */}
      CONTENT:
      <h1>{t('profile')}</h1>
      {user && JSON.stringify(user, null, 2)}
      <br />
      email: {user?.email}
      <button onClick={() => setShowChangeEmailModal(true)}>Change Email</button>
    </div>
  );
};

export default ProfilePage;
