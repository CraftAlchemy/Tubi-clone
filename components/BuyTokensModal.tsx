


// FIX: Import global type definitions to resolve errors related to missing JSX intrinsic elements like 'div', 'h2', and 'button'.
import '../types';
import React, { useState } from 'react';
import type { TokenPack } from '../types';

interface BuyTokensModalProps {
    onClose: () => void;
    onPurchase: (pack: TokenPack) => void;
    tokenPacks: TokenPack[];
}

const BuyTokensModal: React.FC<BuyTokensModalProps> = ({ onClose, onPurchase, tokenPacks }) => {
    const [selectedPackId, setSelectedPackId] = useState<number | null>(tokenPacks.find(p => p.isBestValue)?.id || null);

    const handlePurchase = () => {
        const pack = tokenPacks.find(p => p.id === selectedPackId);
        if (pack) {
            onPurchase(pack);
        }
    };

    return (
        <div 
            className="fixed inset-0 z-[110] bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={onClose}
        >
            <div 
                className="bg-myflix-gray rounded-lg shadow-lg w-full max-w-md p-6 relative"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-2xl font-bold text-white text-center mb-6">Buy Tokens</h2>
                
                <div className="space-y-3">
                    {tokenPacks.map(pack => (
                        <div
                            key={pack.id}
                            onClick={() => setSelectedPackId(pack.id)}
                            className={`p-4 border-2 rounded-lg cursor-pointer transition-all relative ${selectedPackId === pack.id ? 'border-myflix-red bg-myflix-red/10' : 'border-gray-600 hover:border-gray-500'}`}
                        >
                            {pack.isBestValue && (
                                <div className="absolute -top-3 right-4 bg-yellow-400 text-black text-xs font-bold px-2 py-0.5 rounded-full">
                                    BEST VALUE
                                </div>
                            )}
                            <div className="flex justify-between items-center">
                                <span className="text-xl font-bold text-white">{pack.amount} Tokens</span>
                                <span className="text-xl font-bold text-green-400">${pack.price.toFixed(2)}</span>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-6">
                    <button
                        onClick={handlePurchase}
                        disabled={!selectedPackId}
                        className="w-full bg-myflix-red text-white font-bold py-3 rounded-full hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Purchase
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

export default BuyTokensModal;