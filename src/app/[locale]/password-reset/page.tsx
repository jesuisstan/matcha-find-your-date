'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

import { Eye, EyeOff } from 'lucide-react';

import { ButtonMatcha } from '@/components/ui/button-matcha';
import { Label } from '@/components/ui/label';
import { RequiredInput } from '@/components/ui/required-input';

const PasswordChangePage = () => {
  const t = useTranslations();
  const query = new URLSearchParams(window.location.search);
  const resetToken = query.get('token');
  const formRef = React.useRef<HTMLFormElement>(null);
  const [error, setError] = React.useState('');
  const [successMessage, setSuccessMessage] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    console.log('formRef.current', formRef.current);
  };

  return (
    <div className="flex h-screen flex-col items-center justify-center bg-identity-background bg-cover bg-center text-center">
      <div className="flex min-w-56 flex-col items-center justify-center rounded-xl bg-card/90 p-4 text-foreground">
        <h1 className="text-2xl font-bold">{t(`auth.change-password`)}</h1>

        {!resetToken || resetToken === 'invalid-token' ? (
          <p className="pt-2 text-lg">{t(`auth.invalid-token`)}</p>
        ) : (
          <>
            <form className="flex flex-col pt-8 text-left" onSubmit={handleSubmit} ref={formRef}>
              <>
                <Label htmlFor="password-new" className="mb-2">
                  {t(`auth.new-password`)}
                </Label>
                <div className="relative">
                  <RequiredInput
                    type={showPassword ? 'text' : 'password'}
                    id="password-new"
                    name="password"
                    placeholder={t(`auth.password`)}
                    //autoComplete="current-password"
                    errorMessage={t(`auth.password-requirements`)}
                    pattern="^(?=.*[a-z])(?=.*[0-9])(?=.*[A-Z])(?=.*[@$!%*?&,.^=_+])[A-Za-z0-9@$!%*?&,.^=_+]{8,21}$"
                    className="mb-5"
                  />
                  <button
                    type="button"
                    className="absolute right-2 top-2 text-secondary"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>
              </>
              <>
                <Label htmlFor="password-confirmation" className="mb-2">
                  {t(`auth.confirmation-password`)}
                </Label>
                <div className="relative">
                  <RequiredInput
                    type={showPassword ? 'text' : 'password'}
                    id="password-confirmation"
                    name="password"
                    placeholder={t(`auth.password`)}
                    //autoComplete="current-password"
                    errorMessage={t(`auth.password-requirements`)}
                    pattern="^(?=.*[a-z])(?=.*[0-9])(?=.*[A-Z])(?=.*[@$!%*?&,.^=_+])[A-Za-z0-9@$!%*?&,.^=_+]{8,21}$"
                    className="mb-5"
                  />
                  <button
                    type="button"
                    className="absolute right-2 top-2 text-secondary"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>
              </>
              <ButtonMatcha type="submit" className="mb-5">
                {t(`auth.change-password`)}
              </ButtonMatcha>
            </form>
            {error && <p className="mb-5 text-center text-sm text-negative">{error}</p>}
            {successMessage && (
              <p className="mb-5 text-center text-sm text-positive">{successMessage}</p>
            )}
          </>
        )}
        <Link
          href={`/dashboard`}
          className="mt-4 text-positive transition-all duration-300 ease-in-out hover:text-c42orange"
        >
          {t('go-to-home')}
        </Link>
      </div>
    </div>
  );
};

export default PasswordChangePage;
