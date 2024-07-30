const CardDashboardSkeleton = () => {
  return (
    <div className="mt-4 flex min-h-[350px] w-full flex-auto basis-1 rounded-2xl bg-card p-2">
      {/* Left cards*/}
      <div className="flex max-h-[440px] min-w-[150px] flex-col gap-2 overflow-y-auto">
        {[...Array(5)].map((_, index) => (
          <div
            key={index}
            className="mb-1 mr-2 flex animate-pulse cursor-pointer flex-col items-center rounded-2xl border bg-muted p-2 shadow-md"
          >
            <div className="mb-2 flex items-center">
              <div className="h-[20px] w-[100px] rounded-md bg-muted"></div>
              <div className="ml-2 h-4 w-16 rounded-md bg-muted"></div>
            </div>
            <div className="h-4 w-8 rounded-md bg-muted"></div>
          </div>
        ))}
      </div>
      {/* Chart */}
      <div className="ml-4 w-full flex-1 overflow-hidden rounded-2xl">
        <div className="relative h-full w-full animate-pulse bg-muted"></div>
        <div className="mt-2 flex w-full items-center justify-end">
          <div className="flex h-10 w-24 items-center rounded-md bg-muted"></div>
        </div>
      </div>
    </div>
  );
};

export default CardDashboardSkeleton;
