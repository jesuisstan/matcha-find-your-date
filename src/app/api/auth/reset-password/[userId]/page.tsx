'use client';

/* eslint-disable react/no-unescaped-entities */
import React from 'react';
import Image from 'next/image';
import { useParams, useRouter, useSearchParams } from 'next/navigation';

import clsx from 'clsx';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// type for password policy
const PolicyPassword = z.object({
  // password must be at least 20 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character
  password: z
    .string()
    .min(20)
    .regex(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{20,}$/, {
      message:
        'Password must be at least 20 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character',
    }),
  // password must be at least 20 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character
  confirmPassword: z
    .string()
    .min(20)
    .regex(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{20,}$/, {
      message:
        'Password must be at least 20 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character',
    }),
});

const ResetPasswordSchema = z.object({
  password: PolicyPassword.shape.password,
  confirmPassword: PolicyPassword.shape.confirmPassword,
});

export default function ResetPassword() {
  const router = useRouter();
  const { userId } = useParams();
  const searchParams = useSearchParams();

  const resetToken = searchParams.get('token');

  console.log('resetToken', resetToken);

  const formRef = React.useRef<HTMLFormElement>(null);
  const [error, setError] = React.useState('');

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    const currentForm = formRef.current;
    if (!currentForm) return;

    const formData = new FormData(currentForm);
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    if (!password || !confirmPassword) {
      setError('Password and confirm password are required');
      return;
    }

    const formDataToValidate = { password, confirmPassword };
    const validation = ResetPasswordSchema.safeParse(formDataToValidate);

    if (!validation.success) {
      const firstIssue = validation.error.issues[0];
      const errorMessage = `${firstIssue.message} ${firstIssue.path.join(' ')}`;
      setError(errorMessage);
      return;
    }

    if (password !== confirmPassword) {
      setError('Password and confirm password must be the same');
      return;
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/user/${userId}/password/reset`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: userId,
            password,
            reset_token: resetToken,
          }),
        }
      );

      if (res.ok) {
        router.push('/login');
      } else {
        handleFetchErrors(res.status);
      }
    } catch (error) {
      setError('An error occurred while resetting the password');
      console.error('Error resetting password:', error);
    }
  };

  const handleFetchErrors = (status: number) => {
    switch (status) {
      case 422:
        setError('Invalid link');
        break;
      case 406:
        setError('Wrong token');
        break;
      default:
        setError('An unexpected error occurred');
    }
  };

  return (
    <div className={clsx('flex h-screen w-screen flex-row items-center justify-center bg-card')}>
      <div
        className={clsx(
          'm-auto flex h-full w-full flex-col items-center justify-center p-8',
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
        <h2 className="mb-6 text-2xl text-foreground">Reset Password</h2>
        <div className="mb-4">
          <p className="text-sm text-secondary">
            Before resetting your password, please confirm that you have access to your account. For
            the password reset to work, you must follow the steps below:
          </p>
          <ol className="m-4 list-decimal text-sm text-secondary">
            <li>Password must be at least 20 characters long</li>
            <li>At least one uppercase letter</li>
            <li>At least one lowercase letter</li>
            <li>At least one number</li>
            <li>At least one special character</li>
            <li>Click on the "Reset password" button</li>
          </ol>
        </div>
        <form className="flex w-[300px] flex-col" onSubmit={handleSubmit} ref={formRef}>
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
          <Label htmlFor="confirmPassword" className="mb-2">
            Confirm Password
          </Label>
          <Input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            placeholder="Confirm Password"
            className="mb-4"
          />
          <Button type="submit" className="mb-4">
            Reset Password
          </Button>
        </form>
        {error && <p className="mb-4 text-center text-sm text-negative">{error}</p>}
        <a href="mailto:support@q3-technology.com" className="my-2 text-sm text-secondary">
          If you have not received an email with instructions to reset your password, please contact
          support@q3-technology.com.
        </a>
      </div>
    </div>
  );
}
