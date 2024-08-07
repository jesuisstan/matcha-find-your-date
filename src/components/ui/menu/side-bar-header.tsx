import { useRouter } from 'next/navigation';

import { UserNameSkeleton } from './menu-skeleton';

import LanguageSelector from '@/components/ui/menu/language-selector';
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
        <div className="items-center">
          <ThemeToggler />
        </div>

        <LanguageSelector />
        <div className="items-center">
          <button className="pb-1 hover:text-c42orange" onClick={handleLogout}>
            {translate(`auth.logout`)}
          </button>
        </div>

        {/* horizontal divider */}
        <div className="mt-3 w-52 border-t border-secondary opacity-40" />
      </div>
    </div>
  );
};

export default SideBarHeader;
