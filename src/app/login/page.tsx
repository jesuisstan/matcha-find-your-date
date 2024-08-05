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
  const setUser = useUserStore((state) => state.setUser);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
        document.cookie = `token=${result.token}; path=/`;
        setUser(result.user); // setUser is a function from useUserStore
        router.push('/dashboard');
      } else {
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
        <div className="relative h-full w-full">
          <Image
            src="/identity/background.jpg"
            alt="hearts"
            fill
            placeholder="blur"
            blurDataURL="/identity/background.jpg"
            className="z-0"
            sizes={'100vw'}
          />
          <div className="absolute bottom-0 z-10 w-4/6 p-4">
            <h2 className="mb-2 text-4xl text-card">Make love, not war</h2>
            <p className="text-sm text-card">
              This service is provided by Stan Krivtsoff. © 2024 - All rights reserved.
            </p>
          </div>
        </div>
      </div>
      <div className={clsx('m-auto flex h-full w-full flex-col p-8', 'md:w-1/3', 'lg:w-1/4')}>
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
                First Name
              </Label>
              <RequiredInput
                type="text"
                id="firstname"
                name="firstname"
                placeholder="First Name"
                className="mb-6"
              />
              <Label htmlFor="lastname" className="mb-2">
                Last Name
              </Label>
              <RequiredInput
                type="text"
                id="lastname"
                name="lastname"
                placeholder="Last Name"
                className="mb-6"
              />
              <Label htmlFor="nickname" className="mb-2">
                Nickname
              </Label>
              <RequiredInput
                type="text"
                id="nickname"
                name="nickname"
                placeholder="Nickname"
                className="mb-6"
              />
              <Label htmlFor="birthdate" className="mb-2">
                Birthdate
              </Label>
              <RequiredInput
                type="date"
                id="birthdate"
                name="birthdate"
                placeholder="Birthdate"
                className="mb-6"
              />
              <div className="mb-6">
                <RadioGroup
                  name="sex"
                  label={t`common:selector.select-sex`}
                  options={[
                    { value: 'male', label: t`common:male` },
                    { value: 'female', label: t`common:female` },
                  ]}
                  defaultValue="male"
                />
              </div>
            </>
          )}
          <Label htmlFor="email" className="mb-2">
            Email
          </Label>
          <RequiredInput
            type="email"
            id="email"
            name="email"
            placeholder="Email"
            className="mb-6"
            autoComplete="email"
          />
          <Label htmlFor="password" className="mb-2">
            Password
          </Label>
          <RequiredInput
            type="password"
            id="password"
            name="password"
            placeholder="Password"
            className="mb-6"
          />
          <Button type="submit" className="mb-4">
            {isLogin ? 'Sign in' : 'Register'}
          </Button>
        </form>
        {error && <p className="mb-4 text-center text-sm text-negative">{error}</p>}
        <div className="flex justify-center">
          <Button variant="link" onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? 'Create an account' : 'Already have an account? Sign in'}
          </Button>
        </div>
        <a
          href={`mailto:${process.env.NEXT_PUBLIC_SUPPORT_EMAIL}`}
          className="my-2 text-right text-sm text-secondary hover:text-negative"
        >
          Need help? Contact Support
        </a>
      </div>
    </div>
  );
};

export default Login;
