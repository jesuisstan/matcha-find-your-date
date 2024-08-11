'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

import { CircleCheck, Eye, EyeOff, OctagonAlert } from 'lucide-react';

import { ButtonMatcha } from '@/components/ui/button-matcha';
import { Label } from '@/components/ui/label';
import { RequiredInput } from '@/components/ui/required-input';

const PasswordResetPage = () => {
  const t = useTranslations();
  const formRef = React.useRef<HTMLFormElement>(null);
  const resetToken = new URLSearchParams(window.location.search).get('token');
  const [error, setError] = React.useState('');
  const [successMessage, setSuccessMessage] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    const currentForm = formRef.current;
    if (!currentForm) return;
    const formData = new FormData(currentForm);

    // Check if passwords match each other
    const newPassword = formData.get('password') as string;
    const confirmPassword = formData.get('password-confirmation') as string;
    if (newPassword !== confirmPassword) {
      setError(t('auth.passwords-do-not-match'));
      return;
    }

    setLoading(true);

    let response;
    response = await fetch('/api/auth/password-db-modification', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        token: resetToken,
        newPassword: newPassword,
      }),
    });

    setLoading(false);

    if (!response) return;

    const result = await response.json();

    if (response.ok) {
      setSuccessMessage(t('auth.password-changed-successfully'));
      currentForm.reset();
    } else {
      setError(t(`auth.${result.error}`));
    }
  };

  return (
    <div className="flex h-screen flex-col items-center justify-center bg-identity-background bg-cover bg-center text-center">
      <div className="flex min-w-fit flex-col items-center justify-center rounded-xl bg-card/90 p-4 text-foreground">
        <h1 className="text-2xl font-bold">{t(`auth.change-password`)}</h1>

        {!resetToken || resetToken === 'invalid-token' ? (
          <p className="pt-2 text-lg text-negative">{t(`auth.invalid-token`)}</p>
        ) : (
          <>
            <form
              className="flex min-w-64 flex-col pt-8 text-left"
              onSubmit={handleSubmit}
              ref={formRef}
            >
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
                    pattern="^(?=.*[a-z])(?=.*[0-9])(?=.*[A-Z])(?=.*[@$!%*?&,.^=_+])[A-Za-z0-9@$!%*?&,.^=_+]{8,21}$"
                    errorMessage={t(`auth.password-requirements`)}
                    className="mb-5"
                    disabled={loading || !!successMessage}
                  />
                  <button
                    type="button"
                    className="absolute right-2 top-2 text-secondary"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading || !!successMessage}
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
                    name="password-confirmation"
                    placeholder={t(`auth.password`)}
                    className="mb-5"
                    disabled={loading || !!successMessage}
                  />
                  <button
                    type="button"
                    className="absolute right-2 top-2 text-secondary"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading || !!successMessage}
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>
              </>
              <ButtonMatcha
                type="submit"
                className="mb-5"
                loading={loading}
                disabled={loading || !!successMessage}
              >
                {t(`auth.change-password`)}
              </ButtonMatcha>
            </form>
            {error && (
              <div className="flex flex-col items-center gap-2 text-negative">
                <OctagonAlert size={30} />
                <p className="mb-5 text-center text-sm">{error}</p>
              </div>
            )}
            {successMessage && (
              <div className="flex flex-col items-center gap-2 text-positive">
                <CircleCheck size={30} />
                <p className="mb-5 text-center text-sm ">{successMessage}</p>
              </div>
            )}
          </>
        )}
        <ButtonMatcha variant="link">
          <Link href={`/dashboard`}>{t('go-to-home')}</Link>
        </ButtonMatcha>
      </div>
    </div>
  );
};

export default PasswordResetPage;
