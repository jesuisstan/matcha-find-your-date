'use client';

import Link from 'next/link';
import useTranslation from 'next-translate/useTranslation';

import useUserStore from '@/stores/user';

const NotFound = () => {
  const { t } = useTranslation();
  const lang = useUserStore((state) => state?.user?.lang) || 'en';

  return (
    <div className="bg-identity-background flex h-screen flex-col items-center justify-center bg-cover bg-center text-center">
      <div className="flex flex-col items-center justify-center rounded-xl bg-card p-4 text-foreground opacity-90">
        <h1 className="text-4xl font-bold">404</h1>
        <p className="text-2xl">{t('common:not-found.content')}</p>
        <Link href={`/dashboard?lang=${lang}`} className="hover:text-c42orange mt-4 text-positive">
          {t('common:dashboard')}
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
