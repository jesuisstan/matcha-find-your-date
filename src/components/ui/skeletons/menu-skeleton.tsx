import Image from 'next/image';

import clsx from 'clsx';

export const UserNameSkeleton = () => {
  return <div className="flex h-5 w-28 animate-pulse rounded-full bg-muted" />;
};

export const generateSkeletonItems = (count: number) => {
  const items = [];
  for (let i = 0; i < count; i++) {
    items.push(
      <div key={i}>
        <div className="ml-4 h-4 w-28 rounded-full bg-muted" />
        <ul className="ml-4 mt-4 space-y-2 border-l-2 border-muted">
          <div className="ml-6 h-2.5 w-36 rounded-full bg-muted" />
          <div className="ml-6 h-2.5 w-36 rounded-full bg-muted" />
          <div className="ml-6 h-2.5 w-36 rounded-full bg-muted" />
        </ul>
      </div>
    );
  }
  return items;
};

const MenuSkeleton = ({ isSidebarOpen }: { isSidebarOpen?: boolean }) => {
  return (
    <aside
      id="sidebar"
      className={clsx(
        `fixed left-0 top-0 z-40 h-screen bg-transparent px-3 py-4 transition-transform`,
        `sm:translate-x-0`,
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      )}
      aria-label="Sidebar"
    >
      <div
        id="rounded-menu-container"
        className="flex max-h-full w-64 animate-pulse flex-col space-y-6 rounded-2xl bg-card px-3 py-4"
      >
        <div className="flex justify-center">
          <Image
            src="/identity/logo-transparent.png"
            alt="Q3"
            width={0}
            height={0}
            className="h-auto w-44"
            placeholder="blur"
            blurDataURL="/identity/logo-transparent.png"
          />
        </div>

        {/* Sidebar header */}
        <div className="flex flex-col items-center justify-center space-y-6 align-middle">
          <div className="flex items-center justify-center space-x-4 align-middle font-bold ">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-foreground text-base text-card" />
            <UserNameSkeleton />
          </div>
          <div className="flex flex-col items-center space-y-5 text-xs font-normal text-foreground">
            <div className="flex flex-row items-center justify-center gap-5">
              <div className="h-7 w-7 rounded-full bg-muted dark:bg-muted" />
              <div className="h-7 w-7 rounded-full bg-muted dark:bg-muted" />
              <div className="h-7 w-7 rounded-full bg-muted dark:bg-muted" />
            </div>
            <div className="flex flex-row items-center justify-center gap-5">
              <div className="h-7 w-7 rounded-full bg-muted dark:bg-muted" />
              <div className="h-7 w-7 rounded-full bg-muted dark:bg-muted" />
              <div className="h-7 w-7 rounded-full bg-muted dark:bg-muted" />
            </div>
          </div>
          {/* horizontal divider */}
          <div className="mt-3 w-52 border-t border-secondary opacity-40" />
        </div>

        {/* Sidebar search bar */}
        <div className="pb-1">
          <div className="ml-4 h-2.5 w-44 rounded-full bg-muted pb-6" />
        </div>

        {/* Smartdata list */}
        {generateSkeletonItems(3)}

        {/* horizontal divider */}
        <div className="mt-3 w-52 border-t border-secondary opacity-40" />
        <div className="pb-1">
          <div className="ml-4 h-2.5 w-44 rounded-full bg-muted pb-3" />
        </div>
      </div>
    </aside>
  );
};

export default MenuSkeleton;
