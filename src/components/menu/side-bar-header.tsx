import { Dispatch, SetStateAction, useState } from 'react';

import { Settings } from 'lucide-react';

import LocaleSwitcher from '@/components/locale-switcher';
import LogoutButton from '@/components/menu/logout-button';
import { UserNameSkeleton } from '@/components/menu/menu-skeleton';
import ModalSettings from '@/components/modals/modal-settings';
import AvatarMini from '@/components/ui/avatar-mini';
import { ButtonMatcha } from '@/components/ui/button-matcha';
import ThemeToggler from '@/components/ui/theme-toggler';
import { formatUserName } from '@/utils/format-string';

const SideBarHeader = ({
  name,
  photoUrl,
  translate,
  setLoading,
}: {
  name?: string;
  photoUrl?: string;
  translate: (key: string) => string;
  setLoading: Dispatch<SetStateAction<boolean>>;
}) => {
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center gap-2 align-middle">
      <div
        title={name}
        className="flex items-center justify-center space-x-4 align-middle font-bold "
      >
        {/* Avatar */}
        <AvatarMini src={photoUrl!} nickname={name || ''} rounded />

        {/* Nickname */}
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

        <div className="flex flex-row gap-x-1 self-center align-middle">
          <ThemeToggler translate={translate} />
          <div className="items-center">
            <ModalSettings show={showSettingsModal} setShow={setShowSettingsModal} />
            <ButtonMatcha
              variant="ghost"
              size="icon"
              title={translate(`settings`)}
              onClick={() => setShowSettingsModal(true)}
              className="smooth42transition hover:bg-transparent hover:text-c42orange"
            >
              <Settings />
              <span className="sr-only">{translate(`settings`)}</span>
            </ButtonMatcha>
          </div>
          <LogoutButton translate={translate} setLoading={setLoading} />
        </div>

        {/* horizontal divider */}
        <div className="mt-3 w-52 border-t border-secondary opacity-40" />
      </div>
    </div>
  );
};

export default SideBarHeader;
