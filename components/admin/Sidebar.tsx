


import React from 'react';
// Fix: Use a side-effect import to ensure the module is loaded and its global JSX augmentations for `ion-icon` are applied.
import '../../types';

type AdminView = 'dashboard' | 'content' | 'users';

interface SidebarProps {
    view: AdminView;
    setView: (view: AdminView) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ view, setView }) => {

    const NavLink: React.FC<{
        targetView: AdminView;
        iconName: string;
        label: string;
        disabled?: boolean;
    }> = ({ targetView, iconName, label, disabled }) => {
        const isActive = view === targetView;
        const classes = `flex items-center px-4 py-2 rounded-lg transition-colors ${
            isActive ? 'bg-admin-accent text-white' : 'hover:bg-admin-card'
        } ${disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : 'cursor-pointer'}`;
        
        return (
            <div title={disabled ? "Feature coming soon" : ""} className={disabled ? "cursor-not-allowed" : ""}>
                <button onClick={() => !disabled && setView(targetView)} className={`${classes} w-full`}>
                    <Icon name={iconName} />
                    <span className="ml-3">{label}</span>
                </button>
            </div>
        );
    };

    return (
        <aside className="w-64 bg-admin-sidebar text-gray-300 flex flex-col shadow-lg">
            <div className="h-16 flex items-center justify-center border-b border-gray-700">
                 <a href="#/admin" className="text-xl font-bold text-white">Admin Panel</a>
            </div>
            <nav className="flex-1 px-4 py-6 space-y-2">
                <NavLink targetView="dashboard" iconName="bar-chart-outline" label="Dashboard" />
                <NavLink targetView="content" iconName="videocam-outline" label="Content" />
                <NavLink targetView="users" iconName="people-circle-outline" label="Users" />
                <NavLink targetView="dashboard" iconName="settings-outline" label="Settings" disabled />
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
