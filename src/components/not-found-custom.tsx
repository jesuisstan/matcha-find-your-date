'use client'; // TO AVOID Error: Usage of next-intl APIs in Server Components currently opts into dynamic rendering

import Link from 'next/link';
import { useTranslations } from 'next-intl';

const NotFoundCustom = () => {
  const t = useTranslations();

  return (
    <div className="flex h-screen flex-col items-center justify-center bg-identity-background bg-cover bg-center text-center">
      <div className="flex flex-col items-center justify-center rounded-xl bg-card/90 p-4 text-foreground">
        <h1 className="text-4xl font-bold">404</h1>
        <p className="text-lg">{t('not-found.content')}</p>
        <Link href={`/dashboard`} className="mt-4 text-positive hover:text-c42orange">
          {t(`go-to-home`)}
        </Link>
      </div>
    </div>
  );
};

export default NotFoundCustom;
