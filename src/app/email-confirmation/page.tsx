'use client';

import React from 'react';
import Link from 'next/link';
import useTranslation from 'next-translate/useTranslation';

import useUserStore from '@/stores/user';

const EmailConfirmation = () => {
  const { t } = useTranslation();
  const lang = useUserStore((state) => state?.user?.lang) || 'en';

  const query = new URLSearchParams(window.location.search);
  const message = query.get('message') || '';
  const error = query.get('error') || '';

  const displayTitle = message ? 'success' : 'error';
  const displayMessage = message ? message : error ? error : 'invalid-token';

  return (
    <div className="flex h-screen flex-col items-center justify-center bg-identity-background bg-cover bg-center text-center">
      <div className="flex min-w-56 flex-col items-center justify-center rounded-xl bg-card/90 p-4 text-foreground">
        <h1 className="text-2xl font-bold">{t(`common:${displayTitle.toLowerCase()}`)}</h1>
        <p className="text-lg">{t(`common:${displayMessage}`)}</p>
        <Link href={`/dashboard?lang=${lang}`} className="mt-4 text-positive hover:text-c42orange">
          {t('common:go-to-home')}
        </Link>
      </div>
    </div>
  );
};

export default EmailConfirmation;
