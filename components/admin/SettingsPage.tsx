
import React, { useState } from 'react';

interface SettingsPageProps {
    siteName: string;
    onSiteNameUpdate: (newName: string) => void;
    isCartoonSectionEnabled: boolean;
    onToggleCartoonSection: (isEnabled: boolean) => void;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ siteName, onSiteNameUpdate, isCartoonSectionEnabled, onToggleCartoonSection }) => {
    const [name, setName] = useState(siteName);
    const [isSaved, setIsSaved] = useState(false);
    // Dummy state for monetization setting example
    const [defaultTokenReward, setDefaultTokenReward] = useState(1);

    const handleSave = () => {
        onSiteNameUpdate(name);
        // Here you would also save monetization settings
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 2000); // Hide message after 2 seconds
    };
    
    const isSaveDisabled = name.trim() === '' || name === siteName;

    return (
        <div>
            <h1 className="text-3xl font-bold text-white mb-8">Site Settings</h1>
            
            <div className="bg-admin-sidebar p-6 rounded-lg shadow-lg max-w-2xl">
                 <h2 className="text-xl font-bold text-white mb-6 border-b border-gray-700 pb-4">General Settings</h2>
                 
                 <div className="space-y-4">
                    <div>
                        <label htmlFor="siteName" className="block text-sm font-medium text-gray-300 mb-1">
                            Site Name
                        </label>
                        <input
                            type="text"
                            id="siteName"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="bg-admin-card border border-gray-600 rounded-md px-3 py-2 text-white w-full focus:ring-admin-accent focus:border-admin-accent"
                        />
                        <p className="text-xs text-gray-400 mt-2">This will appear in the browser tab, admin panel, and ARIA labels.</p>
                    </div>
                 </div>

                 <div className="mt-8 pt-6 border-t border-gray-700 flex items-center justify-end gap-4">
                     {isSaved && <p className="text-green-400 text-sm animate-fade-in">Settings saved successfully!</p>}
                     <button 
                        onClick={handleSave}
                        disabled={isSaveDisabled}
                        className="bg-admin-accent hover:opacity-90 text-white font-bold py-2 px-6 rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
                    >
                        Save Changes
                    </button>
                 </div>
            </div>

            <div className="bg-admin-sidebar p-6 rounded-lg shadow-lg max-w-2xl mt-8">
                 <h2 className="text-xl font-bold text-white mb-6 border-b border-gray-700 pb-4">Monetization Settings</h2>
                 <div className="space-y-4">
                    <div>
                        <label htmlFor="defaultTokenReward" className="block text-sm font-medium text-gray-300 mb-1">
                           Default Token Reward per Ad
                        </label>
                        <input
                            type="number"
                            id="defaultTokenReward"
                            value={defaultTokenReward}
                            onChange={(e) => setDefaultTokenReward(parseInt(e.target.value, 10) || 0)}
                            className="bg-admin-card border border-gray-600 rounded-md px-3 py-2 text-white w-full focus:ring-admin-accent focus:border-admin-accent"
                        />
                         <p className="text-xs text-gray-400 mt-2">The default number of tokens a user receives for watching one advertisement.</p>
                    </div>
                 </div>
            </div>

            <div className="bg-admin-sidebar p-6 rounded-lg shadow-lg max-w-2xl mt-8">
                 <h2 className="text-xl font-bold text-white mb-6 border-b border-gray-700 pb-4">Feature Toggles</h2>
                 
                 <div className="flex items-center justify-between">
                    <div>
                        <label htmlFor="cartoonToggle" className="block text-sm font-medium text-gray-300">
                            Enable Cartoon Section
                        </label>
                        <p className="text-xs text-gray-400 mt-1">Show the "Cartoon" link in the main navigation header.</p>
                    </div>
                     <label htmlFor="cartoonToggle" className="flex items-center cursor-pointer">
                         <div className="relative">
                             <input type="checkbox" id="cartoonToggle" className="sr-only peer" checked={isCartoonSectionEnabled} onChange={() => onToggleCartoonSection(!isCartoonSectionEnabled)} />
                             <div className="block bg-gray-600 w-14 h-8 rounded-full peer-checked:bg-admin-accent"></div>
                             <div className="dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform peer-checked:translate-x-6"></div>
                         </div>
                     </label>
                 </div>
            </div>
        </div>
    );
};

export default SettingsPage;