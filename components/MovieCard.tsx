
import React from 'react';
import type { Movie, User } from '../types';

interface MovieCardProps {
  movie: Movie;
  onClick: (movie: Movie) => void;
  myList: number[];
  onToggleMyList: (movieId: number) => void;
  currentUser: User | null;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, onClick, myList, onToggleMyList, currentUser }) => {
  const isInMyList = myList.includes(movie.id);

  return (
    <div 
      className="group flex-shrink-0 w-40 md:w-52 lg:w-60"
    >
      <div 
        className="relative overflow-hidden rounded-lg aspect-[2/3] bg-myflix-gray cursor-pointer"
        onClick={() => onClick(movie)}
      >
        <img
          src={movie.posterUrl}
          alt={movie.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300 ease-in-out"
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-opacity duration-300 flex items-center justify-center">
            <PlayCircleIcon />
        </div>
        {currentUser && (
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onToggleMyList(movie.id);
                }}
                className="absolute top-2 right-2 z-10 bg-black bg-opacity-60 rounded-full p-1.5 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-opacity-80"
                title={isInMyList ? 'Remove from My List' : 'Add to My List'}
            >
                {isInMyList ? <CheckIcon /> : <PlusIcon />}
            </button>
        )}
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

const PlusIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
    </svg>
);

const CheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
);

export default MovieCard;