'use client';

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

import clsx from 'clsx';
import { Eye, EyeOff } from 'lucide-react';

import LocaleSwitcher from '@/components/locale-switcher';
import { ButtonMatcha } from '@/components/ui/button-matcha';
import { Label } from '@/components/ui/label';
import RadioGroup from '@/components/ui/radio/radio-group';
import { RequiredInput } from '@/components/ui/required-input';
import useSearchStore from '@/stores/search';
import useUserStore from '@/stores/user';

const Login = () => {
  const t = useTranslations();
  const { resetSearchStore } = useSearchStore();
  const router = useRouter();
  const [pageLayout, setPageLayout] = React.useState('login');
  const formRef = React.useRef<HTMLFormElement>(null);
  const [error, setError] = React.useState('');
  const [successMessage, setSuccessMessage] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  const { user, setUser } = useUserStore((state) => ({
    user: state.user,
    setUser: state.setUser,
  }));
  const [loading, setLoading] = React.useState(false);
  const [loginMethod, setLoginMethod] = React.useState('email'); // <'email' | 'nickname'>
  const [sex, setSex] = React.useState('male'); // <'male' | 'female'>

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

    // Trim spaces from all input values
    formData.forEach((value, key) => {
      if (typeof value === 'string') {
        formData.set(key, value.trim());
      }
    });

    let response;
    switch (pageLayout) {
      case 'login':
        setLoading(true);
        resetSearchStore(); // reset search store
        response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: formData.get('email'),
            password: formData.get('password'),
            nickname: formData.get('nickname-login'),
          }),
        });
        setLoading(false);
        break;
      case 'register':
        setLoading(true);
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
            sex: sex,
          }),
        });
        setLoading(false);
        break;
      case 'confirmation':
        setLoading(true);
        response = await fetch('/api/auth/resend-confirmation-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: formData.get('email'),
          }),
        });
        setLoading(false);
        break;
      case 'forgot':
        setLoading(true);
        response = await fetch('/api/auth/password-forgotten-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: formData.get('email'),
          }),
        });
        setLoading(false);
        break;
    }

    if (!response) return;

    const result = await response.json();

    if (response.ok) {
      switch (pageLayout) {
        case 'login':
          if (result.user.confirmed) {
            setLoading(true);
            document.cookie = `token=${result.token}; path=/`;
            setUser(result.user);
            window.location.href = `/dashboard`;
          } else {
            setError(t(`auth.${result.error}`));
          }
          break;
        case 'register':
          setSuccessMessage(t(`auth.${result.message}`));
          setPageLayout('login');
          break;
        case 'confirmation':
          setSuccessMessage(t(`auth.${result.message}`));
          break;
        case 'forgot':
          setSuccessMessage(t(`auth.${result.message}`));
          break;
      }
    } else {
      setError(t(`auth.${result.error}`));
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
            priority
          />
          <div className="absolute bottom-0 z-10 bg-card/85 p-4 text-foreground">
            <h2 className="mb-2 text-4xl">Make love, not war</h2>
            <p className="text-sm">
              Matcha Dating App{'. '}
              {/*{t(`service-provided`)}{' '}
              <a
                href={`https://www.krivtsoff.site/`}
                target="_blank"
                className="hover:text-c42green my-6 text-center text-sm text-c42orange transition-all duration-300 ease-in-out"
              >
                Stan Krivtsoff
              </a>
              {'. '}*/}
              {t(`rights-reserved`)}
              {'.'}
            </p>
          </div>
        </div>
      </div>
      <div
        className={clsx(
          'm-auto flex h-full w-full flex-col overflow-y-scroll pl-5 pr-5',
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
          priority
        />
        <div className="mb-5 flex self-center">
          <LocaleSwitcher />
        </div>
        <h2 className="mb-5 text-center text-3xl text-foreground">
          {pageLayout === 'login' && t(`auth.sign-in`)}
          {pageLayout === 'register' && t(`auth.register-new`)}
          {pageLayout === 'confirmation' && t(`auth.confirm-email`)}
          {pageLayout === 'forgot' && t(`auth.reset-password`)}
        </h2>
        {pageLayout === 'login' && (
          <div className="mb-7 flex flex-row justify-start gap-5">
            <RadioGroup
              label={t(`auth.login-method`) + ':'}
              options={[
                { value: 'email', label: t(`auth.email`) },
                { value: 'nickname', label: t(`nickname`) },
              ]}
              defaultValue="email"
              selectedItem={loginMethod}
              onSelectItem={setLoginMethod}
            />
          </div>
        )}
        <form className="flex flex-col" onSubmit={handleSubmit} ref={formRef}>
          {pageLayout === 'register' && (
            <>
              <Label htmlFor="firstname" className="mb-2">
                {t(`firstname`)}
              </Label>
              <RequiredInput
                type="text"
                id="firstname"
                name="firstname"
                placeholder={t(`firstname`)}
                maxLength={21}
                pattern="^[A-Za-z\-]{1,21}$"
                errorMessage={t('auth.max-char') + ' 21: a-Z, -'}
                className="mb-2"
              />
              <Label htmlFor="lastname" className="mb-2">
                {t(`lastname`)}
              </Label>
              <RequiredInput
                type="text"
                id="lastname"
                name="lastname"
                placeholder={t('lastname')}
                maxLength={21}
                pattern="^[A-Za-z\-]{1,21}$"
                errorMessage={t('auth.max-char') + ' 21: a-Z, -'}
                className="mb-2"
              />
              <Label htmlFor="nickname" className="mb-2">
                {t(`nickname`)}
              </Label>
              <RequiredInput
                type="text"
                id="nickname"
                name="nickname"
                placeholder={t(`nickname`)}
                pattern="^[A-Za-z0-9\-@]{1,21}$"
                maxLength={21}
                errorMessage={t('auth.max-char') + ' 21: a-Z 0-9 - @'}
                className="mb-2"
              />
              <div className="flex flex-row gap-10">
                <div className="flex flex-col">
                  <Label htmlFor="birthdate" className="mb-2">
                    {t(`birthdate`)}
                  </Label>
                  <RequiredInput
                    type="date"
                    id="birthdate"
                    name="birthdate"
                    placeholder={t(`birthdate`)}
                    className="mb-2"
                  />
                </div>
                <div className="flex flex-col self-start">
                  <RadioGroup
                    label={t(`selector.sex`) + ':'}
                    options={[
                      { value: 'male', label: t(`male`) },
                      { value: 'female', label: t(`female`) },
                    ]}
                    defaultValue="male"
                    selectedItem={sex}
                    onSelectItem={setSex}
                  />
                </div>
              </div>
            </>
          )}
          {pageLayout === 'login' && loginMethod === 'nickname' && (
            <>
              <Label htmlFor="nickname-login" className="mb-2">
                {t(`nickname`)}
              </Label>
              <RequiredInput
                type="text"
                id="nickname-login"
                name="nickname-login"
                placeholder={t(`nickname`)}
                pattern="^[A-Za-z0-9\-@]{1,21}$"
                maxLength={21}
                errorMessage={t('auth.max-char') + ' 21: a-Z 0-9 - @'}
                className="mb-2"
              />
            </>
          )}
          {((pageLayout === 'login' && loginMethod === 'email') || pageLayout !== 'login') && (
            <>
              <Label htmlFor="email" className="mb-2">
                {t(`auth.email`)}
              </Label>
              <RequiredInput
                type="email"
                id="email"
                name="email"
                placeholder={t(`auth.email`)}
                autoComplete="email"
                maxLength={42}
                //errorMessage="Valid email with max length 42"
                //pattern="^(?=.{1,42}$)\\S+@\\S+\\.\\S+$"
                className="mb-2"
              />
            </>
          )}
          {pageLayout !== 'confirmation' && pageLayout !== 'forgot' && (
            <>
              <Label htmlFor="password" className="mb-2">
                {t(`auth.password`)}
              </Label>
              <div className="relative">
                <RequiredInput
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  placeholder={t(`auth.password`)}
                  autoComplete="current-password"
                  errorMessage={t(`auth.password-requirements`)}
                  minLength={8}
                  maxLength={21}
                  pattern="^(?=.*[a-z])(?=.*[0-9])(?=.*[A-Z])(?=.*[@$!%*?&,.^=_+])[A-Za-z0-9@$!%*?&,.^=_+]{8,21}$"
                  className="mb-5"
                />
                <button
                  type="button"
                  className="absolute right-2 top-[7px] text-secondary"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
            </>
          )}
          <ButtonMatcha type="submit" className="mb-5" loading={loading}>
            {pageLayout === 'login' && t(`auth.sign-in`)}
            {pageLayout === 'register' && t(`auth.sign-up`)}
            {pageLayout === 'confirmation' && t(`auth.resend-confirmation-email`)}
            {pageLayout === 'forgot' && t(`auth.send-reset-link`)}
          </ButtonMatcha>
        </form>
        {error && <p className="mb-5 text-center text-sm text-negative">{error}</p>}
        {successMessage && (
          <p className="mb-5 text-center text-sm text-positive">{successMessage}</p>
        )}
        <div className="flex justify-center">
          {pageLayout !== 'login' && (
            <ButtonMatcha
              variant="link"
              onClick={() => {
                setPageLayout('login');
                setError('');
                setSuccessMessage('');
              }}
            >
              {t(`auth.back-to-login`)}
            </ButtonMatcha>
          )}
          {pageLayout === 'login' && (
            <>
              <ButtonMatcha
                variant="link"
                onClick={() => {
                  setPageLayout('register');
                  setError('');
                  setSuccessMessage('');
                }}
                disabled={loading}
              >
                {t(`auth.create-account`)}
              </ButtonMatcha>
              <ButtonMatcha
                variant="link"
                onClick={() => {
                  setPageLayout('confirmation');
                  setError('');
                  setSuccessMessage('');
                }}
                disabled={loading}
              >
                {t(`auth.confirm-email`)}
              </ButtonMatcha>
              <ButtonMatcha
                variant="link"
                onClick={() => {
                  setPageLayout('forgot');
                  setError('');
                  setSuccessMessage('');
                }}
                disabled={loading}
              >
                {t(`auth.forgot-password`)}
              </ButtonMatcha>
            </>
          )}
        </div>
        <a
          href={`mailto:${process.env.NEXT_PUBLIC_SUPPORT_EMAIL}`}
          className="my-6 text-center text-sm text-secondary transition-all duration-300 ease-in-out hover:text-c42orange"
        >
          {t(`need-help`)}
        </a>
      </div>
    </div>
  );
};

export default Login;
