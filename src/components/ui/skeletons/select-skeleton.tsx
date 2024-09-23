const SelectSkeleton = ({ showLabel, showTitle }: { showLabel?: boolean; showTitle?: boolean }) => {
  return (
    <div className={'w-full'}>
      {showLabel && (
        <div className="mb-5 block text-base font-normal text-foreground">
          <div className="h-4 w-24 animate-pulse rounded-full bg-muted" />
        </div>
      )}
      <div className="h-[38px] w-40 animate-pulse rounded-full bg-muted" />
    </div>
  );
};

export default SelectSkeleton;
