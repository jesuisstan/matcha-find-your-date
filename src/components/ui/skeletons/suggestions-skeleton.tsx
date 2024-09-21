import ProfileCardSkeleton from './profile-card-skeleton';

const SuggestionsSkeleton = () => {
  return (
    <div>
      <div className="flex flex-row flex-wrap items-center justify-center gap-4 smooth42transition">
        {[...Array(10)].map((_, index) => (
          <div key={index}>
            <ProfileCardSkeleton />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SuggestionsSkeleton;
