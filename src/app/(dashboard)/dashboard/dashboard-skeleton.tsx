'use client';
import React from 'react';

const DashboardSkeleton = () => {
  return (
    <>
      <div className="mb-4 h-10 w-3/4 animate-pulse rounded bg-muted"></div>
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
        {[...Array(3)].map((_, categoryIndex) => (
          <React.Fragment key={categoryIndex}>
            {[...Array(3)].map((_, cardIndex) => (
              <div
                key={cardIndex}
                className="flex animate-pulse flex-col justify-between rounded-lg border bg-card p-4 shadow-md"
              >
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <div className="mb-2 h-6 w-32 rounded bg-muted"></div>
                    <div className="h-4 w-24 rounded bg-muted"></div>
                  </div>
                  <div className="h-10 w-24 rounded bg-muted"></div>
                </div>
              </div>
            ))}
          </React.Fragment>
        ))}
      </div>
    </>
  );
};

export default DashboardSkeleton;
