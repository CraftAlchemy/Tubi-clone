
import type { Movie, Category } from '../types';

const generateMovies = (count: number, seed: number): Movie[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: seed * 100 + i,
    title: `Awesome Movie Title ${seed * 100 + i}`,
    posterUrl: `https://picsum.photos/400/600?random=${seed * 100 + i}`,
    description: `This is a compelling description for Awesome Movie Title ${seed * 100 + i}. It involves action, drama, and a touch of romance that will keep you hooked until the very end.`,
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", // Placeholder
    trailerUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", // Placeholder
    tokenCost: Math.random() > 0.7 ? Math.floor(Math.random() * 3) + 1 : undefined
  }));
};

export const CATEGORIES: Category[] = [
  {
    title: 'Most Popular',
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
    title: 'Sci-Fi Universe',
    movies: generateMovies(10, 4),
  },
  {
    title: 'Comedy Central',
    movies: generateMovies(10, 5),
  },
  {
    title: 'Horror Flicks',
    movies: generateMovies(10, 6),
  },
];
