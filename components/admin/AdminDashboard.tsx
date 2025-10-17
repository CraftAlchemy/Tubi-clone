

// FIX: Import global type definitions to resolve errors related to missing JSX intrinsic elements like 'div' and 'h1'.
import '../../types';
import React, { useState } from 'react';
import Sidebar from './Sidebar';
import StatCard from './StatCard';
import ContentTable from './ContentTable';
import SeriesContentTable from './SeriesContentTable';
import CartoonContentTable from './CartoonContentTable';
import { UserManagementTable } from './UserManagementTable';
import LiveTVManagementTable from './LiveTVManagementTable';
import AdvertisementManagementTable from './AdvertisementManagementTable';
import SettingsPage from './SettingsPage';
import type { User, Category, SeriesCategory, LiveTVChannel, Advertisement, TokenPack } from '../../types';

interface AdminDashboardProps {
    users: User[];
    onUsersUpdate: (users: User[]) => void;
    movieCategories: Category[];
    onMovieCategoriesUpdate: (categories: Category[]) => void;
    seriesCategories: SeriesCategory[];
    onSeriesCategoriesUpdate: (categories: SeriesCategory[]) => void;
    cartoonCategories: Category[];
    onCartoonCategoriesUpdate: (categories: Category[]) => void;
    liveTVChannels: LiveTVChannel[];
    onLiveTVChannelsUpdate: (channels: LiveTVChannel[]) => void;
    advertisements: Advertisement[];
    onAdvertisementsUpdate: (ads: Advertisement[]) => void;
    tokenPacks: TokenPack[];
    onTokenPacksUpdate: (packs: TokenPack[]) => void;
    siteName: string;
    onSiteNameUpdate: (name: string) => void;
    isCartoonSectionEnabled: boolean;
    onCartoonSectionToggle: (enabled: boolean) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = (props) => {
    const [activeView, setActiveView] = useState('dashboard');
    
    const totalMovies = props.movieCategories.reduce((sum, cat) => sum + cat.movies.length, 0);

    const renderView = () => {
        switch (activeView) {
            case 'users':
                return <UserManagementTable users={props.users} onUpdate={props.onUsersUpdate} />;
            case 'content-movies':
                return <ContentTable categories={props.movieCategories} onContentUpdate={props.onMovieCategoriesUpdate} />;
            case 'content-series':
                return <SeriesContentTable seriesCategories={props.seriesCategories} onContentUpdate={props.onSeriesCategoriesUpdate} />;
            case 'content-cartoons':
                 return <CartoonContentTable categories={props.cartoonCategories} onContentUpdate={props.onCartoonCategoriesUpdate} />;
            case 'livetv':
                return <LiveTVManagementTable channels={props.liveTVChannels} onUpdate={props.onLiveTVChannelsUpdate} />;
            case 'advertising':
                return <AdvertisementManagementTable advertisements={props.advertisements} onUpdate={props.onAdvertisementsUpdate} />;
            case 'settings':
                return <SettingsPage 
                    initialSiteName={props.siteName}
                    onSave={async (name) => props.onSiteNameUpdate(name)}
                    isCartoonSectionEnabled={props.isCartoonSectionEnabled}
                    onCartoonSectionToggle={props.onCartoonSectionToggle}
                    tokenPacks={props.tokenPacks}
                    onTokenPacksUpdate={props.onTokenPacksUpdate}
                />;
            case 'dashboard':
            default:
                return (
                    <div>
                         <h1 className="text-3xl font-bold text-white mb-6">Dashboard Overview</h1>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <StatCard title="Total Users" value={props.users.length.toString()} iconName="people-outline" />
                            <StatCard title="Total Movies" value={totalMovies.toString()} iconName="film-outline" />
                            <StatCard title="Total Series" value={props.seriesCategories.reduce((sum, cat) => sum + cat.series.length, 0).toString()} iconName="tv-outline" />
                            <StatCard title="Live Channels" value={props.liveTVChannels.length.toString()} iconName="radio-outline" />
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className="min-h-screen flex bg-admin-main text-gray-200">
            <Sidebar activeView={activeView} setActiveView={setActiveView} />
            <div className="flex-1 p-6 md:p-10 overflow-y-auto">
                {renderView()}
            </div>
        </div>
    );
};

export default AdminDashboard;