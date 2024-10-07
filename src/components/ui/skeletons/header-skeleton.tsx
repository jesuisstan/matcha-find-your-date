import ActionsSkeleton from '@/components/ui/skeletons/actions-skeleton';

const HeaderSkeleton = () => {
  return (
    <div className="flex w-full animate-pulse flex-col justify-start">
      {/* Skeleton for Title */}
      <div className="mb-4 flex flex-row flex-wrap items-center gap-x-2">
        <div className="h-8 w-8 self-center rounded-full bg-muted"></div>
        <div className="mb-2 h-12 w-60 rounded-2xl bg-muted"></div>
      </div>
      <div className="flex flex-col space-y-4 lg:flex-row lg:items-start lg:space-x-4 lg:space-y-0">
        {/* Skeleton for Labels */}
        <div className="flex flex-col space-y-3">
          <div className="h-[104px] rounded-2xl bg-muted lg:w-64"></div>
        </div>
        {/* Skeleton for Description */}
        <div className="h-[104px] flex-grow rounded-2xl bg-muted"></div>
        {/* Skeleton for Status Group */}
        <div className="flex flex-col space-y-3">
          <div className="h-14 rounded-2xl bg-muted lg:h-[104px] lg:w-52"></div>
        </div>
        {/* Skeleton for Actions Group */}
        <ActionsSkeleton />
      </div>
    </div>
  );
};

export default HeaderSkeleton;
