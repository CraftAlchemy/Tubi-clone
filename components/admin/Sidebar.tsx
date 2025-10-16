// FIX: Removed redundant side-effect import for types as it is now handled globally in index.tsx.
import React, { useState } from 'react';

interface SidebarProps {
    activeView: string;
    setActiveView: (view: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView }) => {
    const [isContentMenuOpen, setIsContentMenuOpen] = useState(false);
    
    const NavItem: React.FC<{ view: string; label: string; icon: string; }> = ({ view, label, icon }) => (
         <button 
            onClick={() => setActiveView(view)} 
            className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-md transition-colors ${activeView === view ? 'bg-admin-accent text-white' : 'hover:bg-gray-700'}`}
        >
            <ion-icon name={icon} class="text-xl"></ion-icon>
            <span className="font-medium">{label}</span>
        </button>
    );

    return (
        <div className="w-64 bg-admin-sidebar p-4 flex flex-col space-y-2">
            <a href="/#/" className="text-2xl font-bold text-myflix-red tracking-wider text-center py-4 mb-4">
                ADMIN
            </a>
            
            <NavItem view="dashboard" label="Dashboard" icon="grid-outline" />
            <NavItem view="users" label="Users" icon="people-outline" />

             <div>
                <button 
                    onClick={() => setIsContentMenuOpen(!isContentMenuOpen)}
                    className="w-full flex items-center justify-between px-4 py-2.5 rounded-md hover:bg-gray-700"
                >
                    <div className="flex items-center space-x-3">
                         <ion-icon name="folder-open-outline" class="text-xl"></ion-icon>
                         <span className="font-medium">Content</span>
                    </div>
                    <ion-icon name={isContentMenuOpen ? "chevron-up-outline" : "chevron-down-outline"}></ion-icon>
                </button>
                {isContentMenuOpen && (
                    <div className="pl-8 pt-2 space-y-2">
                        <NavItem view="content-movies" label="Movies" icon="film-outline" />
                        <NavItem view="content-series" label="Series" icon="tv-outline" />
                        <NavItem view="content-cartoons" label="Cartoons" icon="color-palette-outline" />
                    </div>
                )}
            </div>

            <NavItem view="livetv" label="Live TV" icon="radio-outline" />
            <NavItem view="advertising" label="Advertising" icon="cash-outline" />
            <NavItem view="settings" label="Settings" icon="settings-outline" />
            
            <div className="pt-4 mt-auto">
                 <a href="/#/" className="w-full flex items-center space-x-3 px-4 py-2.5 rounded-md transition-colors hover:bg-gray-700">
                    <ion-icon name="log-out-outline" class="text-xl"></ion-icon>
                    <span className="font-medium">Exit Admin</span>
                </a>
            </div>
        </div>
    );
};

export default Sidebar;