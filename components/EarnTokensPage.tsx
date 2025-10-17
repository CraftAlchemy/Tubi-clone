


// FIX: Import global type definitions to resolve errors related to missing JSX intrinsic elements like 'div', 'h1', and 'p'.
import '../types';
import React from 'react';
import type { User, Advertisement } from '../types';

interface EarnTokensPageProps {
    user: User | null;
    onTokensEarned: (amount: number) => void;
    advertisements: Advertisement[];
    onPlayAd: (ad: Advertisement) => void;
    onBuyTokensClick: () => void;
}

const EarnTokensPage: React.FC<EarnTokensPageProps> = ({ user, onTokensEarned, advertisements, onPlayAd, onBuyTokensClick }) => {
    
    if (!user) {
        return (
             <div className="min-h-screen flex items-center justify-center pt-20 text-center px-4">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-4">Please Sign In</h1>
                    <p className="text-gray-300">You need to be signed in to earn tokens.</p>
                    <a href="#/login" className="mt-6 inline-block bg-myflix-red text-white font-bold px-6 py-3 rounded-full hover:opacity-80 transition-opacity">
                        Go to Sign In
                    </a>
                </div>
            </div>
        );
    }
    
    return (
        <>
            <div className="min-h-screen pt-24 pb-12">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="text-center mb-12">
                         <h1 className="text-4xl md:text-5xl font-extrabold text-white">
                            Earn Tokens
                        </h1>
                        <p className="text-lg text-gray-300 mt-2">
                            Watch short ads to earn tokens and unlock premium content.
                        </p>
                        <p className="text-2xl font-bold text-yellow-400 mt-4">
                            Your Balance: {user.tokens} Tokens
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {advertisements.map(ad => (
                            <div key={ad.id} className="bg-myflix-gray p-5 rounded-lg flex flex-col sm:flex-row items-center gap-5">
                                <div className="flex-1">
                                    <h2 className="text-xl font-bold text-white">{ad.title}</h2>
                                    <p className="text-sm text-gray-400 mt-1">Watch a {ad.duration}s ad to earn {ad.tokenReward} token{ad.tokenReward > 1 ? 's' : ''}.</p>
                                </div>
                                <button
                                    onClick={() => onPlayAd(ad)}
                                    className="bg-green-600 text-white font-bold py-2 px-5 rounded-full hover:bg-green-500 transition-colors w-full sm:w-auto flex-shrink-0"
                                >
                                    Watch & Earn
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className="mt-12 text-center">
                        <p className="text-gray-400">Want more tokens now?</p>
                         <button onClick={onBuyTokensClick} className="font-bold text-myflix-red hover:underline">
                            Buy a token pack.
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default EarnTokensPage;