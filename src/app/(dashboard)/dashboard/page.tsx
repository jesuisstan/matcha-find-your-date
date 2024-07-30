'use client';
import { useMemo, useState } from 'react';
import React from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import useTranslation from 'next-translate/useTranslation';

import { ChevronRight } from 'lucide-react';

import DashboardSkeleton from './dashboard-skeleton';

import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import useUserStore from '@/stores/user';
import { TSmartdataIdentity } from '@/types/smartdata-identity';
import { capitalize } from '@/utils/format-string';

const Dashboard = () => {
  const { t } = useTranslation('dashboard');
  const { data: session } = useSession();
  const [smartdataAvailable, setSmartdataAvailable] = useState<any[]>([]);
  const accessToken = session?.user?.access_token;

  const profiles = session?.user?.profiles;
  const name = session?.user?.username ?? '';
  const lang = useUserStore((state) => state?.user?.lang);

  // Filter the categories to include only those with at least one available item
  const availableCategories = smartdataAvailable
    ? Object.keys(smartdataAvailable).filter((category: string) =>
        smartdataAvailable[category as keyof typeof smartdataAvailable].some(
          (item: TSmartdataIdentity) => item.available
        )
      )
    : [];

  //if (isLoading) {
  //  return <DashboardSkeleton />;
  //}

  return (
    <>
      <h1 className="mb-4 text-2xl md:text-3xl lg:text-4xl">
        {t('welcome')}, {capitalize(name)}!
      </h1>
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
        {availableCategories.map((category: string) => (
          <React.Fragment key={category}>
            {smartdataAvailable &&
              smartdataAvailable[category as keyof typeof smartdataAvailable].map(
                (item: TSmartdataIdentity) => (
                  <React.Fragment key={item.id}>
                    {item.available && (
                      <Card>
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <div className="mr-3">
                              <CardTitle>{item.name}</CardTitle>
                            </div>
                            <Link href={`${item.link}`}>
                              <Button className="md:w-18 flex items-center lg:w-16">
                                <ChevronRight size={18} />
                              </Button>
                            </Link>
                          </div>
                        </CardHeader>
                      </Card>
                    )}
                  </React.Fragment>
                )
              )}
          </React.Fragment>
        ))}
      </div>
    </>
  );
};

export default Dashboard;
