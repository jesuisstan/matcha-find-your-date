const DashboardSkeleton = () => {
  return (
    <div>
      {/* HEADER SKELETON */}
      <div className="mb-5 flex flex-row flex-wrap items-center justify-center gap-5">
        <div className="h-10 w-2/4 animate-pulse rounded bg-muted"></div>
      </div>

      {/* NAVIGATION BUTTONS SKELETON */}
      <div className="flex w-[100%] flex-col content-center items-center gap-5">
        <div className="flex w-[100%] flex-row flex-wrap content-center items-center justify-center gap-10 p-2 align-middle">
          {[...Array(3)].map((_, index) => (
            <div
              key={index}
              className="flex max-w-72 animate-pulse flex-col items-center justify-center gap-5 rounded-2xl bg-card p-5"
            >
              <div className="h-24 w-64 rounded bg-muted"></div>
              <div className="h-20 w-20 rounded-full bg-muted"></div>
            </div>
          ))}
        </div>

        {/* POWERED BY SKELETON */}
        <div className="flex w-[100%] flex-col content-center items-center justify-center gap-10 rounded-2xl bg-card p-5 align-middle">
          <div className="h-8 w-48 animate-pulse rounded bg-muted"></div>
          <div className="flex flex-row flex-wrap justify-center gap-20">
            {[...Array(15)].map((_, index) => (
              <div key={index} className="flex flex-col items-center justify-between gap-3">
                <div className="h-24 w-24 rounded bg-muted"></div>
                <div className="h-4 w-16 rounded bg-muted"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardSkeleton;
