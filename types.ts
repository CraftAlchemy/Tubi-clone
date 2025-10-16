
// Add type augmentation for ion-icon
declare namespace JSX {
    interface IntrinsicElements {
        'ion-icon': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & { name: string; style?: React.CSSProperties }, HTMLElement>;
    }
}

export interface User {
    id: number;
    email: string;
    password?: string; // Should not be sent to client
    role: 'user' | 'admin';
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
    videoUrl: string;
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
    duration: number; // in seconds
    tokenReward: number;
}

export interface TokenPack {
    id: number;
    amount: number;
    price: number;
    isBestValue: boolean;
}
