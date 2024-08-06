import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import useUserStore from '@/stores/user';

export default function useSetLanguage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const setLang = useUserStore((state) => state.setLang);

  return (locale: string) => {
    const current = new URLSearchParams(Array.from(searchParams.entries())); // -> has to use this form

    current.set('lang', locale);

    // cast to string
    const search = current.toString();
    // or const query = `${'?'.repeat(search.length && 1)}${search}`;
    const query = search ? `?${search}` : '';

    setLang(locale);

    router.push(`${pathname}${query}`);
  };
}
