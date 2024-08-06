'use client';

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import useTranslation from 'next-translate/useTranslation';

import clsx from 'clsx';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import RadioGroup from '@/components/ui/radio/radio-group';
import { RequiredInput } from '@/components/ui/required-input';
import useUserStore from '@/stores/user';

const Login = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const [isLogin, setIsLogin] = React.useState(true);
  const formRef = React.useRef<HTMLFormElement>(null);
  const [error, setError] = React.useState('');
  const [successMessage, setSuccessMessage] = React.useState('');
  const setUser = useUserStore((state) => state.setUser);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    const currentForm = formRef.current;
    if (!currentForm) return;
    const formData = new FormData(currentForm);

    let response;
    if (isLogin) {
      response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.get('email'),
          password: formData.get('password'),
        }),
      });
    } else {
      response = await fetch('/api/register', {
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
    }

    const result = await response.json();

    if (response.ok) {
      if (isLogin) {
        if (result.user.confirmed) {
          document.cookie = `token=${result.token}; path=/`;
          setUser(result.user);
          router.push('/dashboard');
        } else {
          setError('Please confirm your email address before logging in.');
        }
      } else {
        setSuccessMessage(
          'Registration successful! Please check your email to confirm your account.'
        );
        setIsLogin(true);
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
        <h2 className="mb-6 text-center text-3xl text-secondary">
          {isLogin ? 'Sign into your account' : 'Register a new account'}
        </h2>
        <form className="flex flex-col" onSubmit={handleSubmit} ref={formRef}>
          {!isLogin && (
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
            {t`common:email`}
          </Label>
          <RequiredInput
            type="email"
            id="email"
            name="email"
            placeholder={t`common:email`}
            className="mb-6"
            autoComplete="email"
          />
          <Label htmlFor="password" className="mb-2">
            {t`common:password`}
          </Label>
          <RequiredInput
            type="password"
            id="password"
            name="password"
            placeholder={t`common:password`}
            className="mb-6"
          />
          <Button type="submit" className="mb-4">
            {isLogin ? t`common:sign-in` : t`common:register`}
          </Button>
        </form>
        {error && <p className="mb-4 text-center text-sm text-negative">{error}</p>}
        {successMessage && (
          <p className="mb-4 text-center text-sm text-positive">{successMessage}</p>
        )}
        <div className="flex justify-center">
          <Button
            variant="link"
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
              setSuccessMessage('');
            }}
          >
            {isLogin ? t`common:create-account` : t`common:back-to-login`}
          </Button>
        </div>
        <a
          href={`mailto:${process.env.NEXT_PUBLIC_SUPPORT_EMAIL}`}
          className="my-6 text-center text-sm text-secondary hover:text-c42orange"
        >
          {t`common:need-help`}
        </a>
      </div>
    </div>
  );
};

export default Login;
