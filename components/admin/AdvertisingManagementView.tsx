

// FIX: Import global type definitions to resolve errors related to missing JSX intrinsic elements like 'div' and 'h1'.
import '../../types';
import React from 'react';
import InStreamAdManagementTable from './InStreamAdManagementTable';
import BannerAdManagementTable from './BannerAdManagementTable';
import type { InStreamAd, BannerAd } from '../../types';

interface AdvertisingManagementViewProps {
    inStreamAds: InStreamAd[];
    bannerAds: BannerAd[];
    onInStreamAdsUpdate: (ads: InStreamAd[]) => void;
    onBannerAdsUpdate: (ads: BannerAd[]) => void;
}

const AdvertisingManagementView: React.FC<AdvertisingManagementViewProps> = (props) => {
    return (
        <div>
            <h1 className="text-3xl font-bold text-white mb-6">Advertising Management</h1>
            <div className="space-y-8">
                <div>
                    <h2 className="text-xl font-semibold mb-4">In-Stream Video Ads</h2>
                    <InStreamAdManagementTable ads={props.inStreamAds} onUpdate={props.onInStreamAdsUpdate} />
                </div>
                 <div>
                    <h2 className="text-xl font-semibold mb-4">Banner Ads</h2>
                    <BannerAdManagementTable ads={props.bannerAds} onUpdate={props.onBannerAdsUpdate} />
                </div>
            </div>
        </div>
    );
};

export default AdvertisingManagementView;