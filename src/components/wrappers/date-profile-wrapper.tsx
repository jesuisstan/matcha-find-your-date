'use client';

import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import clsx from 'clsx';

import ToastNotification from '@/components/toast-notification';
import ActionsWrapper from '@/components/wrappers/actions-wrapper';
import ConfirmationWrapper from '@/components/wrappers/confirmation-wrapper';
import DescriptionWrapper from '@/components/wrappers/description-wrapper';
import InterestsWrapper from '@/components/wrappers/interests-wrapper';
import LabelsWrapper from '@/components/wrappers/labels-wrapper';
import LocationWrapper from '@/components/wrappers/location-wrapper';
import PhotoGalleryWrapper from '@/components/wrappers/photo-gallery-wrapper';
import RaitingWrapper from '@/components/wrappers/raiting-wrapper';
import SexPreferenceWrapper from '@/components/wrappers/sex-preference-wrapper';
import StatusWrapper from '@/components/wrappers/status-wrapper';
import { TDateProfile } from '@/types/date-profile';

const DateProfileWrapper = ({
  dateProfile,
  setDateProfile,
  isMatch,
  isLiked,
  isBlocked,
}: {
  dateProfile: TDateProfile;
  setDateProfile: Dispatch<SetStateAction<TDateProfile | null>>;
  isMatch: boolean;
  isLiked: boolean;
  isBlocked: boolean;
}) => {
  return (
    <div>
      {/* HEADER */}
      <div className={clsx('mb-4 flex items-center justify-between')}>
        <div className="flex min-w-full flex-col justify-start">
          <div className="mb-2 flex w-fit flex-wrap gap-x-2 smooth42transition">
            {/* CONFIRMED ? */}
            <ConfirmationWrapper confirmed={dateProfile?.confirmed} />
            <h1
              id="user-nickname"
              title={dateProfile?.nickname ?? '???'}
              className="max-w-96 truncate p-2 text-4xl font-bold xs:max-w-fit"
            >
              {dateProfile?.nickname ?? '???'}
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
              firstName={dateProfile?.firstname ?? '???'}
              lastName={dateProfile?.lastname ?? '???'}
              age={dateProfile?.age}
              sex={dateProfile?.sex ?? '???'}
              loading={false}
            />
            {/* DESCRIPTION */}
            <DescriptionWrapper text={dateProfile?.biography} />
            {/* STATUS GROUP */}
            <StatusWrapper
              onlineStatus={dateProfile?.online}
              lastAction={dateProfile?.last_action}
            />
            {/* ACTION BUTTONS GROUP */}
            <ActionsWrapper
              dateProfile={dateProfile}
              setDateProfile={setDateProfile}
              isMatch={isMatch}
              isLiked={isLiked}
              isBlocked={isBlocked}
            />
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="mb-4 grid grid-cols-12 gap-4">
        {/* LEFT SECTOR */}
        <div className={clsx('col-span-12 h-max space-y-5', 'lg:col-span-3')}>
          {/* RAITING */}
          <RaitingWrapper raiting={dateProfile?.raiting} />

          {/* LOCATION */}
          <LocationWrapper address={dateProfile?.address} />

          {/* PREFERENCES */}
          <SexPreferenceWrapper sexPreference={dateProfile?.sex_preferences ?? undefined} />
        </div>

        {/* CENTER SECTOR */}
        <div className={clsx('col-span-12 space-y-5', 'lg:col-span-6')}>
          {/* PHOTOS */}
          <PhotoGalleryWrapper profile={dateProfile} />
        </div>

        {/* RIGHT SECTOR */}
        <div className={clsx('col-span-12 space-y-5', 'lg:col-span-3')}>
          {/* INTERESTS */}
          <InterestsWrapper tagsList={dateProfile?.tags!} />

          {/* DEBUG TODO: DELETE*/}
          <ToastNotification />
        </div>
      </div>
    </div>
  );
};

export default DateProfileWrapper;
