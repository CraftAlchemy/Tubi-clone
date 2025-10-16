import type { Movie, Category, Series, Season, Episode, SeriesCategory, LiveTVChannel } from '../types';

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

// --- Series Data ---

const generateEpisodes = (count: number, seasonSeed: number): Episode[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: seasonSeed * 1000 + i,
    title: `Episode ${i + 1}`,
    posterUrl: `https://picsum.photos/400/225?random=${seasonSeed * 1000 + i}`,
    description: `A pivotal moment occurs in Episode ${i + 1} that changes the course of the season.`,
    videoUrl: 'https://www.youtube.com/watch?v=LXb3EKWsInQ',
    duration: `${Math.floor(Math.random() * 15) + 40}m`,
  }));
};

const generateSeasons = (count: number, seriesSeed: number): Season[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: seriesSeed * 100 + i,
    title: `Season ${i + 1}`,
    episodes: generateEpisodes(8, seriesSeed * 100 + i),
  }));
};

const generateSeries = (count: number, seed: number): Series[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: seed * 10000 + i,
    title: `Epic Series Name ${seed * 10000 + i}`,
    posterUrl: `https://picsum.photos/400/600?random=${seed * 10000 + i}`,
    description: `An epic series about adventure, discovery, and the human spirit. Follow the journey through multiple seasons of compelling storytelling.`,
    seasons: generateSeasons(Math.floor(Math.random() * 3) + 1, seed * 10000 + i),
  }));
};

export const SERIES_CATEGORIES: SeriesCategory[] = [
    {
        title: 'Trending TV',
        series: generateSeries(10, 1),
    },
    {
        title: 'Critically Acclaimed Series',
        series: generateSeries(10, 2),
    },
    {
        title: 'Bingeworthy Dramas',
        series: generateSeries(10, 3),
    }
];

// --- Cartoon Data ---
export const CARTOON_CATEGORIES: Category[] = [
  {
    title: 'Animated Adventures',
    movies: generateMovies(10, 20),
  },
  {
    title: 'Family Fun Cartoons',
    movies: generateMovies(10, 21),
  },
];

// --- Live TV Data ---
export const LIVE_TV_CHANNELS: LiveTVChannel[] = [
    {
        id: 1,
        name: 'Live News',
        logoUrl: 'https://picsum.photos/100/100?random=901',
        streamUrl: 'https://www.youtube.com/embed/9Auq9mYxFEE?autoplay=1&mute=1' // Sky News Live
    },
    {
        id: 2,
        name: 'Music TV',
        logoUrl: 'https://picsum.photos/100/100?random=902',
        streamUrl: 'https://www.youtube.com/embed/Dx5qFachd3A?autoplay=1&mute=1' // Lofi Girl
    },
    {
        id: 3,
        name: 'Gaming Central',
        logoUrl: 'https://picsum.photos/100/100?random=903',
        streamUrl: 'https://www.youtube.com/embed/mNbnV3h_L7s?autoplay=1&mute=1' // GTV Gaming
    },
    {
        id: 4,
        name: 'Space Station Live',
        logoUrl: 'https://picsum.photos/100/100?random=904',
        streamUrl: 'https://www.youtube.com/embed/86YLFOog4GM?autoplay=1&mute=1' // NASA Live
    },
    {
        id: 5,
        name: 'Nature Channel',
        logoUrl: 'https://picsum.photos/100/100?random=905',
        streamUrl: 'https://www.youtube.com/embed/p5aA2_KlL_A?autoplay=1&mute=1' // Balmaz
    },
     {
        id: 6,
        name: 'World Events',
        logoUrl: 'https://picsum.photos/100/100?random=906',
        streamUrl: 'https://www.youtube.com/embed/h3MuIUNCCzI?autoplay=1&mute=1' // Al Jazeera
    },
     {
        id: 7,
        name: 'Cartoon Classics',
        logoUrl: 'https://picsum.photos/100/100?random=907',
        streamUrl: 'https://www.youtube.com/embed/nEjPDS8bftg?autoplay=1&mute=1' // WB Kids
    }
];