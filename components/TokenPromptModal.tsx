import React, { useEffect, useState } from 'react';

interface TokenPromptModalProps {
    onClose: () => void;
}

const TokenPromptModal: React.FC<TokenPromptModalProps> = ({ onClose }) => {
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        const timer = setTimeout(() => setIsLoaded(true), 50);
        return () => {
            document.body.style.overflow = 'auto';
            clearTimeout(timer);
        };
    }, []);

    return (
        <div 
            className="fixed inset-0 z-[110] bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center p-4 transition-opacity duration-300"
            onClick={onClose}
        >
            <div 
                className={`bg-myflix-gray p-8 rounded-lg shadow-2xl w-full max-w-md text-center transition-all duration-300 ${isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="text-yellow-400 mx-auto mb-4">
                    <TokenIcon />
                </div>
                <h2 className="text-2xl font-bold text-white mb-3">Insufficient Tokens</h2>
                <p className="text-myflix-light-gray mb-6">
                    You don't have enough tokens to watch this movie. Watch a short ad to earn more tokens.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button onClick={onClose} className="w-full sm:w-auto border border-gray-600 text-white font-bold px-6 py-2.5 rounded-full hover:bg-gray-700 transition-colors">
                        Maybe Later
                    </button>
                    <a href="#/earn-tokens" onClick={onClose} className="w-full sm:w-auto bg-yellow-500 text-black font-bold px-6 py-2.5 rounded-full hover:bg-yellow-400 transition-colors">
                        Earn Tokens Now
                    </a>
                </div>
            </div>
        </div>
    );
};

const TokenIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-14 w-14 mx-auto" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.414-1.414L11 10.586V6z" clipRule="evenodd" />
        <path d="M10 2a1 1 0 00-1 1v1a1 1 0 102 0V3a1 1 0 00-1-1zM4.22 5.64a1 1 0 00-1.42-1.42l-.71.71a1 1 0 001.42 1.42l.7-.71zM16.9 15.46a1 1 0 00-1.42 1.42l.71.71a1 1 0 001.42-1.42l-.7-.71zM17.62 4.22a1 1 0 00-1.42-1.42l-.7.71a1 1 0 101.42 1.42l.7-.71zM4.93 16.9a1 1 0 00-1.42 1.42l.7.7a1 1 0 001.42-1.42l-.7-.7zM18 10a1 1 0 00-1-1h-1a1 1 0 100 2h1a1 1 0 001-1zM3 10a1 1 0 00-1-1H1a1 1 0 100 2h1a1 1 0 001-1z" />
    </svg>
);


export default TokenPromptModal;
