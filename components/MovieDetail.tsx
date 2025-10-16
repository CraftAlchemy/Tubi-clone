
import React, { useEffect, useState } from 'react';
import type { Movie, User } from '../types';

interface MovieDetailProps {
    movie: Movie;
    onClose: () => void;
    myList: number[];
    onToggleMyList: (movieId: number) => void;
    onPlay: (movie: Movie) => void;
    currentUser: User | null;
}

const getYoutubeVideoDetails = (url: string | undefined): { embedUrl: string; thumbnailUrl: string; } | null => {
    if (!url) return null;
    try {
        const urlObj = new URL(url);
        if (urlObj.hostname.includes('youtube.com') || urlObj.hostname.includes('youtu.be')) {
            const videoId = urlObj.searchParams.get('v') || urlObj.pathname.split('/').pop();
            if (videoId) {
                return {
                    embedUrl: `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&showinfo=0&modestbranding=1`,
                    thumbnailUrl: `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`
                };
            }
        }
    } catch (e) {
        console.error("Invalid trailer URL", url);
        return null;
    }
    return null;
}

const MovieDetail: React.FC<MovieDetailProps> = ({ movie, onClose, myList, onToggleMyList, onPlay, currentUser }) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [isPlayingTrailer, setIsPlayingTrailer] = useState(false);
    
    useEffect(() => {
        // Prevent background scrolling when modal is open
        document.body.style.overflow = 'hidden';
        // Trigger animation
        const timer = setTimeout(() => setIsLoaded(true), 50);
        
        return () => {
            document.body.style.overflow = 'auto';
            clearTimeout(timer);
        };
    }, []);
    
    const description = movie.description || 'A gripping tale of adventure and mystery that will keep you on the edge of your seat. Follow our hero as they navigate a world of challenges and uncover secrets that could change everything. Perfect for a movie night.';
    const isInMyList = myList.includes(movie.id);
    const trailerDetails = getYoutubeVideoDetails(movie.trailerUrl);
    const tokenCost = movie.tokenCost;
    const hasEnoughTokens = !tokenCost || (currentUser && currentUser.tokens >= tokenCost);

    return (
        <div 
            className="fixed inset-0 z-[100] bg-black bg-opacity-70 backdrop-blur-sm transition-opacity duration-300 ease-out overflow-y-auto"
            onClick={onClose}
        >
            <div className="flex items-center justify-center min-h-screen p-4 sm:p-6 md:p-8">
                <div 
                    className={`relative bg-myflix-gray w-full max-w-4xl rounded-lg overflow-hidden shadow-2xl transition-all duration-300 ease-out ${isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
                    onClick={(e) => e.stopPropagation()} // Prevent closing when clicking on the modal content
                >
                    <div className="relative h-64 md:h-96">
                        <img 
                            src={movie.posterUrl} 
                            alt={movie.title}
                            className="absolute inset-0 w-full h-full object-cover opacity-30 blur-sm"
                        />
                         <div className="absolute inset-0 bg-gradient-to-t from-myflix-gray via-myflix-gray/70 to-transparent"></div>
                    </div>

                    <div className="p-6 md:p-8 -mt-32 md:-mt-48 relative z-10">
                        <div className="flex flex-col md:flex-row gap-6 md:gap-8">
                            <div className="flex-shrink-0 w-40 md:w-52 mx-auto md:mx-0">
                                <img 
                                    src={movie.posterUrl} 
                                    alt={movie.title}
                                    className="w-full h-auto object-cover rounded-lg shadow-lg aspect-[2/3]"
                                />
                            </div>
                            <div className="flex-1 text-center md:text-left">
                                <h1 className="text-3xl md:text-4xl font-extrabold text-white">{movie.title}</h1>
                                <div className="mt-2 flex justify-center md:justify-start items-center space-x-4 text-sm text-myflix-light-gray">
                                    <span>2024</span>
                                    <span>&bull;</span>
                                    <span>1h 58m</span>
                                    <span>&bull;</span>
                                    <span className="border px-1 rounded">HD</span>
                                </div>
                                <p className="mt-4 text-sm md:text-base text-gray-300 line-clamp-3 sm:line-clamp-none">{description}</p>
                                
                                <div className="mt-6 flex flex-col items-center md:items-start">
                                    <div className="flex items-center justify-center md:justify-start space-x-4">
                                        <button 
                                            onClick={() => onPlay(movie)}
                                            className="flex items-center justify-center bg-white text-black font-bold px-6 py-2.5 rounded-full text-base hover:bg-opacity-80 transition-all duration-300 transform hover:scale-105"
                                            disabled={!currentUser}
                                            title={!currentUser ? "Please sign in to play" : ""}
                                        >
                                            <PlayIcon />
                                            <span className="ml-2">
                                                {tokenCost ? `Play (${tokenCost} ${tokenCost > 1 ? 'Tokens' : 'Token'})` : 'Play'}
                                            </span>
                                        </button>
                                        {currentUser && (
                                            <button 
                                                onClick={() => onToggleMyList(movie.id)}
                                                className="flex items-center justify-center bg-gray-500 bg-opacity-40 text-white font-bold p-3 rounded-full hover:bg-opacity-60 transition-all duration-300 transform hover:scale-105 backdrop-blur-sm"
                                                title={isInMyList ? 'Remove from My List' : 'Add to My List'}
                                            >
                                                {isInMyList ? <CheckIcon /> : <PlusIcon />}
                                            </button>
                                        )}
                                    </div>
                                    {!hasEnoughTokens && currentUser && (
                                         <div className="mt-3 text-center md:text-left text-sm text-red-400 bg-red-900/30 p-2 rounded-md">
                                            Not enough tokens. <a href="#/earn-tokens" onClick={onClose} className="font-bold underline hover:text-red-300">Earn more here.</a>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        {/* Trailer Section */}
                        {trailerDetails && (
                            <div className="mt-8 pt-6 border-t border-gray-700">
                                <h2 className="text-xl md:text-2xl font-bold text-white mb-4">Trailer</h2>
                                <div className="aspect-video bg-black rounded-lg relative overflow-hidden">
                                    {!isPlayingTrailer ? (
                                        <div 
                                            className="w-full h-full flex items-center justify-center group cursor-pointer" 
                                            onClick={() => setIsPlayingTrailer(true)}
                                            title="Play trailer"
                                        >
                                            <img
                                                src={trailerDetails.thumbnailUrl}
                                                alt="Trailer thumbnail"
                                                className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-300"
                                            />
                                            <div className="absolute inset-0 bg-black bg-opacity-30 group-hover:bg-opacity-10 transition-colors duration-300 flex items-center justify-center">
                                                <PlayCircleIcon />
                                            </div>
                                        </div>
                                    ) : (
                                        <iframe
                                            className="absolute top-0 left-0 w-full h-full"
                                            src={trailerDetails.embedUrl}
                                            title="Movie Trailer"
                                            frameBorder="0"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                        ></iframe>
                                    )}
                                </div>
                            </div>
                        )}
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
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
    </svg>
);

const PlusIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
    </svg>
);

const CheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
);

const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const PlayCircleIcon = () => (
    <div className="w-20 h-20 bg-black bg-opacity-50 rounded-full flex items-center justify-center border-2 border-white/70 backdrop-blur-sm group-hover:bg-opacity-70 group-hover:scale-105 transition-all duration-300">
        <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-10 w-10 text-white" 
            viewBox="0 0 20 20" 
            fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
        </svg>
    </div>
);


export default MovieDetail;