// FIX: Removed redundant side-effect import for types as it is now handled globally in index.tsx.
import React, { useState, useEffect } from 'react';
import type { Series, Episode, User, Season } from '../types';

interface SeriesDetailProps {
    series: Series;
    onClose: () => void;
    onPlayEpisode: (episode: Episode) => void;
    currentUser: User | null;
}

const getEffectiveTokenCost = (episode: Episode, season: Season, series: Series): number | undefined => {
    if (episode.tokenCost !== undefined) return episode.tokenCost;
    if (season.tokenCost !== undefined) return season.tokenCost;
    if (series.tokenCost !== undefined) return series.tokenCost;
    return undefined;
};


const SeriesDetail: React.FC<SeriesDetailProps> = ({ series, onClose, onPlayEpisode, currentUser }) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [selectedSeasonId, setSelectedSeasonId] = useState<number>(series.seasons[0]?.id);

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        const timer = setTimeout(() => setIsLoaded(true), 50);
        
        return () => {
            document.body.style.overflow = 'auto';
            clearTimeout(timer);
        };
    }, []);

    const selectedSeason = series.seasons.find(s => s.id === selectedSeasonId);

    return (
        <div 
            className="fixed inset-0 z-[100] bg-black bg-opacity-70 backdrop-blur-sm transition-opacity duration-300 ease-out overflow-y-auto"
            onClick={onClose}
        >
            <div className="flex items-center justify-center min-h-screen p-4 sm:p-6 md:p-8">
                <div 
                    className={`relative bg-myflix-gray w-full max-w-4xl rounded-lg overflow-hidden shadow-2xl transition-all duration-300 ease-out ${isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="relative h-64 md:h-96">
                        <img 
                            src={series.posterUrl} 
                            alt={series.title}
                            className="absolute inset-0 w-full h-full object-cover opacity-30 blur-sm"
                        />
                         <div className="absolute inset-0 bg-gradient-to-t from-myflix-gray via-myflix-gray/70 to-transparent"></div>
                    </div>

                    <div className="p-6 md:p-8 -mt-32 md:-mt-48 relative z-10">
                        <div className="flex flex-col md:flex-row gap-6 md:gap-8">
                            <div className="flex-shrink-0 w-40 md:w-52 mx-auto md:mx-0">
                                <img 
                                    src={series.posterUrl} 
                                    alt={series.title}
                                    className="w-full h-auto object-cover rounded-lg shadow-lg aspect-[2/3]"
                                />
                            </div>
                            <div className="flex-1 text-center md:text-left">
                                <h1 className="text-3xl md:text-4xl font-extrabold text-white">{series.title}</h1>
                                <p className="mt-4 text-sm md:text-base text-gray-300 line-clamp-4 sm:line-clamp-none">{series.description}</p>
                            </div>
                        </div>
                        
                        {/* Seasons and Episodes Section */}
                        <div className="mt-8 pt-6 border-t border-gray-700">
                            <div className="flex items-center gap-4 mb-4 border-b border-gray-700">
                                {series.seasons.map(season => (
                                    <button 
                                        key={season.id}
                                        onClick={() => setSelectedSeasonId(season.id)}
                                        className={`py-2 px-1 font-semibold transition-colors ${selectedSeasonId === season.id ? 'text-white border-b-2 border-myflix-red' : 'text-gray-400 hover:text-white'}`}
                                    >
                                        {season.title}
                                    </button>
                                ))}
                            </div>
                            
                            <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
                                {selectedSeason?.episodes.map(episode => {
                                    const tokenCost = getEffectiveTokenCost(episode, selectedSeason, series);
                                    const hasEnoughTokens = !tokenCost || (currentUser && currentUser.tokens >= tokenCost);

                                    return (
                                        <div key={episode.id} className="flex items-start sm:items-center gap-4 p-2 rounded-md hover:bg-myflix-black/50 flex-col sm:flex-row">
                                            <div className="relative w-32 h-20 flex-shrink-0">
                                                <img src={episode.posterUrl} alt={episode.title} className="w-full h-full object-cover rounded-md"/>
                                                <div className="absolute inset-0 bg-black/20"></div>
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-bold text-white">{episode.title}</h4>
                                                <p className="text-xs text-gray-400 line-clamp-2">{episode.description}</p>
                                                {!hasEnoughTokens && currentUser && (
                                                    <div className="mt-1 text-xs text-red-400">
                                                        Not enough tokens. <a href="#/earn-tokens" onClick={onClose} className="font-bold underline hover:text-red-300">Get more.</a>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-4 self-end sm:self-center">
                                                {tokenCost && (
                                                    <div className="bg-yellow-500 text-black text-xs font-bold px-1.5 py-0.5 rounded-full flex items-center gap-1">
                                                        <ion-icon name="cash-outline" style={{fontSize: '14px'}}></ion-icon>
                                                        <span>{tokenCost}</span>
                                                    </div>
                                                )}
                                                <span className="text-sm text-gray-400">{episode.duration}</span>
                                                <button 
                                                    onClick={() => {
                                                        const episodeWithCost = { ...episode, tokenCost };
                                                        onPlayEpisode(episodeWithCost);
                                                    }}
                                                    className={`p-2 rounded-full text-white transition-colors ${hasEnoughTokens ? 'bg-white/10 hover:bg-white/20' : 'bg-gray-700 text-gray-500 cursor-not-allowed'}`}
                                                    title={hasEnoughTokens ? `Play ${episode.title}`: `Requires ${tokenCost} tokens`}
                                                    disabled={!hasEnoughTokens}
                                                >
                                                <PlayIcon />
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    <button 
                        onClick={onClose}
                        className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-20"
                        aria-label="Close"
                        title="Close"
                    >
                        <CloseIcon />
                    </button>
                </div>
            </div>
        </div>
    );
};

const PlayIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
    </svg>
);

const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);

export default SeriesDetail;