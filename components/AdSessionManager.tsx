


// FIX: Import global type definitions to resolve errors related to missing JSX intrinsic elements like 'div' and 'iframe'.
import '../types';
import React, { useState, useEffect, useRef } from 'react';
import type { Advertisement } from '../types';

interface AdSessionManagerProps {
    advertisement: Advertisement;
    onClose: () => void;
    onTokensEarned: (amount: number) => void;
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
            // NOTE: YouTube API might not allow disabling controls for ads. This is a best effort.
            return `https://www.youtube.com/embed/${videoId}?autoplay=1&controls=0&rel=0&showinfo=0&modestbranding=1&iv_load_policy=3`;
        }
    } catch (e) {
        console.error("Invalid ad video URL", url);
        return null;
    }
    return null;
};


const AdSessionManager: React.FC<AdSessionManagerProps> = ({ advertisement, onClose, onTokensEarned }) => {
    const [countdown, setCountdown] = useState(advertisement.duration);
    const timerRef = useRef<number | null>(null);

    const videoUrl = getYoutubeEmbedUrl(advertisement.videoUrl);

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        
        timerRef.current = window.setInterval(() => {
            setCountdown(prev => {
                if (prev <= 1) {
                    clearInterval(timerRef.current!);
                    onTokensEarned(advertisement.tokenReward);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        
        // Auto close after ad finishes + a small delay
        const autoCloseTimer = setTimeout(() => {
            onClose();
        }, (advertisement.duration + 2) * 1000);

        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
            clearTimeout(autoCloseTimer);
            document.body.style.overflow = 'auto';
        };
    }, [advertisement, onTokensEarned, onClose]);

    return (
         <div className="fixed inset-0 z-[120] bg-black bg-opacity-90 flex items-center justify-center">
            <div className="relative w-full h-full max-w-5xl aspect-video bg-black">
                {videoUrl ? (
                    <iframe
                        className="w-full h-full pointer-events-none" // prevent user interaction
                        src={videoUrl}
                        title={advertisement.title}
                        frameBorder="0"
                        allow="autoplay; encrypted-media;"
                    ></iframe>
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-white">
                        <p>Advertisement could not be loaded.</p>
                    </div>
                )}
                <div className="absolute top-4 right-4 bg-black/70 text-white p-2 rounded-md text-sm font-mono">
                    {countdown > 0 ? `Reward in ${countdown}s` : `Tokens Earned!`}
                </div>
                 <div className="absolute bottom-4 left-4 bg-black/70 text-white p-2 rounded-md">
                     <p className="font-bold text-lg">{advertisement.title}</p>
                     <p className="text-sm">You will earn <span className="font-bold text-yellow-400">{advertisement.tokenReward} token{advertisement.tokenReward > 1 ? 's' : ''}</span> for watching.</p>
                 </div>

                {countdown === 0 && (
                     <button 
                        onClick={onClose}
                        className="absolute top-4 left-4 bg-myflix-red text-white font-bold py-2 px-4 rounded-full hover:opacity-80 animate-fade-in"
                    >
                        Close
                    </button>
                )}
            </div>
        </div>
    );
};

export default AdSessionManager;