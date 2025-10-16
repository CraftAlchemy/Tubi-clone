
import React, { useEffect } from 'react';
import type { Movie, Episode } from '../types';

interface VideoPlayerProps {
    content: Movie | Episode;
    onClose: () => void;
}

const getYoutubeEmbedUrl = (url: string | undefined): string | null => {
    if (!url) return null;
    try {
        const urlObj = new URL(url);
        let videoId: string | null = null;
        if (urlObj.hostname.includes('youtube.com')) {
            videoId = urlObj.searchParams.get('v');
        } else if (urlObj.hostname.includes('youtu.be')) {
            videoId = urlObj.pathname.split('/').pop() || null;
        }
        
        if (videoId) {
            return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&showinfo=0&modestbranding=1`;
        }
    } catch (e) {
        console.error("Invalid video URL", url);
        return null;
    }
    return null; // or return a generic "unsupported video" URL
};

const VideoPlayer: React.FC<VideoPlayerProps> = ({ content, onClose }) => {
    useEffect(() => {
        const handleEsc = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        window.addEventListener('keydown', handleEsc);
        document.body.style.overflow = 'hidden';

        return () => {
            window.removeEventListener('keydown', handleEsc);
            document.body.style.overflow = 'auto';
        };
    }, [onClose]);

    const videoUrl = getYoutubeEmbedUrl(content.videoUrl);

    return (
        <div className="fixed inset-0 z-[120] bg-black bg-opacity-90 flex items-center justify-center animate-fade-in" onClick={onClose}>
            <div className="relative w-full h-full max-w-5xl aspect-video bg-black" onClick={(e) => e.stopPropagation()}>
                {videoUrl ? (
                    <iframe
                        className="w-full h-full"
                        src={videoUrl}
                        title={content.title}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    ></iframe>
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-white">
                        <p>Video not available or format not supported.</p>
                    </div>
                )}
                 <button 
                    onClick={onClose}
                    className="absolute -top-4 -right-4 md:top-2 md:right-2 text-white bg-black/50 rounded-full h-10 w-10 flex items-center justify-center text-2xl hover:bg-myflix-red transition-colors z-20"
                    aria-label="Close player"
                >
                    &times;
                </button>
            </div>
        </div>
    );
};

export default VideoPlayer;
