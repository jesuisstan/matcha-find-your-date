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

  const handleLogout = () => {
    logout();
    router.push('/login'); // Перенаправляем на страницу входа после выхода из системы
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
        <div className="items-center">
          <a
            href={`mailto:${process.env.NEXT_PUBLIC_SUPPORT_EMAIL}`}
            target="_blank"
            rel="noopener noreferrer"
            className="items-center hover:text-negative"
          >
            {translate(`common:contact-support`)}
          </a>
        </div>
        <LanguageSelector />
        <div className="items-center">
          <button className="pb-1 hover:text-negative" onClick={handleLogout}>
            {translate(`common:log-out`)}
          </button>
        </div>

        {/* horizontal divider */}
        <div className="mt-3 w-52 border-t border-secondary opacity-40" />
      </div>
    </div>
  );
};

export default SideBarHeader;
