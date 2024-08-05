'use client';

import React from 'react';
import useTranslation from 'next-translate/useTranslation';

import DashboardSkeleton from './dashboard-skeleton';

import useUserStore from '@/stores/user';
import { capitalize } from '@/utils/format-string';

const Dashboard = () => {
  const { t } = useTranslation('dashboard');
  const user = useUserStore((state) => state.user);
  //const { data: session } = useSession();
  //const [smartdataAvailable, setSmartdataAvailable] = useState<any[]>([]);
  //const accessToken = session?.user?.access_token;

  //const profiles = session?.user?.profiles;
  //const name = session?.user?.username ?? '';
  //const lang = useUserStore((state) => state?.user?.lang);
  //const lang = useUserStore((state) => 'en');

  //if (isLoading) {
  //  return <DashboardSkeleton />;
  //}

  //const latestInvoices = await fetchLatestInvoices();

  return !user ? (
    <DashboardSkeleton />
  ) : (
    <>
      <h1 className="mb-4 text-2xl md:text-3xl lg:text-4xl">
        {t('welcome')}, {capitalize(user!.firstname)}!
      </h1>
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
        {/*<LatestInvoices latestInvoices={latestInvoices} />*/}
        CONTENTTTTTTTTTTTTTTTT
      </div>
    </>
  );
};

export default Dashboard;
