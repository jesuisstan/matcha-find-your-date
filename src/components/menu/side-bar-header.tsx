import { useRouter } from 'next/navigation';

import { LogOut } from 'lucide-react';

import { UserNameSkeleton } from './menu-skeleton';

import LocaleSwitcher from '@/components/locale-switcher';
import { ButtonMatcha } from '@/components/ui/button-matcha';
import ThemeToggler from '@/components/ui/theme-toggler';
import useUserStore from '@/stores/user';
import { formatUserName, formatUserNameOneLetter } from '@/utils/format-string';

const SideBarHeader = ({
  name,
  translate,
}: {
  name?: string;
  translate: (key: string) => string;
}) => {
  const logout = useUserStore((state) => state.logout);
  const router = useRouter();

  const handleLogout = async () => {
    logout();
    // wait for some time to ensure logout is processed
    await new Promise((resolve) => setTimeout(resolve, 100));
    router.push('/login');
  };

  return (
    <div className="flex flex-col items-center justify-center gap-2 align-middle">
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

      <div className="flex flex-col gap-2 text-center text-xs font-normal text-foreground">
        <div className="mb-3 mt-5 flex self-center">
          <LocaleSwitcher />
        </div>

        <div className="flex flex-row space-x-4 self-center align-middle">
          <div className="items-center">
            <ThemeToggler translate={translate} />
          </div>

          <div className="items-center">
            <ButtonMatcha
              variant="ghost"
              size="icon"
              title={translate(`auth.logout`)}
              onClick={handleLogout}
              className="transition-all duration-300 ease-in-out hover:bg-transparent hover:text-c42orange"
            >
              <LogOut />
              <span className="sr-only">{translate(`auth.logout`)}</span>
            </ButtonMatcha>
          </div>
        </div>

        {/* horizontal divider */}
        <div className="mt-3 w-52 border-t border-secondary opacity-40" />
      </div>
    </div>
  );
};

export default SideBarHeader;