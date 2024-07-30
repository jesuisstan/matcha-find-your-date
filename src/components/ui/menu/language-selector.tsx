import React from 'react';

import { LanguagesIcon } from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSelector,
} from '@/components/ui/dropdown-primitives';
import useSetLanguage from '@/hooks/useSetLanguage';
import useUserStore from '@/stores/user';

const LanguageSelector: React.FC = () => {
  const langList = {
    fr: 'Français',
    en: 'English',
    cn: '中文',
  };
  const lang = useUserStore((state) => state?.user?.lang);
  const setLanguage = useSetLanguage();

  return (
    <DropdownMenu>
      <div className="flex flex-row items-center justify-center align-middle">
        <DropdownMenuSelector
          asChild
          value={langList[lang as keyof typeof langList]}
          startIcon={<LanguagesIcon className="text-secondary" size={30} />}
          className="w-24 border-0 hover:text-negative"
        />
        <DropdownMenuPortal>
          <DropdownMenuContent sideOffset={5}>
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => setLanguage('en')} className="justify-center">
                English
              </DropdownMenuItem>

              <DropdownMenuItem onClick={() => setLanguage('fr')} className="justify-center">
                Français
              </DropdownMenuItem>

              <DropdownMenuItem onClick={() => setLanguage('cn')} className="justify-center">
                中文
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenuPortal>
      </div>
    </DropdownMenu>
  );
};

export default LanguageSelector;
