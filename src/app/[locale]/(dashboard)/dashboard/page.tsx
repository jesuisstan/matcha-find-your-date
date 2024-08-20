'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

import clsx from 'clsx';
import { Microscope, ScanSearch, UserRoundCog } from 'lucide-react';

import DashboardSkeleton from './dashboard-skeleton';

import useUserStore from '@/stores/user';
import { capitalize } from '@/utils/format-string';

const Dashboard = () => {
  const t = useTranslations();
  const user = useUserStore((state) => state.user);

  return !user ? (
    <DashboardSkeleton />
  ) : (
    <div>
      {/* HEADER */}
      {!user ? (
        '<HeaderSkeleton />'
      ) : (
        <h1 className="mb-4 text-center text-2xl md:text-3xl lg:text-4xl">
          {t('welcome')}, {capitalize(user!.firstname)}!
        </h1>
      )}
      <div
        id="navigation-buttons"
        className={clsx('flex w-[100%] flex-col content-center items-center gap-10')}
      >
        <div
          className={clsx(
            'flex w-[100%] flex-row flex-wrap content-center items-center justify-center gap-5 p-2 align-middle'
          )}
        >
          <div className="flex max-w-72 cursor-pointer flex-col items-center justify-center gap-5 rounded-2xl bg-card p-5 text-center hover:scale-105">
            <p>{t('customize-profile')}</p>
            <UserRoundCog size={100} className="hover:scale-125" />
          </div>

          <div className="flex max-w-72 cursor-pointer flex-col items-center justify-center gap-5 rounded-2xl bg-card p-5 text-center hover:scale-105">
            <p>{t('use-smart-suggestions')}</p>
            <ScanSearch size={100} className="hover:scale-125" />
          </div>

          <div className="flex max-w-72 cursor-pointer flex-col items-center justify-center gap-5 rounded-2xl bg-card p-5 text-center hover:scale-105">
            <p>{t('use-advanced-search')}</p>
            <Microscope size={100} className="hover:scale-125" />
          </div>
        </div>
        <div
          className={clsx(
            'flex w-[100%] flex-col flex-wrap content-center items-center justify-center gap-5 rounded-2xl bg-card p-2 align-middle'
          )}
        >
          <p>{t('powered-by')}</p>
          <div className="flex flex-row gap-10">
            <div className="flex flex-col items-center gap-3 justify-between">
              <Image
                src="/powered-by/logo-vercel.svg"
                alt="Matcha"
                width={0}
                height={0}
                sizes="100vw"
                className={clsx(`h-auto w-20`)}
                placeholder="blur"
                blurDataURL={'/powered-by/logo-vercel.svg'}
                priority
              />
              <p>Vercel</p>
            </div>

            <div className="flex flex-col items-center gap-3 justify-between">
              <Image
                src="/powered-by/logo-react.png"
                alt="Matcha"
                width={0}
                height={0}
                sizes="100vw"
                className={clsx(`h-auto w-20`)}
                placeholder="blur"
                blurDataURL={'/powered-by/logo-react.png'}
                priority
              />
              <p>React</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
