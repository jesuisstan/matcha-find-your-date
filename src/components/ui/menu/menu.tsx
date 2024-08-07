'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useTheme } from 'next-themes';

import clsx from 'clsx';
import { ChevronLeft, MenuIcon, Rows3 } from 'lucide-react';

import ClearLocalStorageButton from '../clear-storage-btn/clear-storage-btn';
import ContactSupportBlock from './contact-support-block';
import TermsConditionBlock from './terms-condition-block';

import MenuSkeleton from '@/components/ui/menu/menu-skeleton';
import SideBarHeader from '@/components/ui/menu/side-bar-header';
import useLanguage from '@/hooks/useLanguage';
import useUserStore from '@/stores/user';

const Menu: React.FC = () => {
  const { theme } = useTheme();
  const t = useTranslations();
  const user = useUserStore((state) => state.user);
  const { lang } = useLanguage();

  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
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
          title="Open menu"
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
            />
          )}
        </button>
      </div>

      {/* Menu Sidebar */}
      {isClient ? (
        <>
          <div
            id="sidebar"
            className={clsx(
              `fixed left-0 top-0 z-50 h-screen w-fit bg-transparent p-4 transition-transform`, // basic part
              `lg:translate-x-0`, // sm + md + xl (responsive part)
              isSidebarOpen ? 'translate-x-0 drop-shadow-2xl' : ' -translate-x-96' // Conditional style
            )}
            aria-label="Sidebar"
          >
            <div
              id="rounded-menu-container"
              className="relative flex max-h-full w-64 flex-col space-y-5 rounded-2xl bg-card px-3 py-4"
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
                />
                {/* Close-Sidebar button */}
                {isSidebarOpen && (
                  <button
                    id="close-sidebar-button"
                    onClick={toggleSidebar}
                    title="Close the menu"
                    className={clsx(
                      `absolute left-72 top-1/2 z-50 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-secondary bg-card text-foreground opacity-90`,
                      `hover:text-c42orange hover:opacity-100`,
                      `lg:hidden`
                    )}
                  >
                    <ChevronLeft />
                  </button>
                )}
              </div>

              <SideBarHeader name={user?.nickname || user?.firstname} translate={t} />

              {/* DASHBOARD LINK */}
              <div
                id="dashboard-link"
                className="ml-3 flex w-fit items-center gap-2 text-sm text-foreground"
              >
                <Rows3 />
                <Link
                  href={`/dashboard?lang=${lang}`}
                  className={clsx(
                    `flex w-full items-center text-secondary transition duration-75`,
                    `hover:text-c42orange`,
                    pathname === '/landing' && 'font-bold'
                  )}
                  onClick={() => {
                    if (isSidebarOpen) setIsSidebarOpen(false);
                  }}
                  scroll={false}
                >
                  {t(`common:dashboard`)}
                </Link>
              </div>

              {/*<SmartdataList
                onClick={() => {
                  if (isSidebarOpen) setIsSidebarOpen(false);
                }}
                pathname={pathname}
              />*/}
              <div>Link 1</div>
              <div>Link 1</div>
              <div>Link 1</div>
              <div className="items-center">
                <ClearLocalStorageButton />
              </div>
              <TermsConditionBlock translate={t} />
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
