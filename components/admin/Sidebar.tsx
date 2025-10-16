



import React from 'react';
// FIX: Use a side-effect import to ensure the module is loaded and its global JSX augmentations for `ion-icon` are applied.
import '../../types';

type AdminView = 'dashboard' | 'content' | 'users' | 'monetization' | 'settings';

interface SidebarProps {
    view: AdminView;
    setView: (view: AdminView) => void;
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    siteName: string;
}

const Sidebar: React.FC<SidebarProps> = ({ view, setView, isOpen, setIsOpen, siteName }) => {
    
    const handleViewChange = (targetView: AdminView) => {
        setView(targetView);
        if (window.innerWidth < 1024) { // Tailwind's lg breakpoint
            setIsOpen(false);
        }
    };

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
                <button onClick={() => !disabled && handleViewChange(targetView)} className={`${classes} w-full`}>
                    <Icon name={iconName} />
                    <span className="ml-3">{label}</span>
                </button>
            </div>
        );
    };

    return (
        <>
             {/* Backdrop for mobile */}
            <div 
                className={`fixed inset-0 bg-black bg-opacity-60 z-30 transition-opacity lg:hidden ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={() => setIsOpen(false)}
                aria-hidden="true"
            ></div>

            <aside className={`fixed inset-y-0 left-0 w-64 bg-admin-sidebar text-gray-300 flex flex-col shadow-lg z-40 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
                <div className="h-16 flex items-center justify-between px-4 border-b border-gray-700">
                     <a href="#/admin" className="text-xl font-bold text-white">{siteName} Admin</a>
                     <button onClick={() => setIsOpen(false)} className="lg:hidden text-gray-400 hover:text-white" aria-label="Close sidebar">
                         {/* @ts-ignore */}
                         <ion-icon name="close-outline" style={{ fontSize: '28px' }}></ion-icon>
                     </button>
                </div>
                <nav className="flex-1 px-4 py-6 space-y-2">
                    <NavLink targetView="dashboard" iconName="bar-chart-outline" label="Dashboard" />
                    <NavLink targetView="content" iconName="videocam-outline" label="Content" />
                    <NavLink targetView="users" iconName="people-circle-outline" label="Users" />
                    <NavLink targetView="monetization" iconName="cash-outline" label="Monetization" />
                    <NavLink targetView="settings" iconName="settings-outline" label="Settings" />
                </nav>
                <div className="px-4 py-6 border-t border-gray-700">
                     <a href="/#/" className="flex items-center px-4 py-2 rounded-lg hover:bg-admin-card">
                        <Icon name="exit-outline" />
                        <span className="ml-3">Back to Site</span>
                    </a>
                </div>
            </aside>
        </>
    );
};

const Icon: React.FC<{ name: string }> = ({ name }) => (
    <span className="text-2xl">
        {/* @ts-ignore */}
        <ion-icon name={name}></ion-icon>
    </span>
);

export default Sidebar;