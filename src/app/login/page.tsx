'use client';

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import useTranslation from 'next-translate/useTranslation';

import clsx from 'clsx';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import LanguageSelector from '@/components/ui/menu/language-selector';
import RadioGroup from '@/components/ui/radio/radio-group';
import { RequiredInput } from '@/components/ui/required-input';
import useLanguage from '@/hooks/useLanguage';
import useUserStore from '@/stores/user';

const Login = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const [pageLayout, setPageLayout] = React.useState('login');
  const formRef = React.useRef<HTMLFormElement>(null);
  const [error, setError] = React.useState('');
  const [successMessage, setSuccessMessage] = React.useState('');
  const { user, setUser } = useUserStore((state) => ({
    user: state.user,
    setUser: state.setUser,
  }));
  const { lang } = useLanguage();

  // Redirect to dashboard if user is already logged in
  React.useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    const currentForm = formRef.current;
    if (!currentForm) return;
    const formData = new FormData(currentForm);

    let response;
    switch (pageLayout) {
      case 'login':
        response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: formData.get('email'),
            password: formData.get('password'),
          }),
        });
        break;
      case 'register':
        response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: formData.get('email'),
            password: formData.get('password'),
            firstname: formData.get('firstname'),
            lastname: formData.get('lastname'),
            nickname: formData.get('nickname'),
            birthdate: formData.get('birthdate'),
            sex: formData.get('sex'),
          }),
        });
        break;
      case 'confirmation':
        response = await fetch('/api/auth/resend-confirmation-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: formData.get('email'),
          }),
        });
        break;
      case 'forgot':
        // Implement forgot password logic here
        break;
    }

    if (!response) return;

    const result = await response.json();

    if (response.ok) {
      switch (pageLayout) {
        case 'login':
          if (result.user.confirmed) {
            document.cookie = `token=${result.token}; path=/`;
            setUser(result.user);
            router.push(`/dashboard?lang=${lang}`);
          } else {
            setError('Please confirm your email address before logging in.');
          }
          break;
        case 'register':
          setSuccessMessage(
            'Registration successful! Please check your email to confirm your account.'
          );
          setPageLayout('login');
          break;
        case 'confirmation':
          setSuccessMessage('Confirmation email sent successfully.');
          break;
        case 'forgot':
          setSuccessMessage('Password reset email sent successfully.');
          break;
      }
    } else {
      setError(result.error);
    }
  };

  return (
    <div className={clsx('flex h-screen w-screen flex-row items-center justify-center bg-card')}>
      <div
        className={clsx(
          'hidden h-screen flex-row items-center justify-center bg-card',
          'md:flex md:w-2/3',
          'lg:flex lg:w-3/4'
        )}
      >
        <div className="relative h-full w-full bg-card">
          <Image
            src="/identity/background.jpg"
            alt="hearts"
            fill
            placeholder="blur"
            blurDataURL="/identity/background.jpg"
            className="z-0"
            sizes={'100vw'}
          />
          <div className="absolute bottom-0 z-10 bg-card/85 p-4 text-foreground">
            <h2 className="mb-2 text-4xl">Make love, not war</h2>
            <p className="text-sm">
              {t`common:service-provided`}{' '}
              <a
                href={`https://www.krivtsoff.site/`}
                target="_blank"
                className="my-6 text-center text-sm text-positive hover:text-c42orange"
              >
                Stan Krivtsoff
              </a>
              {'. '}
              {t`common:rights-reserved`}
              {'.'}
            </p>
          </div>
        </div>
      </div>
      <div
        className={clsx(
          'm-auto flex h-full w-full flex-col overflow-y-scroll p-8',
          'md:w-1/3',
          'lg:w-1/4'
        )}
      >
        <Image
          src="/identity/logo-transparent.png"
          className="z-10 m-auto mb-2 mt-0 w-44"
          alt="logo"
          width={200}
          height={200}
          placeholder="blur"
          blurDataURL="/identity/logo-transparent.png"
        />
        <h2 className="mb-6 text-center text-3xl text-foreground">
          {pageLayout === 'login' && t`common:auth.sign-in`}
          {pageLayout === 'register' && t`common:auth.register-new`}
          {pageLayout === 'confirmation' && t`common:auth.confirme-email`}
          {pageLayout === 'forgot' && t`common:auth.reset-password`}
        </h2>
        <form className="flex flex-col" onSubmit={handleSubmit} ref={formRef}>
          {pageLayout === 'register' && (
            <>
              <Label htmlFor="firstname" className="mb-2">
                {t`common:firstname`}
              </Label>
              <RequiredInput
                type="text"
                id="firstname"
                name="firstname"
                placeholder={t`common:firstname`}
                className="mb-6"
              />
              <Label htmlFor="lastname" className="mb-2">
                {t`common:lastname`}
              </Label>
              <RequiredInput
                type="text"
                id="lastname"
                name="lastname"
                placeholder={t`common:lastname`}
                className="mb-6"
              />
              <Label htmlFor="nickname" className="mb-2">
                {t`common:nickname`}
              </Label>
              <RequiredInput
                type="text"
                id="nickname"
                name="nickname"
                placeholder={t`common:nickname`}
                className="mb-6"
              />
              <div className="flex flex-row gap-6">
                <div className="flex flex-col">
                  <Label htmlFor="birthdate" className="mb-2">
                    {t`common:birthdate`}
                  </Label>
                  <RequiredInput
                    type="date"
                    id="birthdate"
                    name="birthdate"
                    placeholder={t`common:birthdate`}
                    className="mb-6"
                  />
                </div>
                <div className="flex flex-col">
                  <Label htmlFor="sex" className="mb-2">
                    {t`common:selector.select-sex`}
                  </Label>
                  <RadioGroup
                    name="sex"
                    options={[
                      { value: 'male', label: t`common:male` },
                      { value: 'female', label: t`common:female` },
                    ]}
                    defaultValue="male"
                  />
                </div>
              </div>
            </>
          )}
          <Label htmlFor="email" className="mb-2">
            {t`common:auth.email`}
          </Label>
          <RequiredInput
            type="email"
            id="email"
            name="email"
            placeholder={t`common:auth.email`}
            className="mb-6"
            autoComplete="email"
          />
          {pageLayout !== 'confirmation' && pageLayout !== 'forgot' && (
            <>
              <Label htmlFor="password" className="mb-2">
                {t`common:auth.password`}
              </Label>
              <RequiredInput
                type="password"
                id="password"
                name="password"
                placeholder={t`common:auth.password`}
                className="mb-6"
                autoComplete="current-password"
              />
            </>
          )}
          <Button type="submit" className="mb-4">
            {pageLayout === 'login' && t`common:auth.sign-in`}
            {pageLayout === 'register' && t`common:auth.sign-up`}
            {pageLayout === 'confirmation' && t`common:auth.resend-confirmation-email`}
            {pageLayout === 'forgot' && t`common:auth.send-reset-link`}
          </Button>
        </form>
        {error && <p className="mb-4 text-center text-sm text-negative">{error}</p>}
        {successMessage && (
          <p className="mb-4 text-center text-sm text-positive">{successMessage}</p>
        )}
        <div className="flex justify-center">
          {pageLayout !== 'login' && (
            <Button
              variant="link"
              onClick={() => {
                setPageLayout('login');
                setError('');
                setSuccessMessage('');
              }}
            >
              {t`common:auth.back-to-login`}
            </Button>
          )}
          {pageLayout === 'login' && (
            <>
              <Button
                variant="link"
                onClick={() => {
                  setPageLayout('register');
                  setError('');
                  setSuccessMessage('');
                }}
              >
                {t`common:auth.create-account`}
              </Button>
              <Button
                variant="link"
                onClick={() => {
                  setPageLayout('confirmation');
                  setError('');
                  setSuccessMessage('');
                }}
              >
                {t`common:auth.resend-confirmation-email`}
              </Button>
              <Button
                variant="link"
                onClick={() => {
                  setPageLayout('forgot');
                  setError('');
                  setSuccessMessage('');
                }}
              >
                {t`common:auth.forgot-password`}
              </Button>
            </>
          )}
        </div>
        <a
          href={`mailto:${process.env.NEXT_PUBLIC_SUPPORT_EMAIL}`}
          className="my-6 text-center text-sm text-secondary hover:text-c42orange"
        >
          {t`common:need-help`}
        </a>
        <LanguageSelector />
      </div>
    </div>
  );
};

export default Login;
