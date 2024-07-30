import Image from 'next/image';

import clsx from 'clsx';

export const UserNameSkeleton = () => {
  return (
    <div className="flex animate-pulse flex-row gap-1">
      <div className="h-5 w-16 rounded-full bg-muted" />
      <div className="h-5 w-8 rounded-full bg-muted" />
    </div>
  );
};

export const generateSkeletonItems = (count: number) => {
  const items = [];
  for (let i = 0; i < count; i++) {
    items.push(
      <div key={i}>
        <div className="ml-4 h-2.5 w-28 rounded-full bg-muted" />
        <ul className="ml-4 mt-2 space-y-2 border-l-2 border-muted">
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
  // Function to generate X number of fake Smartdata items

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
        className="flex max-h-full w-64 animate-pulse flex-col space-y-5 rounded-2xl bg-card px-3 py-4"
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
        <div className="flex flex-col items-center justify-center space-y-3 align-middle">
          <div className="flex items-center justify-center space-x-4 align-middle font-bold ">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-foreground text-base text-card" />
            <UserNameSkeleton />
          </div>
          <div className="flex flex-col items-center space-y-3 text-xs font-normal text-foreground">
            <div className="h-6 w-6 rounded-full bg-muted dark:bg-muted" />
            <div className="h-2.5 w-28 rounded-full bg-muted dark:bg-muted" />
            <div className="h-2.5 w-11 rounded-full bg-muted pb-3 dark:bg-muted" />
            <div className="h-2.5 w-14 rounded-full bg-muted dark:bg-muted" />
            <div className="w-52 border-t border-muted" />
          </div>
        </div>

        {/* Sidebar homepage link */}
        <div className="group ml-4 flex items-center gap-2 pb-1 pt-1 text-sm text-foreground">
          <div className="h-2.5 w-5 rounded-full bg-muted" />
          <div className="h-2.5 w-24 rounded-full bg-muted" />
        </div>

        {/* Sidebar search bar */}
        <div className="pb-1">
          <div className="ml-4 h-2.5 w-44 rounded-full bg-muted pb-6" />
        </div>

        {/* Smartdata list */}
        {generateSkeletonItems(7)}
      </div>
    </aside>
  );
};

export default MenuSkeleton;
