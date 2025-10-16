
import React, { useEffect, useState } from 'react';
import type { Series, Episode } from '../types';

interface SeriesDetailProps {
    series: Series;
    onClose: () => void;
    onPlayEpisode: (episode: Episode) => void;
}

const SeriesDetail: React.FC<SeriesDetailProps> = ({ series, onClose, onPlayEpisode }) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [selectedSeasonIndex, setSelectedSeasonIndex] = useState(0);
    
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        const timer = setTimeout(() => setIsLoaded(true), 50);
        
        return () => {
            document.body.style.overflow = 'auto';
            clearTimeout(timer);
        };
    }, []);
    
    const description = series.description || 'A gripping tale of adventure and mystery that will keep you on the edge of your seat. Follow our hero as they navigate a world of challenges and uncover secrets that could change everything.';
    const selectedSeason = series.seasons[selectedSeasonIndex];

    return (
        <div 
            className="fixed inset-0 z-[100] bg-black bg-opacity-70 backdrop-blur-sm transition-opacity duration-300 ease-out overflow-y-auto"
            onClick={onClose}
        >
            <div className="flex items-start justify-center min-h-screen p-4 sm:p-6 md:p-8">
                <div 
                    className={`relative bg-tubi-gray w-full max-w-4xl rounded-lg overflow-hidden shadow-2xl transition-all duration-300 ease-out my-8 ${isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="relative h-64 md:h-80">
                        <img 
                            src={series.posterUrl} 
                            alt={series.title}
                            className="absolute inset-0 w-full h-full object-cover opacity-30 blur-sm scale-110"
                        />
                         <div className="absolute inset-0 bg-gradient-to-t from-tubi-gray via-tubi-gray/70 to-transparent"></div>
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
                                <div className="mt-2 flex justify-center md:justify-start items-center space-x-4 text-sm text-tubi-light-gray">
                                    <span>{series.seasons.length} Season{series.seasons.length > 1 ? 's' : ''}</span>
                                    <span>&bull;</span>
                                    <span className="border px-1 rounded">HD</span>
                                </div>
                                <p className="mt-4 text-sm md:text-base text-gray-300 line-clamp-4">{description}</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="p-6 md:p-8 pt-0">
                        <div className="flex items-center justify-between mb-4 border-t border-gray-700 pt-6">
                            <h2 className="text-xl md:text-2xl font-bold text-white">Episodes</h2>
                            {series.seasons.length > 1 && (
                                <select 
                                    value={selectedSeasonIndex} 
                                    onChange={(e) => setSelectedSeasonIndex(Number(e.target.value))}
                                    className="bg-tubi-black border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-tubi-red focus:border-tubi-red"
                                    aria-label="Select season"
                                >
                                    {series.seasons.map((season, index) => (
                                        <option key={season.id} value={index}>{season.title}</option>
                                    ))}
                                </select>
                            )}
                        </div>
                        <div className="space-y-3 max-h-[40vh] overflow-y-auto pr-2 scrollbar-thin">
                            {selectedSeason?.episodes.map((episode, index) => (
                                <div key={episode.id} className="flex items-center gap-4 p-2.5 rounded-lg hover:bg-tubi-black/50 transition-colors duration-200">
                                    <div className="text-lg font-mono text-gray-400 w-6 text-center flex-shrink-0">{index + 1}</div>
                                    <div 
                                        className="relative w-36 h-20 rounded-md overflow-hidden flex-shrink-0 group cursor-pointer" 
                                        onClick={() => onPlayEpisode(episode)}
                                        title="Play episode"
                                    >
                                        <img src={episode.posterUrl} alt={episode.title} className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center">
                                            <PlayCircleIcon small />
                                        </div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start">
                                            <h3 className="text-white font-semibold truncate">{episode.title}</h3>
                                            <span className="text-sm text-gray-400 flex-shrink-0 ml-4">{episode.duration}</span>
                                        </div>
                                        <p className="text-sm text-gray-400 line-clamp-2 mt-1">{episode.description}</p>
                                    </div>
                                </div>
                            ))}
                             {!selectedSeason || selectedSeason.episodes.length === 0 && (
                                <p className="text-gray-400 text-center py-8">No episodes found for this season.</p>
                             )}
                        </div>
                    </div>
                    <button 
                        onClick={onClose}
                        className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-20"
                        aria-label="Close"
                    >
                        <CloseIcon />
                    </button>
                </div>
            </div>
        </div>
    );
};

const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const PlayCircleIcon: React.FC<{ small?: boolean }> = ({ small }) => (
    <div className={`${small ? 'w-10 h-10' : 'w-20 h-20'} bg-black bg-opacity-50 rounded-full flex items-center justify-center border-2 border-white/70 backdrop-blur-sm opacity-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300`}>
        <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className={`${small ? 'h-5 w-5' : 'h-10 w-10'} text-white`}
            viewBox="0 0 20 20" 
            fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
        </svg>
    </div>
);


export default SeriesDetail;