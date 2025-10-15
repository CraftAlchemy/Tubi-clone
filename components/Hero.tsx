
import React, { useState, useEffect } from 'react';
import type { Movie } from '../types';

interface HeroProps {
  movie: Movie;
}

const Hero: React.FC<HeroProps> = ({ movie }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Set a short timeout to trigger the animation after the component mounts
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100); 
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative h-[60vh] md:h-[85vh] w-full">
      <img
        src={movie.posterUrl}
        alt={movie.title}
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-tubi-black via-transparent to-transparent"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-tubi-black via-tubi-black/70 to-transparent"></div>
      
      <div className="relative z-10 flex flex-col justify-end h-full pb-16 md:pb-24 px-4 md:px-10 lg:px-16">
        <div className="max-w-2xl">
          <h1 className={`text-4xl md:text-6xl lg:text-7xl font-extrabold text-white tracking-tighter drop-shadow-lg transition-all duration-700 ease-out ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
            {movie.title}
          </h1>
          <p className={`mt-4 text-sm md:text-base text-gray-200 max-w-lg line-clamp-3 transition-all duration-700 ease-out delay-200 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
            {movie.description}
          </p>
          <div className={`mt-8 flex items-center space-x-4 transition-all duration-700 ease-out delay-[400ms] ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
            <button className="flex items-center justify-center bg-white text-black font-bold px-8 py-3 rounded-full text-lg hover:bg-opacity-80 transition-all duration-300 transform hover:scale-105">
              <PlayIcon />
              <span className="ml-2">Play</span>
            </button>
            <button className="flex items-center justify-center bg-gray-500 bg-opacity-50 text-white font-bold px-6 py-3 rounded-full text-lg hover:bg-opacity-70 transition-all duration-300 transform hover:scale-105 backdrop-blur-sm">
              <PlusIcon />
              <span className="ml-2">Add to List</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const PlayIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-7 w-7"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
      clipRule="evenodd"
    />
  </svg>
);

const PlusIcon = () => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className="h-7 w-7" 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor" 
        strokeWidth={2}
    >
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
    </svg>
);

export default Hero;
