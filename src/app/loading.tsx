import Image from 'next/image';

import Spinner from '@/components/ui/spinner';

const Loading = () => {
  return (
    <div className="flex h-screen flex-col items-center justify-center text-center text-foreground">
      <Image
        src="/identity/logo-loading.svg"
        alt="loading"
        width="0"
        height="0"
        sizes="100vw"
        className="h-[346px] w-[1042px]"
      />
      <p className="mb-[76px] text-4xl font-normal leading-[48px] tracking-wider">
        Macro Intelligence Platform
      </p>
      <p className="mb-[14px] animate-pulse text-2xl font-normal leading-[29px]">Loading data...</p>
      <Spinner size={16} />
      <p className="mt-[14px] animate-pulse text-base font-normal leading-[19px]">Please wait</p>
    </div>
  );
};

export default Loading;
