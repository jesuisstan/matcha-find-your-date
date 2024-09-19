import { Dispatch, SetStateAction } from 'react';
import { useRouter } from 'next/navigation';

import { LogOut } from 'lucide-react';

import { ButtonMatcha } from '@/components/ui/button-matcha';
import useSearchFiltersStore from '@/stores/search';
import useUserStore from '@/stores/user';
import { setUserOffline } from '@/utils/user-handlers';

const LogoutButton = ({
  translate,
  setLoading,
}: {
  translate: (key: string) => string;
  setLoading: Dispatch<SetStateAction<boolean>>;
}) => {
  const { user, logout } = useUserStore((state) => ({
    user: state.user,
    logout: state.logout,
  }));
  const { resetSearchFiltersStore } = useSearchFiltersStore();
  const router = useRouter();

  const handleLogout = async () => {
    setLoading(true);
    await setUserOffline(user?.id!); // set user offline
    resetSearchFiltersStore(); // reset search filters
    logout(); // logout users
    await new Promise((resolve) => setTimeout(resolve, 100)); // wait for some time to ensure logout is processed
    setLoading(false);
    router.push('/login');
  };

  return (
    <div className="items-center">
      <ButtonMatcha
        variant="ghost"
        size="default"
        title={translate(`auth.logout`)}
        onClick={handleLogout}
        className="smooth42transition hover:bg-transparent hover:text-c42orange"
      >
        <div className="flex flex-row items-center gap-2">
          <LogOut />
          <p>{translate(`auth.logout`)}</p>
        </div>
      </ButtonMatcha>
    </div>
  );
};

export default LogoutButton;
