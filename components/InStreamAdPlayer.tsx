

// FIX: Import global type definitions to resolve errors related to missing JSX intrinsic elements like 'div' and 'p'.
import '../types';
import React from 'react';
import type { InStreamAd } from '../types';

interface InStreamAdPlayerProps {
    ad: InStreamAd;
    onComplete: () => void;
}

const InStreamAdPlayer: React.FC<InStreamAdPlayerProps> = ({ ad, onComplete }) => {
    // A real implementation would use a proper video player and track progress.
    // This is a simplified placeholder.
    
    React.useEffect(() => {
        const timer = setTimeout(() => {
            onComplete();
        }, ad.duration * 1000);
        
        return () => clearTimeout(timer);
    }, [ad, onComplete]);

    return (
        <div className="absolute inset-0 z-50 bg-black flex flex-col items-center justify-center text-white">
            <p className="text-2xl">Advertisement Playing</p>
            <p>{ad.placement}</p>
            <button onClick={onComplete} className="mt-4 bg-gray-700 p-2 rounded-md">Skip Ad (Debug)</button>
        </div>
    );
};

export default InStreamAdPlayer;