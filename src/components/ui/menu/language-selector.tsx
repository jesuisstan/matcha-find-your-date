import { FC, useEffect } from 'react';

import { LanguagesIcon } from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSelector,
} from '@/components/ui/dropdown-primitives';
import useLanguage, { langList } from '@/hooks/useLanguage';

const LanguageSelector: FC = () => {
  const { lang, setLang } = useLanguage();

  useEffect(() => {
    const savedLang = localStorage.getItem('lang') ?? 'en';
    setLang(savedLang);
  }, []);

  return (
    <DropdownMenu>
      <div className="flex flex-row items-center justify-center align-middle">
        <DropdownMenuSelector
          asChild
          value={langList[lang as keyof typeof langList]}
          startIcon={<LanguagesIcon className="text-secondary" size={21} />}
          className="w-40 border-0 hover:text-c42orange"
        />
        <DropdownMenuPortal>
          <DropdownMenuContent sideOffset={5}>
            <DropdownMenuGroup>
              {Object.keys(langList).map((key) => (
                <DropdownMenuItem
                  key={key}
                  onClick={() => setLang(key)}
                  className={`justify-center ${lang === key ? 'font-bold' : ''}`}
                >
                  {langList[key]}
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenuPortal>
      </div>
    </DropdownMenu>
  );
};

export default LanguageSelector;
