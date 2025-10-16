import React, { useState } from 'react';
import Sidebar from './Sidebar';
import StatCard from './StatCard';
import ContentTable from './ContentTable';
import SeriesContentTable from './SeriesContentTable';
import UserManagementTable from './UserManagementTable';
import LiveTVManagementTable from './LiveTVManagementTable';
import type { Category, SeriesCategory, User, LiveTVChannel } from '../../types';

interface AdminDashboardProps {
    users: User[];
    onUsersUpdate: (users: User[]) => void;
    categories: Category[];
    onContentUpdate: (categories: Category[]) => void;
    seriesCategories: SeriesCategory[];
    onSeriesContentUpdate: (seriesCategories: SeriesCategory[]) => void;
    liveTVChannels: LiveTVChannel[];
    onLiveTVChannelsUpdate: (channels: LiveTVChannel[]) => void;
}

type AdminView = 'dashboard' | 'content' | 'users';

const AdminDashboard: React.FC<AdminDashboardProps> = ({ users, onUsersUpdate, categories, onContentUpdate, seriesCategories, onSeriesContentUpdate, liveTVChannels, onLiveTVChannelsUpdate }) => {
    const [view, setView] = useState<AdminView>('dashboard');
    const [activeContentTab, setActiveContentTab] = useState<'movies' | 'series' | 'livetv'>('movies');
    
    const totalMovies = categories.reduce((sum, cat) => sum + cat.movies.length, 0);
    const totalSeries = seriesCategories.reduce((sum, cat) => sum + cat.series.length, 0);
    const totalChannels = liveTVChannels.length;
    const totalUsers = users.length;

    const renderView = () => {
        switch(view) {
            case 'dashboard':
                return (
                     <>
                        <h1 className="text-3xl font-bold text-white mb-8">Dashboard</h1>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                            <StatCard title="Total Movies" value={totalMovies.toString()} iconName="film-outline" />
                            <StatCard title="Total Series" value={totalSeries.toString()} iconName="tv-outline" />
                            <StatCard title="Total Channels" value={totalChannels.toString()} iconName="radio-outline" />
                            <StatCard title="Total Users" value={totalUsers.toString()} iconName="people-outline" />
                        </div>
                        <div className="bg-admin-sidebar p-6 rounded-lg shadow-lg">
                            <h2 className="text-2xl font-bold text-white mb-4">Welcome, Admin!</h2>
                            <p className="text-gray-400">Select an option from the sidebar to manage your content or users.</p>
                        </div>
                    </>
                );
            case 'content':
                return (
                    <div className="bg-admin-sidebar p-6 rounded-lg shadow-lg">
                         <h2 className="text-2xl font-bold text-white mb-6">Content Management</h2>
                         
                         <div className="border-b border-gray-700 mb-6">
                            <nav className="flex space-x-4" aria-label="Tabs">
                                <button
                                    onClick={() => setActiveContentTab('movies')}
                                    className={`px-3 py-2 font-medium text-sm rounded-t-md ${activeContentTab === 'movies' ? 'bg-admin-card text-white' : 'text-gray-400 hover:text-white'}`}
                                >
                                    Movies
                                </button>
                                 <button
                                    onClick={() => setActiveContentTab('series')}
                                    className={`px-3 py-2 font-medium text-sm rounded-t-md ${activeContentTab === 'series' ? 'bg-admin-card text-white' : 'text-gray-400 hover:text-white'}`}
                                >
                                    Series
                                </button>
                                <button
                                    onClick={() => setActiveContentTab('livetv')}
                                    className={`px-3 py-2 font-medium text-sm rounded-t-md ${activeContentTab === 'livetv' ? 'bg-admin-card text-white' : 'text-gray-400 hover:text-white'}`}
                                >
                                    Live TV
                                </button>
                            </nav>
                         </div>
                        
                        {activeContentTab === 'movies' && <ContentTable categories={categories} onContentUpdate={onContentUpdate} />}
                        {activeContentTab === 'series' && <SeriesContentTable seriesCategories={seriesCategories} onContentUpdate={onSeriesContentUpdate} />}
                        {activeContentTab === 'livetv' && <LiveTVManagementTable channels={liveTVChannels} onUpdate={onLiveTVChannelsUpdate} />}
                    </div>
                );
            case 'users':
                return (
                     <div className="bg-admin-sidebar p-6 rounded-lg shadow-lg">
                        <h2 className="text-2xl font-bold text-white mb-6">User Management</h2>
                        <UserManagementTable users={users} onUpdate={onUsersUpdate} />
                     </div>
                );
        }
    }

    return (
        <div className="flex min-h-screen bg-admin-bg text-gray-200 font-sans">
            <Sidebar view={view} setView={setView} />
            <main className="flex-1 p-6 md:p-10">
                {renderView()}
            </main>
        </div>
    );
};

export default AdminDashboard;
