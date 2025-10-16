import type { Movie, Category } from '../types';

export const HERO_MOVIE: Movie = {
  id: 1,
  title: 'Cosmic Odyssey',
  description: 'In a future where humanity has colonized the stars, a lone pilot stumbles upon an ancient artifact that could either save civilization or destroy it entirely. A thrilling journey across galaxies awaits.',
  posterUrl: 'https://picsum.photos/1920/1080?random=1',
  videoUrl: 'https://www.youtube.com/watch?v=LXb3EKWsInQ',
  trailerUrl: 'https://www.youtube.com/watch?v=LXb3EKWsInQ'
};

const generateMovies = (count: number, seed: number): Movie[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: seed * 100 + i,
    title: `Awesome Movie Title ${seed * 100 + i}`,
    posterUrl: `https://picsum.photos/400/600?random=${seed * 100 + i}`,
    description: `This is a compelling description for Awesome Movie Title ${seed * 100 + i}. It involves action, drama, and a touch of romance that will keep you hooked until the very end.`,
    videoUrl: 'https://www.youtube.com/watch?v=LXb3EKWsInQ',
    trailerUrl: 'https://www.youtube.com/watch?v=LXb3EKWsInQ'
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

const NEW_CATEGORY_TITLES = [
    'Critically Acclaimed',
    'Indie Gems',
    'Documentaries',
    'Family Movie Night',
    'Thrillers',
    'Based on a True Story'
];

export const generateMoreCategories = (page: number): Category[] => {
    // Generate 3 new categories per "page"
    return Array.from({ length: 3 }, (_, i) => {
        const categoryIndex = (page - 1) * 3 + i;
        const title = `${NEW_CATEGORY_TITLES[categoryIndex % NEW_CATEGORY_TITLES.length]} #${page}`;
        // The seed needs to be unique to avoid generating the same movies
        const seed = 10 + page * 10 + i; 
        return {
            title: title,
            movies: generateMovies(10, seed),
        };
    });
};