import { useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export const langList: { [key: string]: string } = {
  fr: 'Français',
  en: 'English',
  ru: 'Русский',
};

export default function useLanguage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Retrieve the initial language from localStorage or default to 'en'
  const [lang, setLang] = useState<string>(() => {
    const savedLang = localStorage.getItem('lang');
    return savedLang && langList[savedLang] ? savedLang : 'en';
  });

  const changeLanguage = (locale: string) => {
    const verifiedLocale = langList[locale] ? locale : 'en';
    localStorage.setItem('lang', verifiedLocale);
    setLang(verifiedLocale);

    const current = new URLSearchParams(Array.from(searchParams.entries()));
    current.set('lang', verifiedLocale);

    // Renew the search query
    const search = current.toString();
    const query = search ? `?${search}` : '';
    //router.push(`${pathname}${query}`);
    router.replace(`${pathname}${query}`, { scroll: false });
  };

  return { lang, setLang: changeLanguage };
}
