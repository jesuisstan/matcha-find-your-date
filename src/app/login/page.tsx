'use client';

/* eslint-disable react/no-unescaped-entities */
import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';

import clsx from 'clsx';

//import LoginButton from './login-button';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function Login() {
  const router = useRouter();
  const formRef = React.useRef<HTMLFormElement>(null);
  const [error, setError] = React.useState('');

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    const currentForm = formRef.current;
    if (currentForm == null) return;
    const formData = new FormData(currentForm);
    if (!formData.get('username') || !formData.get('password')) return;

    const response = await signIn('login', {
      username: formData.get('username'),
      password: formData.get('password'),
      redirect: false,
    });

    if (response?.error) {
      setError(response.error);
      return;
    }

    // router.push(response?.url || '/');
    router.push('/dashboard');
  };

  React.useEffect(() => {
    // if (session && status === 'authenticated') {
    //   router.push('/');
    // }
  });

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
            src="/identity/background.png"
            alt="logo"
            fill
            placeholder="blur"
            blurDataURL="/identity/background.png"
            className="z-0"
            sizes={'100vw'}
          />
          <div className="absolute bottom-0 z-10 w-4/6 p-4">
            <h2 className="mb-2 text-4xl text-card">
              Make love, not war
            </h2>
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
        <h2 className="mb-6 text-2xl text-foreground">Dates Portal</h2>
        <p className="mb-6 text-sm text-secondary">Sign into your account</p>
        <form className="flex flex-col" onSubmit={handleSubmit} ref={formRef}>
          <Label htmlFor="username" className="mb-2">
            Username
          </Label>
          <Input
            type="username"
            id="username"
            name="username"
            placeholder="Username"
            className="mb-2"
            autoComplete="username"
          />
          <Label htmlFor="password" className="mb-2">
            Password
          </Label>
          <Input
            type="password"
            id="password"
            name="password"
            placeholder="Password"
            className="mb-4"
          />
          <Button type="submit" className="mb-4">
            Sign in
          </Button>
        </form>
        {error && <p className="mb-4 text-center text-sm text-negative">{error}</p>}
        {/* TODO: SSO Authentification */}
        {/* <p className="mb-4 text-center text-sm text-secondary">or</p>
        <LoginButton /> */}
        <a
          href="mailto:support@q3-technology.com"
          className="my-2 text-right text-sm text-secondary"
        >
          Need help? Contact Support
        </a>
      </div>
    </div>
  );
}
