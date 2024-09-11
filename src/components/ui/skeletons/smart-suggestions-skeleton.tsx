const SmartSuggestionsSeleton = () => {
  return (
    <div>
      <div className="flex w-[100%] flex-col content-center items-center gap-5">
        <div className="flex w-[100%] flex-row flex-wrap content-center items-center justify-center gap-10 p-2 align-middle">
          {[...Array(9)].map((_, index) => (
            <div
              key={index}
              className="flex max-w-72 animate-pulse flex-col items-center justify-center gap-5 rounded-2xl bg-card p-5"
            >
              <div className="h-24 w-64 rounded bg-muted"></div>
              <div className="h-20 w-20 rounded-full bg-muted"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SmartSuggestionsSeleton;
