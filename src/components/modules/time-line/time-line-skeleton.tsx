const TimelineSkeleton = ({ message }: { message?: string }) => {
  return (
    <div className="mt-4 h-[470px] rounded-2xl bg-card p-2">
      <div className="relative flex flex-col items-center justify-center">
        <div className="w-full pb-4">
          <div className="m-auto h-8 w-1/6 animate-pulse rounded-full bg-muted" />
        </div>
        <div className="m-auto h-80 w-3/5 animate-pulse rounded-xl bg-muted" />
        <div className="m-10 flex w-full animate-pulse justify-between rounded-xl bg-muted">
          <div className="h-4 w-1/4 animate-pulse rounded-full bg-muted" />
          <div className="h-4 w-1/4 animate-pulse rounded-full bg-muted" />
          <div className="h-4 w-1/4 animate-pulse rounded-full bg-muted" />
        </div>

        {/* ERROR MESSAGE */}
        <div
          id="error-message-overview"
          title={message}
          className="absolute left-1/2 top-1/2 line-clamp-6 h-[max-content] -translate-x-1/2 -translate-y-1/2 transform text-ellipsis text-center text-sm text-negative"
        >
          {message ?? <span>{message}</span>}
        </div>
      </div>
    </div>
  );
};

export default TimelineSkeleton;
