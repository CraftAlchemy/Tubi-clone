
import React from 'react';
import type { BannerAd } from '../types';

interface BannerAdComponentProps {
    ad: BannerAd;
}

const BannerAdComponent: React.FC<BannerAdComponentProps> = ({ ad }) => {
    return (
        <div className="my-4 text-center">
            <a href={ad.linkUrl} target="_blank" rel="noopener noreferrer">
                <img src={ad.imageUrl} alt="Advertisement" className="inline-block" />
            </a>
        </div>
    );
};

export default BannerAdComponent;
