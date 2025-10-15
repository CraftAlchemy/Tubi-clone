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

// FIX: Add global declaration for ion-icon to fix TypeScript errors.
declare global {
    namespace JSX {
        interface IntrinsicElements {
            "ion-icon": any;
        }
    }
}