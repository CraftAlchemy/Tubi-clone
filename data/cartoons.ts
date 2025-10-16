import type { Category } from '../types';

const generateCartoonMovies = (count: number, seed: number, titlePrefix: string): Category['movies'] => {
  return Array.from({ length: count }, (_, i) => ({
    id: seed * 100 + i,
    title: `${titlePrefix} Adventure ${i + 1}`,
    posterUrl: `https://picsum.photos/400/600?random=${seed * 100 + i}`,
    description: `Join the fun in this exciting animated feature, perfect for the whole family. Laughter and lessons await!`,
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    tokenCost: Math.random() > 0.8 ? 1 : undefined,
  }));
};

export const CARTOON_CATEGORIES: Category[] = [
  {
    title: "Animated Classics",
    movies: generateCartoonMovies(8, 51, "Classic"),
  },
  {
    title: "Modern Toons",
    movies: generateCartoonMovies(8, 52, "Modern"),
  },
];