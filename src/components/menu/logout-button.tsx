import { useRouter } from 'next/navigation';

import { LogOut } from 'lucide-react';

import { ButtonMatcha } from '@/components/ui/button-matcha';
import useUserStore from '@/stores/user';

const LogoutButton = ({ translate }: { name?: string; translate: (key: string) => string }) => {
  const logout = useUserStore((state) => state.logout);
  const router = useRouter();

  const handleLogout = async () => {
    logout();
    // wait for some time to ensure logout is processed
    await new Promise((resolve) => setTimeout(resolve, 100));
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
