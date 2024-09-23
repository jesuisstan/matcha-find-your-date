import { useRouter } from 'next/navigation';

import { LogOut } from 'lucide-react';

import { ButtonMatcha } from '@/components/ui/button-matcha';
import useSearchStore from '@/stores/search';
import useUserStore from '@/stores/user';
import { setUserOffline } from '@/utils/user-handlers';

const LogoutButton = ({ translate }: { translate: (key: string) => string }) => {
  const { user, logout, setGlobalLoading } = useUserStore((state) => ({
    user: state.user,
    logout: state.logout,
    setGlobalLoading: state.setGlobalLoading,
  }));
  const { resetSearchStore } = useSearchStore();
  const router = useRouter();

  const handleLogout = async () => {
    setGlobalLoading(true); // set global loading
    await setUserOffline(user?.id!); // set user offline
    resetSearchStore(); // reset search store
    logout(); // logout users
    await new Promise((resolve) => setTimeout(resolve, 100)); // wait for some time to ensure logout is processed
    setGlobalLoading(false); // set global loading
    router.push('/login');
  };

  return (
    <div className="items-center">
      <ButtonMatcha
        variant="ghost"
        size="icon"
        title={translate(`auth.logout`)}
        onClick={handleLogout}
        className="smooth42transition hover:bg-transparent hover:text-c42orange"
      >
        <div className="flex flex-row items-center gap-2">
          <LogOut />
          {/*<p>{translate(`auth.logout`)}</p>*/}
          <span className="sr-only">{translate(`auth.logout`)}</span>
        </div>
      </ButtonMatcha>
    </div>
  );
};

export default LogoutButton;
