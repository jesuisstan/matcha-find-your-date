'use client';

import Link from 'next/link';
import useTranslation from 'next-translate/useTranslation';

import useUserStore from '@/stores/user';

const NotFound = () => {
  const { t } = useTranslation();
  const lang = useUserStore((state) => state?.user?.lang) || 'en';

  return (
    <div className="flex h-screen flex-col items-center justify-center text-center">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="text-2xl">{t('common:not-found.content')}</p>
      <Link href={`/dashboard?lang=${lang}`} className="mt-4 text-positive hover:text-negative">
        {t('common:dashboard')}
      </Link>
    </div>
  );
};

export default NotFound;
