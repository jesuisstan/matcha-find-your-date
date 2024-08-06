import useTranslation from 'next-translate/useTranslation';

const Footer = () => {
  const { t } = useTranslation();

  return (
    <div className="self-end p-1 text-right text-xs font-normal leading-4 tracking-normal">
      Matcha Dating App{'. '}
      {t`common:service-provided`}{' '}
      <a
        href={`https://www.krivtsoff.site/`}
        target="_blank"
        className="my-6 text-center text-sm text-positive hover:text-c42orange"
      >
        Stan Krivtsoff
      </a>
      {'. '}
      {t`common:rights-reserved`}
      {'.'}
    </div>
  );
};

export default Footer;
