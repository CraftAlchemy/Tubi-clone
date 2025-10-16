import React, { useEffect, useState } from 'react';
import type { Movie } from '../types';

interface VideoPlayerProps {
    movie: Movie;
    onClose: () => void;
}

const getEmbedUrl = (url: string | undefined): string | null => {
    if (!url) return null;

    try {
        const urlObj = new URL(url);
        // YouTube
        if (urlObj.hostname.includes('youtube.com') || urlObj.hostname.includes('youtu.be')) {
            const videoId = urlObj.searchParams.get('v') || urlObj.pathname.split('/').pop();
            if (videoId) {
                return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&showinfo=0&modestbranding=1`;
            }
        }
        // Google Drive
        if (urlObj.hostname.includes('drive.google.com')) {
            // This is a common pattern, but might need adjustment for different sharing link formats
            const match = url.match(/file\/d\/([^/]+)/);
            if (match && match[1]) {
                return `https://drive.google.com/file/d/${match[1]}/preview`;
            }
        }
        // For other platforms, we might need more specific logic.
        // As a fallback, we can check if it's a direct embeddable link.
        // This is a basic check and might not cover all cases.
        return url;
    } catch (error) {
        console.error("Invalid URL for video player:", url);
        return null;
    }
}


const VideoPlayer: React.FC<VideoPlayerProps> = ({ movie, onClose }) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const embedUrl = getEmbedUrl(movie.videoUrl);

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        const timer = setTimeout(() => setIsLoaded(true), 50);

        const handleEsc = (event: KeyboardEvent) => {
           if (event.key === 'Escape') {
              onClose();
           }
        };
        window.addEventListener('keydown', handleEsc);

        return () => {
            document.body.style.overflow = 'auto';
            clearTimeout(timer);
            window.removeEventListener('keydown', handleEsc);
        };
    }, [onClose]);

    if (!embedUrl) {
        return (
            <div className="fixed inset-0 z-[110] bg-black bg-opacity-80 flex items-center justify-center p-4" onClick={onClose}>
                <div className="bg-tubi-gray p-8 rounded-lg text-center" onClick={(e) => e.stopPropagation()}>
                    <h2 className="text-xl text-white mb-4">Video Not Available</h2>
                    <p className="text-tubi-light-gray">The video for "{movie.title}" could not be loaded.</p>
                     <button onClick={onClose} className="mt-6 bg-tubi-red text-white font-bold px-6 py-2 rounded-full hover:opacity-80 transition-opacity">Close</button>
                </div>
            </div>
        );
    }

    return (
        <div 
            className="fixed inset-0 z-[110] bg-black bg-opacity-80 backdrop-blur-sm flex items-center justify-center p-4 transition-opacity duration-300 ease-out"
            onClick={onClose}
        >
            <div 
                className={`relative w-full max-w-5xl aspect-video bg-black rounded-lg shadow-2xl transition-all duration-300 ease-out ${isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
                onClick={(e) => e.stopPropagation()}
            >
                <iframe
                    className="absolute top-0 left-0 w-full h-full rounded-lg"
                    src={embedUrl}
                    title={movie.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                ></iframe>
                <button 
                    onClick={onClose}
                    className="absolute -top-3 -right-3 md:-top-4 md:-right-4 text-white bg-tubi-gray rounded-full h-8 w-8 md:h-10 md:w-10 flex items-center justify-center hover:bg-tubi-red transition-colors z-20"
                    aria-label="Close player"
                >
                    <CloseIcon />
                </button>
            </div>
        </div>
    );
}

const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);


export default VideoPlayer;