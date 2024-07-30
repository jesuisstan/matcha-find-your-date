'use client';

import { signIn } from 'next-auth/react';

import { Button } from '@/components/ui/button';

const LoginButton = () => {
  return (
    <Button onClick={() => signIn('azure-ad')} className="mb-2">
      {/* <div className="mr-3 h-5 w-5">
        <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 21 21">
          <title>MS-SymbolLockup</title>
          <rect x="1" y="1" width="9" height="9" fill="#f25022" />
          <rect x="1" y="11" width="9" height="9" fill="#00a4ef" />
          <rect x="11" y="1" width="9" height="9" fill="#7fba00" />
          <rect x="11" y="11" width="9" height="9" fill="#ffb900" />
        </svg>
      </div> */}
      Sign in with Q3 account
    </Button>
  );
};

export default LoginButton;
