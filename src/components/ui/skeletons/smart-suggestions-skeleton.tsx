import ProfileCardSkeleton from './profile-card-skeleton';

const SmartSuggestionsSeleton = () => {
  return (
    <div>
      <div className="flex w-[100%] flex-row flex-wrap content-center items-center justify-center gap-4 align-middle">
        {[...Array(10)].map((_, index) => (
          <div key={index}>
            <ProfileCardSkeleton />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SmartSuggestionsSeleton;
