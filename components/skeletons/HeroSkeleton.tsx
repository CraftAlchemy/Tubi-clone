
import React from 'react';

const HeroSkeleton: React.FC = () => {
  return (
    <div className="relative h-[60vh] md:h-[85vh] w-full bg-myflix-gray animate-pulse">
      <div className="absolute inset-0 bg-gradient-to-t from-myflix-black via-transparent to-transparent"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-myflix-black via-myflix-black/70 to-transparent"></div>
      
      <div className="relative z-10 flex flex-col justify-end h-full pb-16 md:pb-24 px-4 md:px-10 lg:px-16">
        <div className="max-w-2xl space-y-4">
          <div className="h-10 md:h-14 lg:h-16 bg-gray-700 rounded w-3/4"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-700 rounded w-full"></div>
            <div className="h-4 bg-gray-700 rounded w-5/6"></div>
          </div>
          <div className="flex items-center space-x-4 pt-4">
            <div className="h-12 w-36 bg-gray-600 rounded-full"></div>
            <div className="h-12 w-48 bg-gray-700 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSkeleton;