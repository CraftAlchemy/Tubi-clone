
import React from 'react';

const Sidebar: React.FC = () => {
    return (
        <aside className="w-64 bg-admin-sidebar text-gray-300 flex flex-col shadow-lg">
            <div className="h-16 flex items-center justify-center border-b border-gray-700">
                 <a href="#" className="text-xl font-bold text-white">Admin Panel</a>
            </div>
            <nav className="flex-1 px-4 py-6 space-y-2">
                <a href="#/admin" className="flex items-center px-4 py-2 rounded-lg bg-admin-accent text-white">
                    <Icon name="bar-chart-outline" />
                    <span className="ml-3">Dashboard</span>
                </a>
                <a href="#" className="flex items-center px-4 py-2 rounded-lg hover:bg-admin-card">
                    <Icon name="videocam-outline" />
                    <span className="ml-3">Content</span>
                </a>
                <a href="#" className="flex items-center px-4 py-2 rounded-lg hover:bg-admin-card">
                    <Icon name="people-circle-outline" />
                    <span className="ml-3">Users</span>
                </a>
                <a href="#" className="flex items-center px-4 py-2 rounded-lg hover:bg-admin-card">
                    <Icon name="settings-outline" />
                    <span className="ml-3">Settings</span>
                </a>
            </nav>
            <div className="px-4 py-6 border-t border-gray-700">
                 <a href="/#" className="flex items-center px-4 py-2 rounded-lg hover:bg-admin-card">
                    <Icon name="exit-outline" />
                    <span className="ml-3">Back to Site</span>
                </a>
            </div>
        </aside>
    );
};

const Icon: React.FC<{ name: string }> = ({ name }) => (
    <span className="text-2xl">
        <ion-icon name={name}></ion-icon>
    </span>
);

export default Sidebar;
