

import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import StatCard from './StatCard';
import ContentTable from './ContentTable';
import SeriesContentTable from './SeriesContentTable';
import CartoonContentTable from './CartoonContentTable';
import UserManagementTable from './UserManagementTable';
import LiveTVManagementTable from './LiveTVManagementTable';
import AdvertisementManagementTable from './AdvertisementManagementTable';
import SettingsPage from './SettingsPage';

// FIX: Import types to load global JSX augmentations for ion-icon.
import '../../types';
import type { User, Category, SeriesCategory, LiveTVChannel, Advertisement, TokenPack } from '../../types';

interface AdminDashboardProps {
    currentUser: User;
    siteName: string;
    users: User[];
    categories: Category[];
    seriesCategories: SeriesCategory[];
    cartoonCategories: Category[];
    liveTVChannels: LiveTVChannel[];
    advertisements: Advertisement[];
    tokenPacks: TokenPack[];
    isCartoonSectionEnabled: boolean;
    onUpdate: (updatedData: {
        users?: User[],
        categories?: Category[],
        seriesCategories?: SeriesCategory[],
        cartoonCategories?: Category[],
        liveTVChannels?: LiveTVChannel[],
        advertisements?: Advertisement[],
        tokenPacks?: TokenPack[],
        siteName?: string,
        isCartoonSectionEnabled?: boolean,
    }) => void;
}

type AdminView = 'dashboard' | 'content' | 'users' | 'monetization' | 'settings';
type ContentSubView = 'movies' | 'series' | 'cartoons' | 'livetv';
type MonetizationSubView = 'ads' | 'packs';

const AdminDashboard: React.FC<AdminDashboardProps> = (props) => {
    const [view, setView] = useState<AdminView>('dashboard');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    
    useEffect(() => {
        // Optional: Add logic to handle resizing, e.g., auto-close sidebar on larger screens if it was opened on mobile
    }, []);

    const totalMovies = props.categories.reduce((acc, cat) => acc + cat.movies.length, 0);
    const totalSeries = props.seriesCategories.reduce((acc, cat) => acc + cat.series.length, 0);
    const totalContent = totalMovies + totalSeries;

    const renderView = () => {
        switch (view) {
            case 'dashboard':
                return <DashboardView totalUsers={props.users.length} totalContent={totalContent} totalChannels={props.liveTVChannels.length} />;
            case 'content':
                return <ContentManagementView {...props} />;
            case 'users':
                return (
                    <div className="p-4 sm:p-6 md:p-8">
                        <h1 className="text-2xl md:text-3xl font-bold text-white mb-6">User Management</h1>
                        <UserManagementTable users={props.users} onUpdate={(updatedUsers) => props.onUpdate({ users: updatedUsers })} />
                    </div>
                );
            case 'monetization':
                 return <MonetizationManagementView {...props} />;
            case 'settings':
                return (
                    <SettingsPage 
                        initialSiteName={props.siteName}
                        onSave={async (newName) => props.onUpdate({ siteName: newName })}
                        isCartoonSectionEnabled={props.isCartoonSectionEnabled}
                        onCartoonSectionToggle={(enabled) => props.onUpdate({ isCartoonSectionEnabled: enabled })}
                        tokenPacks={props.tokenPacks}
                        onTokenPacksUpdate={(packs) => props.onUpdate({ tokenPacks: packs })}
                    />
                );
            default:
                return <div>Select a view</div>;
        }
    };

    return (
        <div className="bg-admin-bg min-h-screen text-gray-300 flex">
            <Sidebar view={view} setView={setView} isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} siteName={props.siteName} />
            <div className="flex-1 lg:pl-64">
                 <header className="lg:hidden h-16 bg-admin-sidebar flex items-center px-4 shadow-md">
                     <button onClick={() => setIsSidebarOpen(true)} className="text-gray-300 hover:text-white" aria-label="Open sidebar">
                         <ion-icon name="menu-outline" style={{ fontSize: '28px' }}></ion-icon>
                     </button>
                     <h1 className="text-lg font-bold text-white ml-4">{view.charAt(0).toUpperCase() + view.slice(1)}</h1>
                 </header>
                 <main className="transition-all duration-300">
                     {renderView()}
                 </main>
            </div>
        </div>
    );
};

// --- Sub-Views for Organization ---

const DashboardView: React.FC<{ totalUsers: number, totalContent: number, totalChannels: number }> = ({ totalUsers, totalContent, totalChannels }) => (
    <div className="p-4 sm:p-6 md:p-8">
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-6">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <StatCard title="Total Users" value={totalUsers.toString()} iconName="people-circle-outline" />
            <StatCard title="Total Content Items" value={totalContent.toString()} iconName="film-outline" />
            <StatCard title="Live TV Channels" value={totalChannels.toString()} iconName="tv-outline" />
        </div>
    </div>
);

const ContentManagementView: React.FC<AdminDashboardProps> = (props) => {
    const [subView, setSubView] = useState<ContentSubView>('movies');
    
    const navItems: { id: ContentSubView, label: string }[] = [
        { id: 'movies', label: 'Movies' },
        { id: 'series', label: 'Series' },
        { id: 'cartoons', label: 'Cartoons' },
        { id: 'livetv', label: 'Live TV' },
    ];

    return (
         <div className="p-4 sm:p-6 md:p-8">
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-6">Content Management</h1>
            <div className="flex border-b border-gray-700 mb-6">
                {navItems.map(item => (
                    <button 
                        key={item.id} 
                        onClick={() => setSubView(item.id)}
                        className={`px-4 py-2 font-semibold transition-colors ${subView === item.id ? 'text-admin-accent border-b-2 border-admin-accent' : 'text-gray-400 hover:text-white'}`}
                    >
                        {item.label}
                    </button>
                ))}
            </div>
            {subView === 'movies' && <ContentTable categories={props.categories} onContentUpdate={(updated) => props.onUpdate({ categories: updated })} />}
            {subView === 'series' && <SeriesContentTable seriesCategories={props.seriesCategories} onContentUpdate={(updated) => props.onUpdate({ seriesCategories: updated })} />}
            {subView === 'cartoons' && <CartoonContentTable categories={props.cartoonCategories} onContentUpdate={(updated) => props.onUpdate({ cartoonCategories: updated })} />}
            {subView === 'livetv' && <LiveTVManagementTable channels={props.liveTVChannels} onUpdate={(updated) => props.onUpdate({ liveTVChannels: updated })} />}
        </div>
    );
};

const MonetizationManagementView: React.FC<AdminDashboardProps> = (props) => {
    return (
        <div className="p-4 sm:p-6 md:p-8">
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-6">Monetization</h1>
            <AdvertisementManagementTable advertisements={props.advertisements} onUpdate={(updated) => props.onUpdate({ advertisements: updated })} />
        </div>
    );
};


export default AdminDashboard;