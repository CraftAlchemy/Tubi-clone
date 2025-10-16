
import React from 'react';
import type { Movie } from '../types';

interface HeroProps {
  movie: Movie;
  onPlay: (movie: Movie) => void;
  onMoreInfo: (movie: Movie) => void;
}

const Hero: React.FC<HeroProps> = ({ movie, onPlay, onMoreInfo }) => {
  const description = movie.description || 'Check out this amazing new movie on Myflix. Available for streaming now!';
  
  return (
    <div className="relative h-[60vh] md:h-[85vh] w-full">
      {/* Background Image */}
      <img
        src={movie.posterUrl}
        alt={movie.title}
        className="absolute inset-0 w-full h-full object-cover"
      />
      {/* Gradients */}
      <div className="absolute inset-0 bg-gradient-to-t from-myflix-black via-transparent to-transparent"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-myflix-black via-myflix-black/70 to-transparent"></div>
      
      {/* Content */}
      <div className="relative z-10 flex flex-col justify-end h-full pb-16 md:pb-24 px-4 md:px-10 lg:px-16">
        <div className="max-w-2xl">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold tracking-tighter text-white">
            {movie.title}
          </h1>
          <p className="mt-4 text-sm md:text-base text-gray-200 line-clamp-3">
            {description}
          </p>
          <div className="flex items-center space-x-4 mt-6">
            <button
              onClick={() => onPlay(movie)}
              className="flex items-center justify-center bg-white text-black font-bold px-6 py-2.5 md:px-8 md:py-3 rounded-full text-base hover:bg-opacity-80 transition-transform transform hover:scale-105"
            >
              <PlayIcon />
              <span className="ml-2">Play</span>
            </button>
            <button
              onClick={() => onMoreInfo(movie)}
              className="flex items-center justify-center bg-gray-500 bg-opacity-40 text-white font-bold px-6 py-2.5 md:px-8 md:py-3 rounded-full text-base hover:bg-opacity-60 transition-transform transform hover:scale-105 backdrop-blur-sm"
            >
              <InfoIcon />
              <span className="ml-2">More Info</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const PlayIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
  </svg>
);

const InfoIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export default Hero;
