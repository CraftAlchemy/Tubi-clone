
export interface Movie {
  id: number;
  title: string;
  posterUrl: string;
  description?: string; // Optional for hero movie
}

export interface Category {
  title: string;
  movies: Movie[];
}
