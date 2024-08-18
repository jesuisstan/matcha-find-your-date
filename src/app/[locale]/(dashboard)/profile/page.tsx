'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

import clsx from 'clsx';

import ModalChangeEmail from '@/components/modals/modal-change-email';
import ModalProfileComplete from '@/components/modals/modal-profile-complete';
import { ButtonMatcha } from '@/components/ui/button-matcha';
import DescriptionWrapper from '@/components/ui/wrappers/description-wrapper';
import LabelsWrapper from '@/components/ui/wrappers/labels-wrapper';
import useUserStore from '@/stores/user';
import { formatApiDateLastUpdate } from '@/utils/format-date';
import { calculateAge, capitalize } from '@/utils/format-string';

const ProfilePage = () => {
  // Translate hook
  const t = useTranslations();
  const { user } = useUserStore();
  const [loading, setLoading] = useState(false); // todo
  const [showChangeEmailModal, setShowChangeEmailModal] = useState(false);

  return (
    <div>
      <ModalChangeEmail show={showChangeEmailModal} setShow={setShowChangeEmailModal} />
      <ModalProfileComplete />
      {/* HEADER todo skeleton*/}
      <div className={clsx('mb-4 flex items-center justify-between text-4xl')}>
        {loading ? (
          '<HeaderSkeleton />'
        ) : (
          <div className="flex flex-col justify-start">
            <h1 className="mb-2 text-4xl">
              {user?.firstname} {user!.lastname.toUpperCase()}{' '}
            </h1>
            <div
              className={clsx(
                'flex flex-col items-stretch space-y-4',
                'lg:flex-row lg:items-start lg:space-x-4 lg:space-y-0'
              )}
            >
              {/* LABELS */}
              <LabelsWrapper
                nickname={user!.nickname ?? '???'}
                age={calculateAge(user!.birthdate)}
                sex={user!.sex ?? '???'}
                lastConnection={formatApiDateLastUpdate(user!.last_connection_date)}
                loading={false}
              />
              {/* DESCRIPTION */}
              <DescriptionWrapper text={user?.biography} />
              {/* BUTTONS GROUP */}
              {/*<div className="flex flex-col items-center justify-center gap-4 xs:flex-row lg:flex-col">
                <div className="flex w-full flex-row items-center justify-center gap-4">
                  <ButtonMatcha size="icon">
                    <PlaySquareIcon size={20} />
                  </ButtonMatcha>
                </div>
              </div>*/}
            </div>
          </div>
        )}
      </div>
      {/* GRID Cols 8 Rows 1 */}
      <div className="mb-4 grid grid-cols-10 gap-4">
        {/* OVERVIEW */}
        <div
          className={clsx(
            'col-span-10 h-max items-center justify-center rounded-2xl bg-card',
            'lg:col-span-3'
          )}
        >
          <div className="m-5 flex flex-col justify-start">
            <h3 className="text-3xl">{t`common:overview`}</h3>

            <div className="mt-4">CONTENT</div>
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
