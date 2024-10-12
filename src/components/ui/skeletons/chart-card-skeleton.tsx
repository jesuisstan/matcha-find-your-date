const ChatCardSkeleton = () => {
  return (
    <div className="card flex h-16 w-full flex-col gap-2 rounded-2xl bg-card px-4 py-4 shadow">
      <div className="h-4 max-w-40 animate-pulse rounded-2xl bg-muted"></div>
      <div className="h-3 max-w-20 animate-pulse rounded-2xl bg-muted"></div>
    </div>
  );
};

export default ChatCardSkeleton;
