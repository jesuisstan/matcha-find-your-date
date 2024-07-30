import { signOut } from 'next-auth/react';

import { UserNameSkeleton } from './menu-skeleton';

import ClearLocalStorageButton from '@/components/ui/clear-storage-btn/clear-storage-btn';
import LanguageSelector from '@/components/ui/menu/language-selector';
import ThemeToggler from '@/components/ui/theme-toggler';
import { formatUserName, formatUserNameOneLetter } from '@/utils/format-string';

const SideBarHeader = ({
  name,
  translate,
}: {
  name?: string;
  translate: (key: string) => string;
}) => {
  return (
    <div className="flex flex-col items-center justify-center align-middle">
      <div
        title={name}
        className="flex items-center justify-center space-x-4 align-middle font-bold "
      >
        {/* Avatar */}
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-foreground text-base text-card">
          {name && formatUserNameOneLetter(name)}
        </div>

        {/* Username */}
        <div className="text-2xl text-foreground">
          {name ? (
            <div className="max-w-[180px] truncate">{name && formatUserName(name)}</div>
          ) : (
            <UserNameSkeleton />
          )}
        </div>
      </div>
      <div className="flex flex-col text-center text-xs font-normal text-foreground">
        <div className="items-center">
          <ThemeToggler />
        </div>
        <div className="mb-2 items-center">
          {/* todo: delete "mb-2 from className up when LanguageSelector returnes back to layout*/}
          <a
            href="mailto:support@q3-technology.com"
            target="_blank"
            rel="noopener noreferrer"
            className="items-center hover:text-negative"
          >
            {translate(`common:contact-support`)}
          </a>
        </div>
        {/*<LanguageSelector />*/}
        <div className="items-center">
          <button className="pb-1 hover:text-negative" onClick={() => signOut()}>
            {translate(`common:log-out`)}
          </button>
        </div>
        <div className="items-center">
          <ClearLocalStorageButton />
        </div>

        {/* horizontal divider */}
        <div className="mt-3 w-52 border-t border-secondary opacity-40" />
      </div>
    </div>
  );
};

export default SideBarHeader;
