// FIX: Define global types for ion-icon web component to inform TypeScript about the custom element.
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'ion-icon': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & { name: string; class?: string; style?: React.CSSProperties }, HTMLElement>;
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
  posterUrl: string;
  description: string;
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
  title: string;
  posterUrl: string;
  description: string;
  videoUrl?: string;
  duration: string;
  tokenCost?: number;
}

export interface Season {
  id: number;
  title: string;
  episodes: Episode[];
  tokenCost?: number;
}

export interface Series {
  id: number;
  title: string;
  posterUrl: string;
  description: string;
  seasons: Season[];
  tokenCost?: number;
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

export interface BannerAd {
    id: number;
    imageUrl: string;
    linkUrl: string;
    placement: string;
}

export interface InStreamAd {
    id: number;
    videoUrl: string;
    duration: number;
    placement: string;
}

// This empty export is a trick to ensure this file is treated as a module by TypeScript.
export {};
