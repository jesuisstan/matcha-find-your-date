const HeaderSkeleton = () => {
  return (
    <div className="flex w-full animate-pulse flex-col justify-start">
      {/* Skeleton for Title */}
      <div className="flex flex-row flex-wrap items-center gap-x-2">
        <div className="mb-2 h-10 w-8 rounded-2xl bg-muted"></div>
        <div className="mb-2 h-12 w-60 rounded-2xl bg-muted"></div>
      </div>
      <div className="flex flex-col space-y-4 lg:flex-row lg:items-start lg:space-x-4 lg:space-y-0">
        {/* Skeleton for Labels */}
        <div className="flex flex-col space-y-3">
          <div className="h-24 rounded-2xl bg-muted lg:w-64"></div>
        </div>
        {/* Skeleton for Description */}
        <div className="h-24 flex-grow rounded-2xl bg-muted"></div>
        {/* Skeleton for Status Group */}
        <div className="flex flex-col space-y-3">
          <div className="h-24 rounded-2xl bg-muted lg:w-52"></div>
        </div>
      </div>
    </div>
  );
};

export default HeaderSkeleton;
