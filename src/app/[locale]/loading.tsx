import Image from 'next/image';
import { useTranslations } from 'next-intl';

import Spinner from '@/components/ui/spinner';

const Loading = () => {
  const t = useTranslations();

  return (
    <div className="relative flex h-screen flex-col items-center justify-center text-center text-foreground">
      <Image
        src="/identity/background-nobg.png"
        alt="hearts-bg"
        fill
        placeholder="blur"
        blurDataURL="/identity/background-nobg.png"
        className="z-[-5] object-cover opacity-5"
        sizes={'100vw'}
        priority
      />
      <Image
        src="/identity/logo-loading.png"
        alt="loading"
        width="0"
        height="0"
        sizes="100vw"
        className="h-80 w-80"
        priority
      />
      <p className="mb-16 text-2xl font-normal leading-[48px] tracking-wider">
        {t(`slogan-subject`)}
      </p>
      <Spinner size={12} />
      <p className="mt-[14px] animate-pulse text-base font-normal leading-[19px]">{t(`loading`)}</p>
    </div>
  );
};

export default Loading;
