import { MouseEventHandler } from 'react';
import Link from 'next/link';

import clsx from 'clsx';

import { capitalize } from '@/utils/format-string';

const MenuList = ({
  onClick,
  pathname,
  translate,
}: {
  onClick: MouseEventHandler<HTMLAnchorElement>;
  pathname: string;
  translate: (key: string) => string;
}) => {
  return (
    <ul className="space-y-4 overflow-y-auto text-sm font-bold text-foreground">
      <li>
        <span className="group ml-3 flex items-center">{capitalize(translate(`account`))}</span>
        <ul className="ml-4 mt-2 border-l-2 border-secondary font-normal text-secondary">
          <li>
            <Link
              href={pathname !== '/profile' ? `/profile` : ''} // conditional href to prevent reloading of a page on clicking this link when user is already on this page
              className={clsx(
                `group flex w-full items-center text-secondary transition duration-75`,
                `hover:text-c42orange`
              )}
              onClick={onClick}
              scroll={false}
            >
              <div
                id="smartdata-chosen-pointer"
                className={clsx('ml-[-5px] mr-4 h-2 w-2 rounded-full', {
                  'bg-secondary': pathname === '/profile',
                  'bg-transparent': pathname !== '/profile',
                })}
              />
              <div title={translate(`profile`)} className="max-w-[170px] truncate">
                {translate(`profile`)}
              </div>
            </Link>
          </li>
        </ul>
      </li>

      <li>
        <span className="group ml-3 flex items-center">{capitalize(translate(`search`))}</span>
        <ul className="ml-4 mt-2 border-l-2 border-secondary font-normal text-secondary">
          <li>
            <Link
              href={pathname !== '/suggestions' ? `/suggestions` : ''} // conditional href to prevent reloading of a page on clicking this link when user is already on this page
              className={clsx(
                `group flex w-full items-center text-secondary transition duration-75`,
                `hover:text-c42orange`
              )}
              onClick={onClick}
              scroll={false}
            >
              <div
                id="smartdata-chosen-pointer"
                className={clsx('ml-[-5px] mr-4 h-2 w-2 rounded-full', {
                  'bg-secondary': pathname === '/suggestions',
                  'bg-transparent': pathname !== '/suggestions',
                })}
              />
              <div title={translate(`suggestions`)} className="max-w-[170px] truncate">
                {translate(`suggestions`)}
              </div>
            </Link>
          </li>

          <li>
            <Link
              href={pathname !== '/advanced-search' ? `/advanced-search` : ''} // conditional href to prevent reloading of a page on clicking this link when user is already on this page
              className={clsx(
                `group flex w-full items-center text-secondary transition duration-75`,
                `hover:text-c42orange`
              )}
              onClick={onClick}
              scroll={false}
            >
              <div
                id="smartdata-chosen-pointer"
                className={clsx('ml-[-5px] mr-4 h-2 w-2 rounded-full', {
                  'bg-secondary': pathname === '/advanced-search',
                  'bg-transparent': pathname !== '/advanced-search',
                })}
              />
              <div title={translate(`advanced-search`)} className="max-w-[170px] truncate">
                {translate(`advanced-search`)}
              </div>
            </Link>
          </li>
        </ul>
      </li>
    </ul>
  );
};

export default MenuList;
