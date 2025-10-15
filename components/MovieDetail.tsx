import React, { useEffect, useState } from 'react';
import type { Movie } from '../types';

interface MovieDetailProps {
    movie: Movie;
    onClose: () => void;
}

const MovieDetail: React.FC<MovieDetailProps> = ({ movie, onClose }) => {
    const [isLoaded, setIsLoaded] = useState(false);
    
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

    return (
        <div 
            className="fixed inset-0 z-[100] bg-black bg-opacity-70 flex items-center justify-center backdrop-blur-sm transition-opacity duration-300 ease-out"
            onClick={onClose}
        >
            <div 
                className={`relative bg-tubi-gray w-full max-w-4xl rounded-lg overflow-hidden shadow-2xl m-4 transition-all duration-300 ease-out ${isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking on the modal content
            >
                <div className="relative h-64 md:h-96">
                    <img 
                        src={movie.posterUrl} 
                        alt={movie.title}
                        className="absolute inset-0 w-full h-full object-cover opacity-30 blur-sm"
                    />
                     <div className="absolute inset-0 bg-gradient-to-t from-tubi-gray via-tubi-gray/70 to-transparent"></div>
                </div>

                <div className="p-6 md:p-8 -mt-32 md:-mt-48 relative z-10 flex flex-col md:flex-row gap-6 md:gap-8">
                     <div className="flex-shrink-0 w-40 md:w-52 mx-auto md:mx-0">
                        <img 
                            src={movie.posterUrl} 
                            alt={movie.title}
                            className="w-full h-auto object-cover rounded-lg shadow-lg aspect-[2/3]"
                        />
                    </div>
                    <div className="flex-1 text-center md:text-left">
                        <h1 className="text-3xl md:text-4xl font-extrabold text-white">{movie.title}</h1>
                         <div className="mt-2 flex justify-center md:justify-start items-center space-x-4 text-sm text-tubi-light-gray">
                            <span>2024</span>
                            <span>&bull;</span>
                            <span>1h 58m</span>
                            <span>&bull;</span>
                            <span className="border px-1 rounded">HD</span>
                        </div>
                        <p className="mt-4 text-sm md:text-base text-gray-300 line-clamp-4">{description}</p>
                        
                        <div className="mt-6 flex items-center justify-center md:justify-start space-x-4">
                            <button className="flex items-center justify-center bg-white text-black font-bold px-6 py-2.5 rounded-full text-base hover:bg-opacity-80 transition-all duration-300 transform hover:scale-105">
                                <PlayIcon />
                                <span className="ml-2">Play</span>
                            </button>
                             <button className="flex items-center justify-center bg-gray-500 bg-opacity-40 text-white font-bold p-3 rounded-full hover:bg-opacity-60 transition-all duration-300 transform hover:scale-105 backdrop-blur-sm">
                                <PlusIcon />
                            </button>
                        </div>
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

const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);


export default MovieDetail;
