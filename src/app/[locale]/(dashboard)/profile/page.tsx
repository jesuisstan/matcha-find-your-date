'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

import clsx from 'clsx';

import ModalProfileComplete from '@/components/modals/modal-profile-complete';
import TProfileCompleteLayout from '@/components/modals/modal-profile-complete';
import ModalProfileCongrats from '@/components/modals/modal-profile-congrats';
import HeaderSkeleton from '@/components/ui/skeletons/header-skeleton';
import ConfirmationWrapper from '@/components/ui/wrappers/confirmation-wrapper';
import DescriptionWrapper from '@/components/ui/wrappers/description-wrapper';
import InterestsWrapper from '@/components/ui/wrappers/interests-wrapper';
import LabelsWrapper from '@/components/ui/wrappers/labels-wrapper';
import LocationWrapper from '@/components/ui/wrappers/location-wrapper';
import PhotoGalleryWrapper from '@/components/ui/wrappers/photo-gallery-wrapper';
import RaitingWrapper from '@/components/ui/wrappers/raiting-wrapper';
import SexPreferenceWrapper from '@/components/ui/wrappers/sex-preference-wrapper';
import StatusWrapper from '@/components/ui/wrappers/status-wrapper';
import useUserStore from '@/stores/user';
import { calculateAge } from '@/utils/format-string';

const ProfilePage = () => {
  const t = useTranslations();
  const { user } = useUserStore();
  const [loading, setLoading] = useState(false); // todo
  const [showProfileCompleteModal, setShowProfileCompleteModal] = useState(false);
  const [showProfileCongratsModal, setShowProfileCongratsModal] = useState(false);
  const [profileCompleteModalLayout, setProfileCompleteModalLayout] = useState('basics');

  // Automatically show the modal on first load if the profile is incomplete
  useEffect(() => {
    if (!user) return;
    if (!user?.complete) {
      setShowProfileCompleteModal(true);
    }
  }, [user]);

  const handleModifyClick = (layout: keyof typeof TProfileCompleteLayout) => {
    setProfileCompleteModalLayout(layout);
    setShowProfileCompleteModal(true);
  };

  return (
    <div>
      <ModalProfileComplete
        show={showProfileCompleteModal}
        setShow={setShowProfileCompleteModal}
        startLayout={profileCompleteModalLayout as keyof typeof TProfileCompleteLayout}
        setProfileIsCompleted={setShowProfileCongratsModal}
      />
      <ModalProfileCongrats show={showProfileCongratsModal} setShow={setShowProfileCongratsModal} />

      {/* HEADER */}
      <div className={clsx('mb-4 flex items-center justify-between')}>
        {!user || loading ? (
          <HeaderSkeleton />
        ) : (
          <div className="flex min-w-full flex-col justify-start">
            <div
              id="user-nickname"
              className="mb-2 flex w-fit flex-wrap gap-x-2 smooth42transition"
            >
              {/* CONFIRMED ? */}
              <ConfirmationWrapper confirmed={user?.confirmed} />
              <h1
                title={user?.nickname ?? '???'}
                className="max-w-96 truncate p-2 text-4xl font-bold xs:max-w-fit"
              >
                {user?.nickname ?? '???'}
              </h1>
            </div>
            <div
              className={clsx(
                'flex flex-col items-stretch space-y-4',
                'lg:flex-row lg:items-start lg:space-x-4 lg:space-y-0'
              )}
            >
              {/* LABELS */}
              <LabelsWrapper
                firstName={user?.firstname ?? '???'}
                lastName={user?.lastname ?? '???'}
                age={calculateAge(user?.birthdate)}
                sex={user?.sex ?? '???'}
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
              {/* STATUS GROUP */}
              <StatusWrapper onlineStatus={user?.online} lastAction={user?.last_action} />
            </div>
          </div>
        )}
      </div>

      {/* MAIN CONTENT */}
      <div className="mb-4 grid grid-cols-10 gap-4">
        {/* LEFT SECTOR */}
        <div
          className={clsx(
            'col-span-10 h-max items-center justify-center space-y-5',
            'lg:col-span-3'
          )}
        >
          {/* RAITING */}
          <RaitingWrapper raiting={user?.raiting} />

          {/* LOCATION */}
          <LocationWrapper
            address={user?.address}
            modifiable
            onModify={() => handleModifyClick('location' as keyof typeof TProfileCompleteLayout)}
          />

          {/* PREFERENCES */}
          <SexPreferenceWrapper
            sexPreference={user?.sex_preferences}
            modifiable
            onModify={() =>
              handleModifyClick('sexpreferences' as keyof typeof TProfileCompleteLayout)
            }
          />

          {/* INTERESTS */}
          <InterestsWrapper
            tagsList={user?.tags!}
            modifiable
            onModify={() => handleModifyClick('tags' as keyof typeof TProfileCompleteLayout)}
          />
        </div>

        {/* RIGHT SECTOR */}
        <div className={clsx('col-span-10 space-y-5', 'lg:col-span-7')}>
          {/* PHOTOS */}
          <PhotoGalleryWrapper
            user={user}
            modifiable
            onModify={() => handleModifyClick('photos' as keyof typeof TProfileCompleteLayout)}
          />
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
