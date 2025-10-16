import type { SeriesCategory } from '../types';

export const SERIES_CATEGORIES: SeriesCategory[] = [
    {
        title: "Critically Acclaimed Dramas",
        series: [
            {
                id: 101,
                title: "The Crown Jewel",
                posterUrl: "https://picsum.photos/400/600?random=101",
                description: "A deep dive into the intricate lives of a royal family, spanning several decades of political and personal turmoil.",
                tokenCost: 5,
                seasons: [
                    {
                        id: 201,
                        title: "Season 1",
                        episodes: [
                            { id: 301, title: "The Heir", posterUrl: "https://picsum.photos/400/225?random=301", description: "A new heir is born, sending ripples through the court.", videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", duration: "58m", tokenCost: 0 },
                            { id: 302, title: "The Conflict", posterUrl: "https://picsum.photos/400/225?random=302", description: "Political tensions rise, testing the monarch's resolve.", videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", duration: "55m" },
                        ]
                    },
                    {
                        id: 202,
                        title: "Season 2",
                        tokenCost: 2,
                        episodes: [
                            { id: 303, title: "New Beginnings", posterUrl: "https://picsum.photos/400/225?random=303", description: "The family enters a new decade with new challenges.", videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", duration: "59m" },
                            { id: 304, title: "The Betrayal", posterUrl: "https://picsum.photos/400/225?random=304", description: "A trusted advisor's loyalty is questioned.", videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", duration: "52m", tokenCost: 3 },
                        ]
                    }
                ]
            }
        ]
    },
    {
        title: "Sci-Fi Adventures",
        series: [
            {
                id: 102,
                title: "Galaxy Wanderers",
                posterUrl: "https://picsum.photos/400/600?random=102",
                description: "A rogue crew of explorers chart unknown regions of space, encountering strange new worlds and dangerous adversaries.",
                seasons: [
                    {
                        id: 203,
                        title: "Season 1",
                        episodes: [
                            { id: 305, title: "The Anomaly", posterUrl: "https://picsum.photos/400/225?random=305", description: "The crew discovers a mysterious cosmic phenomenon.", videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", duration: "45m" },
                            { id: 306, title: "First Contact", posterUrl: "https://picsum.photos/400/225?random=306", description: "A tense first encounter with an alien species.", videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", duration: "48m" },
                        ]
                    }
                ]
            }
        ]
    }
];