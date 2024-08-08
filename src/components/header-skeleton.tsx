export const HeaderSkeleton = () => {
  return (
    <div className="flex w-full animate-pulse flex-col justify-start">
      <div className="mb-2 h-12 w-60 rounded-2xl bg-muted"></div> {/* Skeleton for Title */}
      <div className="flex flex-col space-y-4 lg:flex-row lg:items-start lg:space-x-4 lg:space-y-0">
        {/* Skeleton for Labels */}
        <div className="flex flex-col space-y-3">
          <div className="h-24 rounded-2xl bg-muted lg:w-96"></div>
          {/* Skeleton for Informartions */}
        </div>
        {/* Skeleton for Description */}
        <div className="h-24 flex-grow rounded-2xl bg-muted"></div>
        {/* Skeleton for Buttons Group */}
        <div className="flex flex-col justify-center space-y-2">
          <div className="h-10  rounded-2xl bg-muted lg:w-60"></div>
          {/* Skeleton for Use Case Button */}
          <div className="flex flex-row items-center justify-center space-x-2">
            <div className="h-10 w-4/5 rounded-2xl bg-muted lg:w-48"></div>
            {/* Skeleton for Download Data Button */}
            <div className="h-10 w-1/5 rounded-2xl bg-muted lg:w-12"></div>
            {/* Skeleton for Play Icon Button */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeaderSkeleton;