// FIX: Add a triple-slash directive to explicitly include React's type definitions.
// This ensures that the global JSX namespace is populated with standard HTML elements
// before this file extends it with 'ion-icon'. This resolves all 'Property ... does not exist on type 'JSX.IntrinsicElements'' errors
// and related type resolution issues across the application.
/// <reference types="react" />

// For ion-icon custom elements
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'ion-icon': any;
    }
  }
}

export interface Movie {
  id: number;
  title: string;
  posterUrl: string;
  description?: string;
  trailerUrl?: string;
  videoUrl?: string;
  tokenCost?: number;
}

export interface Episode {
  id: number;
  title: string;
  posterUrl: string;
  description: string;
  duration: string;
  videoUrl: string;
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

export interface Category {
  title: string;
  movies: Movie[];
}

export interface SeriesCategory {
  title: string;
  series: Series[];
}

export interface User {
  id: number;
  email: string;
  password?: string; // Should not be exposed to client in a real app
  role: 'user' | 'admin';
  tokens: number;
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

export interface InStreamAd {
    id: number;
    videoUrl: string;
    duration: number;
    placement: 'pre-roll' | 'mid-roll' | 'post-roll';
}

export interface BannerAd {
    id: number;
    imageUrl: string;
    linkUrl: string;
    placement: 'home-top' | 'sidebar';
}