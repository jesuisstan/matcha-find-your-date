'use client';

import Link from 'next/link';
import useTranslation from 'next-translate/useTranslation';

import useUserStore from '@/stores/user';

const NotFound = () => {
  const { t } = useTranslation();
  const lang = useUserStore((state) => state?.user?.lang) || 'en';

  return (
    <div className="flex h-screen flex-col items-center justify-center bg-identity-background bg-cover bg-center text-center">
      <div className="flex flex-col items-center justify-center rounded-xl bg-card/90 p-4 text-foreground">
        <h1 className="text-4xl font-bold">404</h1>
        <p className="text-lg">{t('common:not-found.content')}</p>
        <Link href={`/dashboard?lang=${lang}`} className="mt-4 text-positive hover:text-c42orange">
          {t('common:go-to-home')}
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
