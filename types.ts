// Fix: Use a side-effect import to ensure React's global types, including the JSX namespace, are loaded.
import 'react';

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

export interface User {
  id: number;
  email: string;
  password?: string; // Password should not be passed around
  role: 'user' | 'admin';
}

// Add global declaration for ion-icon to fix TypeScript errors.
declare global {
    namespace JSX {
        interface IntrinsicElements {
            // Fix: Replaced incorrect `JSX.HTMLAttributes` with the correct `React.HTMLAttributes`
            // to properly extend JSX typings for the custom ion-icon element.
            'ion-icon': React.HTMLAttributes<HTMLElement> & { name?: string; };
        }
    }
}
