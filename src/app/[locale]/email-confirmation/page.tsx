'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

import { ButtonMatcha } from '@/components/ui/button-matcha';

const EmailConfirmation = () => {
  const t = useTranslations();
  const query = new URLSearchParams(window.location.search);
  const message = query.get('message') || '';
  const error = query.get('error') || '';
  const displayTitle = message ? 'success' : 'error';
  const displayMessage = message ? message : error ? error : 'invalid-token';

  return (
    <div className="flex h-screen flex-col items-center justify-center bg-identity-background bg-cover bg-center text-center">
      <div className="flex min-w-56 flex-col items-center justify-center rounded-xl bg-card/90 p-4 text-foreground">
        <h1 className="text-2xl font-bold">{t(`${displayTitle.toLowerCase()}`)}</h1>
        <p className="pb-5 pt-5 text-lg">{t(`auth.${displayMessage}`)}</p>
        <ButtonMatcha variant="link">
          <Link href={`/dashboard`}>{t('go-to-home')}</Link>
        </ButtonMatcha>
      </div>
    </div>
  );
};

export default EmailConfirmation;
