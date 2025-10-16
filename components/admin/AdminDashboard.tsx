import React, { useState } from 'react';
import Sidebar from './Sidebar';
import StatCard from './StatCard';
import ContentTable from './ContentTable';
import SeriesContentTable from './SeriesContentTable';
import type { Category, SeriesCategory } from '../../types';

interface AdminDashboardProps {
    categories: Category[];
    onContentUpdate: (categories: Category[]) => void;
    seriesCategories: SeriesCategory[];
    onSeriesContentUpdate: (seriesCategories: SeriesCategory[]) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ categories, onContentUpdate, seriesCategories, onSeriesContentUpdate }) => {
    const [activeTab, setActiveTab] = useState<'movies' | 'series'>('movies');
    
    const totalMovies = categories.reduce((sum, cat) => sum + cat.movies.length, 0);
    const totalSeries = seriesCategories.reduce((sum, cat) => sum + cat.series.length, 0);

    return (
        <div className="flex min-h-screen bg-admin-bg text-gray-200 font-sans">
            <Sidebar />
            <main className="flex-1 p-6 md:p-10">
                <h1 className="text-3xl font-bold text-white mb-8">Dashboard</h1>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    <StatCard title="Total Movies" value={totalMovies.toString()} iconName="film-outline" />
                    <StatCard title="Total Series" value={totalSeries.toString()} iconName="tv-outline" />
                    <StatCard title="Users Online" value="78" iconName="people-outline" />
                    <StatCard title="Revenue (Month)" value="$12,450" iconName="cash-outline" />
                </div>

                <div className="bg-admin-sidebar p-6 rounded-lg shadow-lg">
                     <h2 className="text-2xl font-bold text-white mb-6">Content Management</h2>
                     
                     <div className="border-b border-gray-700 mb-6">
                        <nav className="flex space-x-4" aria-label="Tabs">
                            <button
                                onClick={() => setActiveTab('movies')}
                                className={`px-3 py-2 font-medium text-sm rounded-t-md ${activeTab === 'movies' ? 'bg-admin-card text-white' : 'text-gray-400 hover:text-white'}`}
                            >
                                Movies
                            </button>
                             <button
                                onClick={() => setActiveTab('series')}
                                className={`px-3 py-2 font-medium text-sm rounded-t-md ${activeTab === 'series' ? 'bg-admin-card text-white' : 'text-gray-400 hover:text-white'}`}
                            >
                                Series
                            </button>
                        </nav>
                     </div>

                     {activeTab === 'movies' ? (
                        <ContentTable categories={categories} onContentUpdate={onContentUpdate} />
                     ) : (
                        <SeriesContentTable seriesCategories={seriesCategories} onContentUpdate={onSeriesContentUpdate} />
                     )}
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
