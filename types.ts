

// Augment the global JSX namespace to include type definitions for the `<ion-icon>` web component.
// This allows TypeScript to recognize <ion-icon> as a valid JSX element.
declare global {
  namespace JSX {
    interface IntrinsicElements {
      // FIX: Use a more specific type for ion-icon to ensure TypeScript recognizes it across all components.
      // By removing the generic index signature, the type becomes more specific and allows TypeScript to correctly resolve it.
      'ion-icon': {
        name?: string;
        src?: string;
        icon?: string;
        size?: 'small' | 'large';
        class?: string;
        style?: { [key: string]: string | number };
      };
    }
  }
}

export interface User {
    id: number;
    email: string;
    password?: string;
    role: 'admin' | 'user';
    tokens: number;
}

export interface Movie {
  id: number;
  title: string;
  description: string;
  posterUrl: string;
  videoUrl?: string;
  trailerUrl?: string;
  tokenCost?: number;
}

export interface Category {
  title: string;
  movies: Movie[];
}

export interface Episode {
    id: number;
    title:string;
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
    duration: number; // in seconds
    tokenReward: number;
}

export interface TokenPack {
    id: number;
    amount: number;
    price: number;
    isBestValue: boolean;
}
