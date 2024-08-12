'use client'; // TO AVOID Error: Usage of next-intl APIs in Server Components currently opts into dynamic rendering

import Link from 'next/link';
import { useTranslations } from 'next-intl';

import { ButtonMatcha } from '@/components/ui/button-matcha';

const NotFoundCustom = () => {
  const t = useTranslations();

  return (
    <div className="flex h-screen flex-col items-center justify-center bg-identity-background bg-cover bg-center text-center">
      <div className="flex flex-col items-center justify-center rounded-xl bg-card/90 p-4 text-foreground">
        <h1 className="text-4xl font-bold">{t('error')} 404</h1>
        <p className="pb-5 pt-5 text-lg">{t('not-found.content')}</p>
        <ButtonMatcha variant="link">
          <Link href={`/dashboard`}>{t('go-to-home')}</Link>
        </ButtonMatcha>
      </div>
    </div>
  );
};

export default NotFoundCustom;
