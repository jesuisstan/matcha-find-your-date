'use client';

import { Dispatch, SetStateAction } from 'react';
import Image from 'next/image';
import { useTheme } from 'next-themes';

import * as AlertDialog from '@radix-ui/react-alert-dialog';
import clsx from 'clsx';

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

        <AlertDialog.Content className="fixed left-[50%] top-[50%] z-50 h-auto max-h-[95vh] w-fit max-w-[80vw] translate-x-[-50%] translate-y-[-50%] space-y-5 overflow-auto rounded-2xl bg-card p-6 shadow-md shadow-secondary focus:outline-none">
          <AlertDialog.Title
            className={clsx(
              `flex flex-wrap items-center justify-center gap-5 overflow-hidden`,
              'sm:justify-between'
            )}
          >
            <Image
              src="/identity/logo-transparent.png"
              alt="Q3"
              width={0}
              height={0}
              sizes="100vw"
              className={clsx(`h-7 w-auto`, theme === 'dark' ? 'darkmode-logo' : '')}
            />
            <span className="overflow-hidden text-ellipsis text-3xl">{title}</span>
          </AlertDialog.Title>
          <AlertDialog.Description>{children}</AlertDialog.Description>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
};

export default ModalBasic;
