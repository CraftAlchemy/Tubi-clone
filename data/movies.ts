
import type { Movie, Category } from '../types';

export const HERO_MOVIE: Movie = {
  id: 1,
  title: 'Cosmic Odyssey',
  description: 'In a future where humanity has colonized the stars, a lone pilot stumbles upon an ancient artifact that could either save civilization or destroy it entirely. A thrilling journey across galaxies awaits.',
  posterUrl: 'https://picsum.photos/1920/1080?random=1'
};

const generateMovies = (count: number, seed: number): Movie[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: seed * 100 + i,
    title: `Awesome Movie Title ${seed * 100 + i}`,
    posterUrl: `https://picsum.photos/400/600?random=${seed * 100 + i}`,
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
