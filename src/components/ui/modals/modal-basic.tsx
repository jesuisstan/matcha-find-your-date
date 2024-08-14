'use client';

import { Dispatch, SetStateAction } from 'react';
import Image from 'next/image';
import { useTheme } from 'next-themes';

import * as AlertDialog from '@radix-ui/react-alert-dialog';
import clsx from 'clsx';
import { X } from 'lucide-react';

const ModalBasic = ({
  title,
  isOpen,
  setIsOpen,
  children,
}: {
  title: string;
  isOpen: boolean;
  setIsOpen?: Dispatch<SetStateAction<boolean>>;
  children: React.ReactNode;
}) => {
  const { theme } = useTheme();

  return (
    <AlertDialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="fixed inset-0 z-50 bg-black bg-opacity-30 backdrop-blur-sm" />

        <AlertDialog.Content className="fixed left-[50%] top-[50%] z-50 h-auto max-h-[95vh] w-fit max-w-[95vw] translate-x-[-50%] translate-y-[-50%] space-y-5 overflow-auto rounded-2xl bg-card p-6 shadow-md shadow-secondary transition-all duration-300 ease-in-out focus:outline-none">
          <AlertDialog.Title
            className={clsx(
              `flex flex-wrap items-center justify-center gap-5 overflow-hidden`,
              'sm:justify-between'
            )}
          >
            <span className=" overflow-hidden text-ellipsis text-3xl sm:ml-10">{title}</span>
            <Image
              src="/identity/logo-title-only.png"
              alt="matcha-title-only-logo"
              width={0}
              height={0}
              sizes="100vw"
              className={clsx(` h-7 w-auto`, `sm:mr-10`, theme === 'dark' ? 'darkmode-logo' : '')}
            />

            <button
              className="absolute right-3 top-3 rounded-md p-1 hover:bg-gray-200 dark:hover:bg-gray-700"
              onClick={() => setIsOpen?.(false)}
              aria-label="Close"
            >
              <X size={24} />
            </button>
          </AlertDialog.Title>
          <AlertDialog.Description>{children}</AlertDialog.Description>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
};

export default ModalBasic;
