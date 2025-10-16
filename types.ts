// Fix: Add a triple-slash directive to include React's JSX type definitions, making the global JSX namespace available for augmentation.
/// <reference types="react" />

// The `declare global` block augments React's JSX types to include the custom `ion-icon` element.
// This file is treated as a module because it contains exports, which ensures
// that this declaration correctly merges with existing JSX definitions rather than overwriting them.

export interface Movie {
  id: number;
  title: string;
  posterUrl: string;
  description?: string; // Optional for hero movie
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
            // Fix: Use the globally-available JSX namespace to define intrinsic elements.
            // This avoids issues where a direct 'react' import might be stripped from a types-only file,
            // preventing the global augmentation from being applied.
            'ion-icon': JSX.HTMLAttributes<HTMLElement> & { name?: string; };
        }
    }
}
