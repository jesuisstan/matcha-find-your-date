const NotificationCardSkeleton = () => {
  return (
    <div className="card flex h-28 w-full flex-col gap-2 rounded-2xl bg-card px-4 py-5 shadow-md">
      <div className="h-3 w-20 animate-pulse rounded-2xl bg-muted"></div>
      <div className="h-3 w-40 animate-pulse rounded-2xl bg-muted"></div>
      <div className="h-3 w-56 animate-pulse rounded-2xl bg-muted"></div>
      <div className="h-3 w-60 animate-pulse rounded-2xl bg-muted"></div>
    </div>
  );
};

export default NotificationCardSkeleton;
