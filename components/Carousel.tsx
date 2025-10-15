
import React, { useRef } from 'react';
import MovieCard from './MovieCard';
import type { Movie } from '../types';

interface CarouselProps {
  title: string;
  movies: Movie[];
}

const Carousel: React.FC<CarouselProps> = ({ title, movies }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth * 0.8 : scrollLeft + clientWidth * 0.8;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative group">
      <h2 className="text-xl md:text-2xl font-bold mb-4">{title}</h2>
      <button
        onClick={() => scroll('left')}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-black bg-opacity-50 hover:bg-opacity-80 p-3 rounded-full transition-opacity opacity-0 group-hover:opacity-100 hidden md:block"
        style={{ top: 'calc(50% + 1rem)' }}
      >
        <ChevronLeftIcon />
      </button>
      <div
        ref={scrollRef}
        className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide"
      >
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
      <button
        onClick={() => scroll('right')}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-black bg-opacity-50 hover:bg-opacity-80 p-3 rounded-full transition-opacity opacity-0 group-hover:opacity-100 hidden md:block"
        style={{ top: 'calc(50% + 1rem)' }}
      >
        <ChevronRightIcon />
      </button>
    </div>
  );
};

const ChevronLeftIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6 text-white"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6 text-white"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

export default Carousel;
