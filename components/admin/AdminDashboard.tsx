import React from 'react';
import Sidebar from './Sidebar';
import StatCard from './StatCard';
import ContentTable from './ContentTable';
import type { Category } from '../../types';

interface AdminDashboardProps {
    categories: Category[];
    onContentUpdate: (categories: Category[]) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ categories, onContentUpdate }) => {
    const totalMovies = categories.reduce((sum, cat) => sum + cat.movies.length, 0);
    const totalCategories = categories.length;

    return (
        <div className="flex min-h-screen bg-admin-bg text-gray-200 font-sans">
            <Sidebar />
            <main className="flex-1 p-6 md:p-10">
                <h1 className="text-3xl font-bold text-white mb-8">Dashboard</h1>
                
                {/* Stats Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    <StatCard title="Total Movies" value={totalMovies.toString()} iconName="film-outline" />
                    <StatCard title="Total Categories" value={totalCategories.toString()} iconName="grid-outline" />
                    <StatCard title="Users Online" value="78" iconName="people-outline" />
                    <StatCard title="Revenue (Month)" value="$12,450" iconName="cash-outline" />
                </div>

                {/* Content Management Section */}
                <div className="bg-admin-sidebar p-6 rounded-lg shadow-lg">
                     <h2 className="text-2xl font-bold text-white mb-6">Content Management</h2>
                     <ContentTable categories={categories} onContentUpdate={onContentUpdate} />
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
