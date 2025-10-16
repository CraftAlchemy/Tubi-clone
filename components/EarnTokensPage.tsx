import React from 'react';
import type { Advertisement } from '../types';

interface EarnTokensPageProps {
    advertisements: Advertisement[];
    onPlayAd: (ad: Advertisement) => void;
}

const EarnTokensPage: React.FC<EarnTokensPageProps> = ({ advertisements, onPlayAd }) => {
    return (
        <div className="pt-24 pb-12">
            <div className="max-w-4xl mx-auto px-4">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
                        Earn Tokens
                    </h1>
                    <p className="text-lg text-myflix-light-gray max-w-2xl mx-auto">
                        Watch short advertisements from our partners to earn tokens. Use tokens to unlock and watch premium movies.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {advertisements.map((ad) => (
                        <div key={ad.id} className="bg-myflix-gray rounded-lg shadow-lg p-6 flex flex-col md:flex-row items-center gap-6">
                           <div className="flex-shrink-0 text-yellow-400">
                                <AdIcon />
                           </div>
                           <div className="flex-1 text-center md:text-left">
                                <h2 className="text-xl font-bold text-white">{ad.title}</h2>
                                <p className="text-sm text-myflix-light-gray mt-1">Duration: {ad.duration} seconds</p>
                           </div>
                           <button 
                                onClick={() => onPlayAd(ad)}
                                className="w-full md:w-auto bg-yellow-500 text-black font-bold px-6 py-2.5 rounded-full hover:bg-yellow-400 transition-colors flex-shrink-0 flex items-center justify-center gap-2">
                                <PlayIcon />
                                <span>Watch to Earn {ad.tokenReward} {ad.tokenReward > 1 ? 'Tokens' : 'Token'}</span>
                           </button>
                        </div>
                    ))}
                    {advertisements.length === 0 && (
                        <p className="text-center text-myflix-light-gray md:col-span-2">There are no advertisements available to watch at the moment. Please check back later!</p>
                    )}
                </div>
            </div>
        </div>
    );
};

const AdIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" viewBox="0 0 20 20" fill="currentColor">
        <path d="M10 2a6 6 0 00-6 6v3.586l-1.707 1.707A1 1 0 003 15v4a1 1 0 001 1h12a1 1 0 001-1v-4a1 1 0 00-.293-.707L16 11.586V8a6 6 0 00-6-6zM8 8a2 2 0 114 0v3a2 2 0 11-4 0V8z" />
    </svg>
);

const PlayIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
    </svg>
);


export default EarnTokensPage;
