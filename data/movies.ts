
import type { Category } from '../types';

const generateMovies = (count: number, seed: number): Category['movies'] => {
  return Array.from({ length: count }, (_, i) => ({
    id: seed * 100 + i,
    title: `Movie Title ${seed * 100 + i}`,
    posterUrl: `https://picsum.photos/400/600?random=${seed * 100 + i}`,
    description: `A gripping tale for Movie Title ${seed * 100 + i}.`,
    trailerUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    tokenCost: Math.random() > 0.7 ? 1 : undefined,
  }));
};

export const MOVIE_CATEGORIES: Category[] = [
  {
    title: 'Trending Now',
    movies: generateMovies(10, 1),
  },
  {
    title: 'New Releases',
    movies: generateMovies(10, 2),
  },
  {
    title: 'Action & Adventure',
    movies: generateMovies(10, 3),
  },
  {
    title: 'Sci-Fi',
    movies: generateMovies(10, 4),
  },
];
