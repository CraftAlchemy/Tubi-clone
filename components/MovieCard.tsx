
import React from 'react';
import type { Movie } from '../types';

interface MovieCardProps {
  movie: Movie;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  return (
    <div className="group flex-shrink-0 w-40 md:w-52 lg:w-60 cursor-pointer">
      <div className="relative overflow-hidden rounded-lg aspect-[2/3] bg-tubi-gray">
        <img
          src={movie.posterUrl}
          alt={movie.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300 ease-in-out"
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-opacity duration-300 flex items-center justify-center">
            <PlayCircleIcon />
        </div>
      </div>
      <h3 className="mt-2 text-sm text-gray-200 truncate group-hover:text-white transition-colors">{movie.title}</h3>
    </div>
  );
};

const PlayCircleIcon = () => (
    <div className="w-16 h-16 bg-black bg-opacity-50 rounded-full flex items-center justify-center border-2 border-white opacity-0 group-hover:opacity-100 group-hover:scale-110 transform transition-all duration-300 backdrop-blur-sm">
        <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-8 w-8 text-white" 
            viewBox="0 0 20 20" 
            fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
        </svg>
    </div>
);

export default MovieCard;
