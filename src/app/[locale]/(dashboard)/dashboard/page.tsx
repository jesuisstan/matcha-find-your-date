'use client';

import React from 'react';
import { useTranslations } from 'next-intl';

import DashboardSkeleton from './dashboard-skeleton';

import useUserStore from '@/stores/user';
import { capitalize } from '@/utils/format-string';

const Dashboard = () => {
  const t = useTranslations();
  const user = useUserStore((state) => state.user);

  return !user ? (
    <DashboardSkeleton />
  ) : (
    <>
      <h1 className="mb-4 text-2xl md:text-3xl lg:text-4xl">
        {t('welcome')}, {capitalize(user?.firstname)}!
      </h1>
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
        Reg date: {user!.registration_date}
        <br />
        Last connection: {user!.last_connection_date}
        <br />
        Popularity: {user!.popularity}
        <br />
        Online: {user!.online ? 'Yes' : 'No'}
        <br />
        Birthdate: {user!.birthdate}
        <br />
        longtitude: {user!.longitude}
        <br />
        latitude: {user!.latitude}
      </div>
    </>
  );
};

export default Dashboard;
