'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

import clsx from 'clsx';
import { SquarePen } from 'lucide-react';

import ModalChangeEmail from '@/components/modals/modal-change-email';
import ModalChangePassword from '@/components/modals/modal-change-password';
import ModalProfileComplete from '@/components/modals/modal-profile-complete';
import TProfileCompleteLayout from '@/components/modals/modal-profile-complete';
import { ButtonMatcha } from '@/components/ui/button-matcha';
import StaticTagsGroup from '@/components/ui/chips/tags-group-static';
import HeaderSkeleton from '@/components/ui/skeletons/header-skeleton';
import DescriptionWrapper from '@/components/ui/wrappers/description-wrapper';
import LabelsWrapper from '@/components/ui/wrappers/labels-wrapper';
import UserSexPreference from '@/components/user-sex-preference';
import useUserStore from '@/stores/user';
import { formatApiDateLastUpdate } from '@/utils/format-date';
import { calculateAge, capitalize } from '@/utils/format-string';

const ProfilePage = () => {
  const t = useTranslations();
  const { user } = useUserStore();
  const [loading, setLoading] = useState(false); // todo
  const [showChangeEmailModal, setShowChangeEmailModal] = useState(false);
  const [showProfileCompleteModal, setShowProfileCompleteModal] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [profileCompleteModalLayout, setProfileCompleteModalLayout] = useState('basics');

  // Automatically show the modal on first load if the profile is incomplete
  useEffect(() => {
    if (!user) return;
    if (!user?.complete) {
      setProfileCompleteModalLayout('basics');
      setShowProfileCompleteModal(true);
    }
  }, [user]);

  const handleModifyClick = (layout: keyof typeof TProfileCompleteLayout) => {
    setProfileCompleteModalLayout(layout);
    setShowProfileCompleteModal(true);
  };

  return (
    <div>
      <ModalChangeEmail show={showChangeEmailModal} setShow={setShowChangeEmailModal} />
      <ModalProfileComplete
        show={showProfileCompleteModal}
        setShow={setShowProfileCompleteModal}
        startLayout={profileCompleteModalLayout as keyof typeof TProfileCompleteLayout}
      />
      <ModalChangePassword show={showChangePasswordModal} setShow={setShowChangePasswordModal} />

      {/* HEADER */}
      <div className={clsx('mb-4 flex items-center justify-between text-4xl')}>
        {!user || loading ? (
          <HeaderSkeleton />
        ) : (
          <div className="flex flex-col justify-start">
            <div className="relative flex w-max flex-wrap">
              <h1 className="mb-2 text-4xl">
                {user?.firstname} {user?.lastname.toUpperCase()}{' '}
              </h1>
              <div className="absolute -right-10 top-1 text-foreground opacity-60 hover:opacity-100">
                <SquarePen
                  size={18}
                  onClick={() => handleModifyClick('basics' as keyof typeof TProfileCompleteLayout)}
                />
              </div>
            </div>
            <div
              className={clsx(
                'flex flex-col items-stretch space-y-4',
                'lg:flex-row lg:items-start lg:space-x-4 lg:space-y-0'
              )}
            >
              {/* LABELS */}
              <LabelsWrapper
                nickname={user?.nickname ?? '???'}
                age={calculateAge(user?.birthdate)}
                sex={user?.sex ?? '???'}
                lastConnection={formatApiDateLastUpdate(user?.last_connection_date)}
                loading={false}
                modifiable
                onModify={() => handleModifyClick('basics' as keyof typeof TProfileCompleteLayout)}
              />
              {/* DESCRIPTION */}
              <DescriptionWrapper
                text={user?.biography}
                modifiable
                onModify={() =>
                  handleModifyClick('biography' as keyof typeof TProfileCompleteLayout)
                }
              />
              {/* BUTTONS GROUP */}
              <div className="flex flex-col items-center justify-center gap-4 xs:flex-row lg:flex-col">
                <ButtonMatcha
                  size="default"
                  className="w-full min-w-32"
                  onClick={() => setShowChangeEmailModal(true)}
                >
                  <span>E-mail</span>
                  <SquarePen size={18} />
                </ButtonMatcha>
                <ButtonMatcha
                  size="default"
                  className="w-full min-w-32"
                  onClick={() => setShowChangePasswordModal(true)}
                >
                  <span>Password</span>
                  <SquarePen size={18} />
                </ButtonMatcha>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* GRID Cols 8 Rows 1 */}
      <div className="mb-4 grid grid-cols-10 gap-4">
        {/* TASTES */}
        <div
          className={clsx(
            'col-span-10 h-max items-center justify-center rounded-2xl bg-card',
            'lg:col-span-3'
          )}
        >
          <div className="m-5 flex flex-col justify-start">
            <h3 className="text-2xl font-bold">{t(`tastes`)}</h3>
            <div className="mt-4">
              <UserSexPreference
                sexPreference={user?.sex_preferences}
                modifiable
                onModify={() =>
                  handleModifyClick('sexpreferences' as keyof typeof TProfileCompleteLayout)
                }
              />
            </div>
            <div className="mt-4">
              <StaticTagsGroup
                tagsList={user?.tags!}
                modifiable
                onModify={() =>
                  handleModifyClick('tags' as keyof typeof TProfileCompleteLayout)
                }
              />
            </div>
          </div>
        </div>
        <div className={clsx('col-span-10', 'lg:col-span-7')}>
          {/* SELECTOR */}
          <div className={clsx('mb-4 flex flex-col rounded-2xl bg-card p-2', 'xl:flex-row')}>
            <div className={clsx('m-4', 'xl:w-2/3')}></div>
            {/* vertical divider */}
            <div className={clsx('m-5 hidden w-[1px] bg-secondary opacity-40', 'xl:block')} />
          </div>
          {/* CHART */}
          <div className="rounded-2xl bg-card p-2">
            <div>Content</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
