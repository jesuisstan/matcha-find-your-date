'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useTheme } from 'next-themes';

import clsx from 'clsx';
import { LayoutDashboard, MenuIcon } from 'lucide-react';

import ContactSupportBlock from '@/components/menu/contact-support-block';
import MenuList from '@/components/menu/menu-list';
import SideBarHeader from '@/components/menu/side-bar-header';
import MenuSkeleton from '@/components/ui/skeletons/menu-skeleton';
import { usePathname } from '@/navigation';
import useUserStore from '@/stores/user';

const Menu: React.FC = () => {
  const { theme } = useTheme();
  const t = useTranslations();
  const { user, globalLoading } = useUserStore((state) => ({
    user: state.user,
    globalLoading: state.globalLoading,
  }));
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null); // to handle closing on outside click
  const [isClient, setIsClient] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  /* To render Menu only on client side to avoid hydration errors */
  useEffect(() => {
    setIsClient(true);
  }, []);

  /* To blur the content when SidebarMenu is opened */
  useEffect(() => {
    const handleWindowResize = () => {
      const windowWidth = window.innerWidth;
      if (windowWidth >= 1200 && isSidebarOpen) {
        setIsSidebarOpen(false);
      }
    };
    window.addEventListener('resize', handleWindowResize);
    const mainElement = document?.getElementById('main-content') || null;
    isSidebarOpen
      ? (mainElement!.style.filter = 'blur(3px)')
      : (mainElement!.style.filter = 'none');
    return () => {
      window.removeEventListener('resize', handleWindowResize);
    };
  }, [isSidebarOpen]);

  /* Event listener to close Menu when clicking outside */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsSidebarOpen(false);
      }
    };
    if (isSidebarOpen) {
      document.addEventListener('click', handleClickOutside);
    }
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isSidebarOpen]);

  return (
    <div className="relative z-50 h-10 w-[330px] flex-shrink">
      {/* Menu on small screens */}
      <div
        className={clsx(
          `ml-3 mt-2 inline-flex items-center rounded-lg p-2 text-sm text-foreground`,
          `lg:hidden`
        )}
      >
        <button
          data-drawer-target="default-sidebar"
          aria-controls="default-sidebar"
          type="button"
          onClick={toggleSidebar}
          title={t('menu-open')}
          className="flex flex-row items-center space-x-3"
        >
          <MenuIcon />
          {isClient && (
            <Image
              src="/identity/logo-title-only.png"
              alt="Matcha"
              width={0}
              height={0}
              sizes="100vw"
              className={clsx(`h-auto w-24`, theme === 'dark' ? 'darkmode-logo' : '')}
              placeholder="blur"
              blurDataURL={'/identity/logo-transparent.png'}
              priority
            />
          )}
        </button>
      </div>

      {/* Menu Sidebar */}
      {isClient && !globalLoading ? (
        <>
          <div
            id="menu-sidebar"
            className={clsx(
              `fixed left-0 top-0 z-50 h-fit w-fit bg-transparent p-4 transition-transform`, // basic part
              `lg:translate-x-0`, // sm + md + xl (responsive part)
              isSidebarOpen ? 'translate-x-0 drop-shadow-2xl' : ' -translate-x-96' // Conditional style
            )}
            aria-label="menuSidebar"
            ref={menuRef}
          >
            <div
              id="rounded-menu-container"
              className="relative flex max-h-full w-64 flex-col space-y-5 rounded-2xl bg-card px-3 pt-5"
            >
              <div className="flex justify-center">
                <Image
                  src="/identity/logo-transparent.png"
                  alt="Matcha"
                  width={0}
                  height={0}
                  sizes="100vw"
                  className={clsx(`h-auto w-44`, theme === 'dark' ? 'darkmode-logo' : '')}
                  placeholder="blur"
                  blurDataURL={'/identity/logo-transparent.png'}
                  priority
                />
              </div>

              <SideBarHeader
                name={user?.nickname || user?.firstname}
                photoUrl={
                  Array.isArray(user?.photos) && user?.photos.length > 0 ? user.photos[0] : ''
                }
                translate={t}
              />

              {/* DASHBOARD LINK */}
              <div
                id="dashboard-link"
                className="ml-3 flex w-fit items-center gap-2 text-sm text-foreground"
              >
                <LayoutDashboard />
                <Link
                  href={`/dashboard`}
                  className={clsx(
                    `flex w-full items-center text-secondary smooth42transition`,
                    `hover:text-c42orange`,
                    pathname === `/dashboard` && 'font-bold'
                  )}
                  onClick={() => {
                    if (isSidebarOpen) setIsSidebarOpen(false);
                  }}
                  scroll={false}
                >
                  {t(`dashboard`)}
                </Link>
              </div>

              <MenuList
                onClick={() => {
                  if (isSidebarOpen) setIsSidebarOpen(false);
                }}
                pathname={pathname}
                translate={t}
              />

              {/* horizontal divider */}
              <div className="mb-3 ml-3 w-52 border-t border-secondary opacity-40" />
              <ContactSupportBlock translate={t} />
            </div>
          </div>
        </>
      ) : (
        <MenuSkeleton isSidebarOpen={isSidebarOpen} />
      )}
    </div>
  );
};

export default Menu;
