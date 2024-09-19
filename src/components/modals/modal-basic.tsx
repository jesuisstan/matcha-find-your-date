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

        <AlertDialog.Content className="fixed left-[50%] top-[50%] z-50 h-auto max-h-[95vh] w-96 max-w-[95vw] translate-x-[-50%] translate-y-[-50%] space-y-5 overflow-auto rounded-2xl bg-card p-6 shadow-md shadow-secondary transition-all duration-300 ease-in-out focus:outline-none xs:w-fit">
          <AlertDialog.Title
            className={clsx(
              `mt-8 flex flex-wrap items-center justify-center overflow-hidden pl-10 pr-10`
            )}
          >
            <Image
              src="/identity/logo-title-only.png"
              alt="matcha-title-only-logo"
              width={0}
              height={0}
              sizes="100vw"
              className={clsx(
                `absolute left-3 top-3 h-5 w-auto`,
                theme === 'dark' ? 'darkmode-logo' : ''
              )}
            />
            <span className="overflow-hidden text-ellipsis text-center text-2xl">{title}</span>

            {setIsOpen && (
              <button
                className="absolute right-1 top-1 rounded-full p-1 transition-all duration-300 ease-in-out hover:bg-muted"
                onClick={() => setIsOpen?.(false)}
                aria-label="Close"
              >
                <X size={24} />
              </button>
            )}
          </AlertDialog.Title>
          <AlertDialog.Description />
          {children}
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
};

export default ModalBasic;
