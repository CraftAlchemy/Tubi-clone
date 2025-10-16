
import React from 'react';
import type { Movie } from '../types';

interface TokenPromptModalProps {
    movie: Movie;
    onClose: () => void;
    onEarnTokens: () => void;
    onBuyTokens: () => void;
}

const TokenPromptModal: React.FC<TokenPromptModalProps> = ({ movie, onClose, onEarnTokens, onBuyTokens }) => {
    return (
         <div 
            className="fixed inset-0 z-[110] bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={onClose}
        >
            <div 
                className="bg-myflix-gray rounded-lg shadow-lg w-full max-w-md p-8 text-center"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-2xl font-bold text-white mb-2">Not Enough Tokens</h2>
                <p className="text-gray-300 mb-6">
                    You need <span className="font-bold text-yellow-400">{movie.tokenCost}</span> token{movie.tokenCost && movie.tokenCost > 1 ? 's' : ''} to watch "{movie.title}".
                </p>

                <div className="space-y-4">
                     <button
                        onClick={onEarnTokens}
                        className="w-full bg-green-600 text-white font-bold py-3 rounded-full hover:bg-green-500 transition-colors"
                    >
                        Earn Tokens for Free
                    </button>
                    <button
                        onClick={onBuyTokens}
                        className="w-full bg-blue-600 text-white font-bold py-3 rounded-full hover:bg-blue-500 transition-colors"
                    >
                        Buy More Tokens
                    </button>
                    <button
                        onClick={onClose}
                        className="w-full bg-gray-600 text-white font-bold py-3 rounded-full hover:bg-gray-500 transition-colors mt-2"
                    >
                        Maybe Later
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TokenPromptModal;
