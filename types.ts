import React from 'react';

// The `declare global` block augments React's JSX types to include the custom `ion-icon` element.
// This file is treated as a module because it contains exports, which ensures
// that this declaration correctly merges with existing JSX definitions rather than overwriting them.

export interface Movie {
  id: number;
  title: string;
  posterUrl: string;
  description?: string;
  videoUrl?: string;
  trailerUrl?: string;
}

export interface Category {
  title:string;
  movies: Movie[];
}

export interface Episode {
  id: number;
  title: string;
  posterUrl: string;
  description?: string;
  videoUrl?: string;
  duration?: string;
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
  description?: string;
  seasons: Season[];
}

export interface SeriesCategory {
  title: string;
  series: Series[];
}

export interface User {
  id: number;
  email: string;
  password?: string; // Password should not be passed around
  role: 'user' | 'admin';
}

export interface LiveTVChannel {
  id: number;
  name: string;
  logoUrl: string;
  streamUrl: string;
}

// Add global declaration for ion-icon to fix TypeScript errors.
// Fix: Use `declare global` to augment JSX's IntrinsicElements from within a module.
declare global {
    namespace JSX {
        interface IntrinsicElements {
            'ion-icon': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & { name?: string }, HTMLElement>;
        }
    }
}
