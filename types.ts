// FIX: Wrapped the JSX namespace declaration in `declare global` to correctly augment 
// the JSX.IntrinsicElements type from within a module. This makes the type definition
// for the custom element 'ion-icon' available globally.
declare global {
    namespace JSX {
        interface IntrinsicElements {
            'ion-icon': any;
        }
    }
}

export interface User {
    id: number;
    email: string;
    password?: string; // Should be handled securely on the backend
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
    placement: 'home-top' | 'sidebar' | 'footer';
}