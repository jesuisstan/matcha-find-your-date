import { MouseEventHandler } from 'react';
import Link from 'next/link';

import clsx from 'clsx';

import MessagesCounterWrapper from '@/components/wrappers/messages-counter-wrapper';
import NotificationsCounterWrapper from '@/components/wrappers/notifications-counter-wrapper';
import { capitalize } from '@/utils/format-string';

const MenuList = ({
  onClick,
  pathname,
  translate,
  unreadCountNotifications,
  unreadCountMessages,
}: {
  onClick: MouseEventHandler<HTMLAnchorElement>;
  pathname: string;
  translate: (key: string) => string;
  unreadCountNotifications: number | null;
  unreadCountMessages: number | null;
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
                `group flex w-full items-center text-secondary smooth42transition`,
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
          {/* NOTIFICATIONS */}
          <li>
            <Link
              href={pathname !== '/notifications' ? '/notifications' : ''} // conditional href to prevent reloading of a page on clicking this link when user is already on this page
              className={clsx(
                `group flex w-full items-center text-secondary smooth42transition`,
                `hover:text-c42orange`
              )}
              onClick={onClick}
              scroll={false}
            >
              <div
                id="smartdata-chosen-pointer"
                className={clsx('ml-[-5px] mr-4 h-2 w-2 rounded-full', {
                  'bg-secondary': pathname === '/notifications',
                  'bg-transparent': pathname !== '/notifications',
                })}
              />
              <div
                title={translate(`notifications`)}
                className="flex max-w-[170px] flex-row items-center gap-2"
              >
                <span className="max-w-32 truncate">{translate(`notifications`)}</span>
                <NotificationsCounterWrapper unreadCount={unreadCountNotifications} />
              </div>
            </Link>
          </li>
          {/* MESSAGES */}
          <li>
            <Link
              href={pathname !== '/messages' ? '/messages' : ''} // conditional href to prevent reloading of a page on clicking this link when user is already on this page
              className={clsx(
                `group flex w-full items-center text-secondary smooth42transition`,
                `hover:text-c42orange`
              )}
              onClick={onClick}
              scroll={false}
            >
              <div
                id="smartdata-chosen-pointer"
                className={clsx('ml-[-5px] mr-4 h-2 w-2 rounded-full', {
                  'bg-secondary': pathname === '/messages',
                  'bg-transparent': pathname !== '/messages',
                })}
              />
              <div
                title={translate(`messages`)}
                className="flex max-w-[170px] flex-row items-center gap-2"
              >
                <span className="max-w-32 truncate">{translate(`messages`)}</span>
                <MessagesCounterWrapper unreadCount={unreadCountMessages} />
              </div>
            </Link>
          </li>
        </ul>
      </li>

      <li>
        <span className="group ml-3 flex items-center">
          {capitalize(translate(`search.search`))}
        </span>
        <ul className="ml-4 mt-2 border-l-2 border-secondary font-normal text-secondary">
          <li>
            <Link
              href={pathname !== '/search/smart-suggestions' ? `/search/smart-suggestions` : ''} // conditional href to prevent reloading of a page on clicking this link when user is already on this page
              className={clsx(
                `group mb-1 flex w-full items-center text-secondary smooth42transition`,
                `hover:text-c42orange`
              )}
              onClick={onClick}
              scroll={false}
            >
              <div
                id="smartdata-chosen-pointer"
                className={clsx('ml-[-5px] mr-4 h-2 w-2 rounded-full', {
                  'bg-secondary': pathname === '/search/smart-suggestions',
                  'bg-transparent': pathname !== '/search/smart-suggestions',
                })}
              />
              <div title={translate(`search.smart-suggestions`)} className="max-w-[170px] truncate">
                {translate(`search.smart-suggestions`)}
              </div>
            </Link>
          </li>

          <li>
            <Link
              href={pathname !== '/search/advanced' ? `/search/advanced` : ''} // conditional href to prevent reloading of a page on clicking this link when user is already on this page
              className={clsx(
                `group flex w-full items-center text-secondary smooth42transition`,
                `hover:text-c42orange`
              )}
              onClick={onClick}
              scroll={false}
            >
              <div
                id="chosen-pointer"
                className={clsx('ml-[-5px] mr-4 h-2 w-2 rounded-full', {
                  'bg-secondary': pathname === '/search/advanced',
                  'bg-transparent': pathname !== '/search/advanced',
                })}
              />
              <div title={translate(`search.advanced`)} className="max-w-[170px] truncate">
                {translate(`search.advanced`)}
              </div>
            </Link>
          </li>
        </ul>
      </li>

      {/* ACTIVITY */}
      <li>
        <span className="group ml-3 flex items-center">{capitalize(translate(`activity`))}</span>
        <ul className="ml-4 mt-2 border-l-2 border-secondary font-normal text-secondary">
          <li>
            <Link
              href={pathname !== '/activity/visits' ? `/activity/visits` : ''} // conditional href to prevent reloading of a page on clicking this link when user is already on this page
              className={clsx(
                `group mb-1 flex w-full items-center text-secondary smooth42transition`,
                `hover:text-c42orange`
              )}
              onClick={onClick}
              scroll={false}
            >
              <div
                id="smartdata-chosen-pointer"
                className={clsx('ml-[-5px] mr-4 h-2 w-2 rounded-full', {
                  'bg-secondary': pathname === '/activity/visits',
                  'bg-transparent': pathname !== '/activity/visits',
                })}
              />
              <div title={translate(`visits`)} className="max-w-[170px] truncate">
                {translate(`visits`)}
              </div>
            </Link>
          </li>

          <li>
            <Link
              href={pathname !== '/activity/symphaties' ? `/activity/symphaties` : ''} // conditional href to prevent reloading of a page on clicking this link when user is already on this page
              className={clsx(
                `group mb-1 flex w-full items-center text-secondary smooth42transition`,
                `hover:text-c42orange`
              )}
              onClick={onClick}
              scroll={false}
            >
              <div
                id="chosen-pointer"
                className={clsx('ml-[-5px] mr-4 h-2 w-2 rounded-full', {
                  'bg-secondary': pathname === '/activity/symphaties',
                  'bg-transparent': pathname !== '/activity/symphaties',
                })}
              />
              <div title={translate(`symphaties`)} className="max-w-[170px] truncate">
                {translate(`symphaties`)}
              </div>
            </Link>
          </li>

          <li>
            <Link
              href={pathname !== '/activity/matches' ? `/activity/matches` : ''} // conditional href to prevent reloading of a page on clicking this link when user is already on this page
              className={clsx(
                `group mb-1 flex w-full items-center text-secondary smooth42transition`,
                `hover:text-c42orange`
              )}
              onClick={onClick}
              scroll={false}
            >
              <div
                id="chosen-pointer"
                className={clsx('ml-[-5px] mr-4 h-2 w-2 rounded-full', {
                  'bg-secondary': pathname === '/activity/matches',
                  'bg-transparent': pathname !== '/activity/matches',
                })}
              />
              <div title={translate(`matches`)} className="max-w-[170px] truncate">
                {translate(`matches`)}
              </div>
            </Link>
          </li>

          <li>
            <Link
              href={pathname !== '/activity/blocked' ? `/activity/blocked` : ''} // conditional href to prevent reloading of a page on clicking this link when user is already on this page
              className={clsx(
                `group flex w-full items-center text-secondary smooth42transition`,
                `hover:text-c42orange`
              )}
              onClick={onClick}
              scroll={false}
            >
              <div
                id="chosen-pointer"
                className={clsx('ml-[-5px] mr-4 h-2 w-2 rounded-full', {
                  'bg-secondary': pathname === '/activity/blocked',
                  'bg-transparent': pathname !== '/activity/blocked',
                })}
              />
              <div title={translate(`blocked`)} className="max-w-[170px] truncate">
                {translate(`blocked`)}
              </div>
            </Link>
          </li>
        </ul>
      </li>
    </ul>
  );
};

export default MenuList;
