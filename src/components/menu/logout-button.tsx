import { Dispatch, SetStateAction } from 'react';
import { useRouter } from 'next/navigation';

import { LogOut } from 'lucide-react';

import { ButtonMatcha } from '@/components/ui/button-matcha';
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
  const router = useRouter();

  const handleLogout = async () => {
    setLoading(true);
    await setUserOffline(user?.id!);
    logout();
    // wait for some time to ensure logout is processed
    await new Promise((resolve) => setTimeout(resolve, 100));
    setLoading(false);
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
        <LogOut />
        <span className="sr-only">{translate(`auth.logout`)}</span>
      </ButtonMatcha>
    </div>
  );
};

export default LogoutButton;
