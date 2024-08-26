import { useTranslations } from 'next-intl';

import LogoutButton from '@/components/menu/logout-button';

const Footer = () => {
  const t = useTranslations();

  return (
    <div className="flex flex-row items-center self-end text-right text-xs font-normal leading-4 tracking-normal">
      <div>
        Matcha Dating App{'. '}
        {/*{t(`service-provided`)}{' '}
        <a
          href={`https://www.krivtsoff.site/`}
          target="_blank"
          className="my-6 text-center text-sm text-c42orange transition-all duration-300 ease-in-out hover:text-c42green"
        >
          Stan Krivtsoff
        </a>
        {'. '}*/}
        {t(`rights-reserved`)}
        {'.'}
      </div>
      <div className="scale-[60%]">
        <LogoutButton translate={t} />
      </div>
    </div>
  );
};

export default Footer;
