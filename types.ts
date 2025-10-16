
export interface User {
  id: number;
  email: string;
  password?: string; // Should not be passed to client, but exists in data
  role: 'user' | 'admin';
  tokens: number;
}

export interface Movie {
  id: number;
  title: string;
  description: string;
  posterUrl: string;
  videoUrl: string;
  trailerUrl: string;
  tokenCost?: number;
}

export interface Category {
  title:string;
  movies: Movie[];
}

export interface Episode {
    id: number;
    title: string;
    posterUrl: string;
    description: string;
    videoUrl: string;
    duration: string;
}

export interface Season {
    id: number;
    title: string;
    episodes: Episode[];
}

export interface Series {
    id: number;
    title: string;
    posterUrl: string;
    description: string;
    seasons: Season[];
}

export interface SeriesCategory {
    title: string;
    series: Series[];
}

export interface LiveTVChannel {
    id: number;
    name: string;
    logoUrl: string;
    streamUrl: string;
}

export interface Advertisement {
    id: number;
    title: string;
    videoUrl: string;
    duration: number;
    tokenReward: number;
}

export interface TokenPack {
    id: number;
    amount: number;
    price: number;
    isBestValue: boolean;
}

// This allows using <ion-icon> in JSX without TypeScript errors.
// This is a global augmentation.
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'ion-icon': any;
    }
  }
}
