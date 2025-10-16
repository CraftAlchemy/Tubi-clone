
import React from 'react';

const MovieCardSkeleton: React.FC = () => (
  <div className="flex-shrink-0 w-40 md:w-52 lg:w-60">
    <div className="relative overflow-hidden rounded-lg aspect-[2/3] bg-gray-700"></div>
    <div className="mt-2 h-4 bg-gray-700 rounded w-3/4"></div>
  </div>
);

const CarouselSkeleton: React.FC = () => {
  return (
    <div className="animate-pulse">
      <div className="h-7 bg-gray-700 rounded w-1/4 mb-4"></div>
      <div className="flex space-x-4 overflow-hidden">
        {Array.from({ length: 6 }).map((_, index) => (
          <MovieCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
};

export default CarouselSkeleton;
