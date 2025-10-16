


import React, { useState } from 'react';
import Sidebar from './Sidebar';
import StatCard from './StatCard';
import ContentTable from './ContentTable';
import UserManagementTable from './UserManagementTable';
import SeriesContentTable from './SeriesContentTable';
import LiveTVManagementTable from './LiveTVManagementTable';
import AdvertisementManagementTable from './AdvertisementManagementTable';
import SettingsPage from './SettingsPage';
import ErrorBoundary from '../ErrorBoundary';
// FIX: Add side-effect import for ion-icon types
import '../../types';
import type { User, Category, SeriesCategory, LiveTVChannel, Advertisement, TokenPack } from '../../types';


type AdminView = 'dashboard' | 'content' | 'users' | 'monetization' | 'settings';

interface AdminDashboardProps {
    siteName: string;
    categories: Category[];
    onContentUpdate: (categories: Category[]) => void;
    onSiteNameUpdate: (newName: string) => Promise<void>;
    users: User[];
    onUsersUpdate: (users: User[]) => void;
    seriesCategories: SeriesCategory[];
    onSeriesCategoriesUpdate: (categories: SeriesCategory[]) => void;
    liveTVChannels: LiveTVChannel[];
    onLiveTVChannelsUpdate: (channels: LiveTVChannel[]) => void;
    advertisements: Advertisement[];
    onAdvertisementsUpdate: (ads: Advertisement[]) => void;
    tokenPacks: TokenPack[];
    onTokenPacksUpdate: (packs: TokenPack[]) => void;
    isCartoonSectionEnabled: boolean;
    onCartoonSectionToggle: (enabled: boolean) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
    siteName, 
    categories, 
    onContentUpdate, 
    onSiteNameUpdate,
    users,
    onUsersUpdate,
    seriesCategories,
    onSeriesCategoriesUpdate,
    liveTVChannels,
    onLiveTVChannelsUpdate,
    advertisements,
    onAdvertisementsUpdate,
    tokenPacks,
    onTokenPacksUpdate,
    isCartoonSectionEnabled,
    onCartoonSectionToggle
}) => {
    const [view, setView] = useState<AdminView>('dashboard');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    
    const totalMovies = categories.reduce((sum, cat) => sum + cat.movies.length, 0);
    const totalSeries = seriesCategories.reduce((sum, cat) => sum + cat.series.length, 0);

    const renderContent = () => {
        switch(view) {
            case 'dashboard':
                return (
                    <div className="p-4 sm:p-6 md:p-8">
                        <h1 className="text-2xl md:text-3xl font-bold text-white mb-6">Dashboard</h1>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            <StatCard title="Total Users" value={users.length.toString()} iconName="people-outline" />
                            <StatCard title="Movies" value={totalMovies.toString()} iconName="film-outline" />
                            <StatCard title="TV Series" value={totalSeries.toString()} iconName="tv-outline" />
                            <StatCard title="Live Channels" value={liveTVChannels.length.toString()} iconName="radio-outline" />
                        </div>
                    </div>
                );
            case 'content':
                 return (
                    <div className="p-4 sm:p-6 md:p-8 space-y-8">
                         <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-white mb-6">Content Management: Movies</h1>
                            <ErrorBoundary fallback={<p className="text-red-400">Error loading movie content table.</p>}>
                                <ContentTable categories={categories} onContentUpdate={onContentUpdate} />
                            </ErrorBoundary>
                        </div>
                        <div>
                             <h1 className="text-2xl md:text-3xl font-bold text-white mb-6">Content Management: Series</h1>
                             <ErrorBoundary fallback={<p className="text-red-400">Error loading series content table.</p>}>
                                <SeriesContentTable seriesCategories={seriesCategories} onContentUpdate={onSeriesCategoriesUpdate} />
                             </ErrorBoundary>
                        </div>
                    </div>
                );
            case 'users':
                 return (
                    <div className="p-4 sm:p-6 md:p-8">
                        <h1 className="text-2xl md:text-3xl font-bold text-white mb-6">User Management</h1>
                        <ErrorBoundary fallback={<p className="text-red-400">Error loading user management table.</p>}>
                            <UserManagementTable users={users} onUpdate={onUsersUpdate} />
                        </ErrorBoundary>
                    </div>
                );
            case 'monetization':
                 return (
                    <div className="p-4 sm:p-6 md:p-8 space-y-8">
                         <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-white mb-6">Monetization: Advertisements</h1>
                            <ErrorBoundary fallback={<p className="text-red-400">Error loading advertisement management table.</p>}>
                                <AdvertisementManagementTable advertisements={advertisements} onUpdate={onAdvertisementsUpdate} />
                            </ErrorBoundary>
                        </div>
                        <div>
                             <h1 className="text-2xl md:text-3xl font-bold text-white mb-6">Monetization: Live TV</h1>
                             <ErrorBoundary fallback={<p className="text-red-400">Error loading Live TV management table.</p>}>
                                <LiveTVManagementTable channels={liveTVChannels} onUpdate={onLiveTVChannelsUpdate} />
                            </ErrorBoundary>
                        </div>
                    </div>
                );
             case 'settings':
                return (
                    <ErrorBoundary fallback={<p className="text-red-400">Error loading settings page.</p>}>
                        <SettingsPage 
                            initialSiteName={siteName} 
                            onSave={onSiteNameUpdate} 
                            isCartoonSectionEnabled={isCartoonSectionEnabled}
                            onCartoonSectionToggle={onCartoonSectionToggle}
                            tokenPacks={tokenPacks}
                            onTokenPacksUpdate={onTokenPacksUpdate}
                        />
                    </ErrorBoundary>
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-admin-bg text-white flex">
            <Sidebar view={view} setView={setView} isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} siteName={siteName} />
            <main className="flex-1 lg:ml-64 transition-all duration-300 ease-in-out">
                <div className="lg:hidden p-4 flex justify-between items-center bg-admin-sidebar">
                     <h2 className="text-lg font-bold">{siteName} Admin</h2>
                    <button onClick={() => setIsSidebarOpen(true)} aria-label="Open sidebar">
                       <ion-icon name="menu-outline" style={{ fontSize: '28px' }}></ion-icon>
                    </button>
                </div>
                 {renderContent()}
            </main>
        </div>
    );
};

export default AdminDashboard;