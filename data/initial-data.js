const generateMovies = (count, seed) => {
  return Array.from({ length: count }, (_, i) => ({
    id: seed * 100 + i,
    title: `Awesome Movie Title ${seed * 100 + i}`,
    posterUrl: `https://picsum.photos/400/600?random=${seed * 100 + i}`,
    description: `This is a compelling description for Awesome Movie Title ${seed * 100 + i}. It involves action, drama, and a touch of romance that will keep you hooked until the very end.`
  }));
};

const INITIAL_CATEGORIES = [
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

module.exports = { INITIAL_CATEGORIES };
