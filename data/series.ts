
import type { SeriesCategory } from '../types';

const generateEpisodes = (count: number, seasonSeed: number) => {
    return Array.from({ length: count }, (_, i) => ({
        id: seasonSeed * 100 + i,
        title: `Episode ${i + 1}`,
        description: `Description for Season ${Math.floor(seasonSeed / 10)}, Episode ${i + 1}.`,
        posterUrl: `https://picsum.photos/400/225?random=${seasonSeed * 100 + i}`,
        duration: `${Math.floor(Math.random() * 15) + 40}m`,
        videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        tokenCost: Math.random() > 0.9 ? 1 : undefined,
    }));
};

const generateSeasons = (count: number, seriesSeed: number) => {
    return Array.from({ length: count }, (_, i) => ({
        id: seriesSeed * 10 + i,
        title: `Season ${i + 1}`,
        episodes: generateEpisodes(10, seriesSeed * 10 + i),
        tokenCost: i > 0 && Math.random() > 0.7 ? 5 : undefined, // First season often free
    }));
};

const generateSeries = (count: number, seed: number, category: string): SeriesCategory['series'] => {
    return Array.from({ length: count }, (_, i) => ({
        id: seed * 100 + i,
        title: `${category} Series ${i + 1}`,
        posterUrl: `https://picsum.photos/400/600?random=${seed * 100 + i}`,
        description: `This is a description for the amazing ${category} Series ${i + 1}. Follow the journey of incredible characters through a world of challenges and triumphs.`,
        seasons: generateSeasons(Math.floor(Math.random() * 4) + 1, seed * 100 + i),
        tokenCost: Math.random() > 0.8 ? 10 : undefined,
    }));
};

export const SERIES_CATEGORIES: SeriesCategory[] = [
    {
        title: "Myflix Originals",
        series: generateSeries(8, 10, "Original"),
    },
    {
        title: "Critically Acclaimed Dramas",
        series: generateSeries(8, 11, "Drama"),
    },
    {
        title: "Mind-Bending Sci-Fi",
        series: generateSeries(8, 12, "Sci-Fi"),
    },
];
