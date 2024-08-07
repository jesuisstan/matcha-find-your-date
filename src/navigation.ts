/* next-intl provides drop-in replacements for common Next.js navigation APIs that automatically handle the user locale and pathnames behind the scenes. */

import { createSharedPathnamesNavigation } from 'next-intl/navigation';

import { locales } from './i18n';

export const { Link, redirect, usePathname, useRouter } = createSharedPathnamesNavigation({
  locales,
});
