
import React from 'react';

interface TokenPromptModalProps {
    content: {
        title: string;
        tokenCost: number;
    };
    onClose: () => void;
    onEarnTokens: () => void;
    onBuyTokens: () => void;
}

const TokenPromptModal: React.FC<TokenPromptModalProps> = ({ content, onClose, onEarnTokens, onBuyTokens }) => {
    return (
        <div 
            className="fixed inset-0 z-[110] bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={onClose}
        >
            <div 
                className="bg-myflix-gray rounded-lg shadow-lg w-full max-w-md p-6 relative text-center"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-2xl font-bold text-white mb-2">Not Enough Tokens</h2>
                <p className="text-gray-300 mb-6">
                    You need <span className="font-bold text-yellow-400">{content.tokenCost}</span> tokens to watch "{content.title}", but you don't have enough.
                </p>
                
                <div className="space-y-4">
                     <button
                        onClick={onEarnTokens}
                        className="w-full bg-green-600 text-white font-bold py-3 rounded-full hover:bg-green-500 transition-colors"
                    >
                        Watch Ads to Earn
                    </button>
                    <button
                        onClick={onBuyTokens}
                        className="w-full bg-blue-600 text-white font-bold py-3 rounded-full hover:bg-blue-500 transition-colors"
                    >
                        Buy Token Pack
                    </button>
                </div>

                 <button 
                    onClick={onClose}
                    className="absolute -top-2 -right-2 text-white bg-myflix-black rounded-full h-8 w-8 flex items-center justify-center hover:bg-myflix-red transition-colors z-20"
                    aria-label="Close"
                >
                    &times;
                </button>
            </div>
        </div>
    );
};

export default TokenPromptModal;