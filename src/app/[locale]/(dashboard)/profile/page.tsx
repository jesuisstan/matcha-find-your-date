'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

import clsx from 'clsx';
import { PenLine } from 'lucide-react';

import ModalChangeEmail from '@/components/modals/modal-change-email';
import ModalChangePassword from '@/components/modals/modal-change-password';
import ModalProfileComplete from '@/components/modals/modal-profile-complete';
import TProfileCompleteLayout from '@/components/modals/modal-profile-complete';
import ModalProfileCongrats from '@/components/modals/modal-profile-congrats';
import { ButtonMatcha } from '@/components/ui/button-matcha';
import HeaderSkeleton from '@/components/ui/skeletons/header-skeleton';
import DescriptionWrapper from '@/components/ui/wrappers/description-wrapper';
import InterestsWrapper from '@/components/ui/wrappers/interests-wrapper';
import LabelsWrapper from '@/components/ui/wrappers/labels-wrapper';
import LocationWrapper from '@/components/ui/wrappers/location-wrapper';
import PhotoGalleryWrapper from '@/components/ui/wrappers/photo-gallery-wrapper';
import SexPreferenceWrapper from '@/components/ui/wrappers/sex-preference-wrapper';
import useUserStore from '@/stores/user';
import { formatApiDateLastUpdate } from '@/utils/format-date';
import { calculateAge } from '@/utils/format-string';

const ProfilePage = () => {
  const t = useTranslations();
  const { user } = useUserStore();
  const [loading, setLoading] = useState(false); // todo
  const [showChangeEmailModal, setShowChangeEmailModal] = useState(false);
  const [showProfileCompleteModal, setShowProfileCompleteModal] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
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
      <ModalChangeEmail show={showChangeEmailModal} setShow={setShowChangeEmailModal} />
      <ModalChangePassword show={showChangePasswordModal} setShow={setShowChangePasswordModal} />
      <ModalProfileCongrats show={showProfileCongratsModal} setShow={setShowProfileCongratsModal} />

      {/* HEADER */}
      <div className={clsx('mb-4 flex items-center justify-between text-4xl')}>
        {!user || loading ? (
          <HeaderSkeleton />
        ) : (
          <div className="flex flex-col justify-start">
            <div id="user-name" className="flex w-max max-w-96 flex-wrap md:max-w-fit">
              <h1 className="mb-2 overflow-hidden text-ellipsis text-4xl sm:text-3xl">
                {user?.firstname} {user?.lastname.toUpperCase()}
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
                  <PenLine size={15} />
                </ButtonMatcha>
                <ButtonMatcha
                  size="default"
                  className="w-full min-w-32"
                  onClick={() => setShowChangePasswordModal(true)}
                >
                  <span>Password</span>
                  <PenLine size={15} />
                </ButtonMatcha>
              </div>
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
