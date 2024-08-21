const ChipsSkeleton = ({ message }: { message?: string }) => {
  return (
    <div className="relative flex flex-col">
      <div className="animate-pulse">
        <div className="mb-6 flex flex-row items-end gap-8">
          <div className="h-5 w-28 rounded-full bg-muted" />
          <div className="flex flex-row gap-8 text-xs font-normal text-secondary">
            <div className="h-2.5 w-20 rounded-full bg-muted" />
            <div className="h-2.5 w-20 rounded-full bg-muted" />
          </div>
        </div>
        <div className="flex flex-row flex-wrap justify-start gap-2">
          <div className="h-5 w-20 rounded-full bg-muted" />
          <div className="h-5 w-28 rounded-full bg-muted" />
          <div className="h-5 w-16 rounded-full bg-muted" />
          <div className="h-5 w-20 rounded-full bg-muted" />
          <div className="h-5 w-24 rounded-full bg-muted" />
          <div className="h-5 w-20 rounded-full bg-muted" />
          <div className="h-5 w-28 rounded-full bg-muted" />
        </div>
      </div>

      {/* ERROR MESSAGE */}
      <div
        id="error-message-chips"
        className="absolute left-1/2 top-1/2 line-clamp-3 h-[max-content] -translate-x-1/2 -translate-y-1/2 transform text-ellipsis text-center text-sm text-negative"
        title={message}
      >
        {message ?? <span>{message}</span>}
      </div>
    </div>
  );
};

export default ChipsSkeleton;
