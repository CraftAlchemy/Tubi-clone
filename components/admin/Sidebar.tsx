

import React from 'react';
// Fix: Use a side-effect import to ensure the module is loaded and its global JSX augmentations for `ion-icon` are applied.
import '../../types';

const Sidebar: React.FC = () => {
    return (
        <aside className="w-64 bg-admin-sidebar text-gray-300 flex flex-col shadow-lg">
            <div className="h-16 flex items-center justify-center border-b border-gray-700">
                 <a href="#/admin" className="text-xl font-bold text-white">Admin Panel</a>
            </div>
            <nav className="flex-1 px-4 py-6 space-y-2">
                <a href="#/admin" className="flex items-center px-4 py-2 rounded-lg bg-admin-accent text-white">
                    <Icon name="bar-chart-outline" />
                    <span className="ml-3">Dashboard</span>
                </a>
                <a href="#/admin" className="flex items-center px-4 py-2 rounded-lg hover:bg-admin-card">
                    <Icon name="videocam-outline" />
                    <span className="ml-3">Content</span>
                </a>
                <div title="Feature coming soon" className="cursor-not-allowed">
                    <a href="#" className="flex items-center px-4 py-2 rounded-lg hover:bg-admin-card opacity-50 pointer-events-none">
                        <Icon name="people-circle-outline" />
                        <span className="ml-3">Users</span>
                    </a>
                </div>
                <div title="Feature coming soon" className="cursor-not-allowed">
                    <a href="#" className="flex items-center px-4 py-2 rounded-lg hover:bg-admin-card opacity-50 pointer-events-none">
                        <Icon name="settings-outline" />
                        <span className="ml-3">Settings</span>
                    </a>
                </div>
            </nav>
            <div className="px-4 py-6 border-t border-gray-700">
                 <a href="/#/" className="flex items-center px-4 py-2 rounded-lg hover:bg-admin-card">
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