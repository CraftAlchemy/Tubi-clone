


// FIX: Import global type definitions to resolve errors related to missing JSX intrinsic elements like 'div', 'h1', and 'input'.
import '../../types';
import React, { useState, useEffect } from 'react';
import type { TokenPack } from '../../types';

interface SettingsPageProps {
    initialSiteName: string;
    onSave: (newName: string) => Promise<void>;
    isCartoonSectionEnabled: boolean;
    onCartoonSectionToggle: (enabled: boolean) => void;
    tokenPacks: TokenPack[];
    onTokenPacksUpdate: (packs: TokenPack[]) => void;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ 
    initialSiteName, 
    onSave,
    isCartoonSectionEnabled,
    onCartoonSectionToggle,
    tokenPacks,
    onTokenPacksUpdate
}) => {
    const [siteName, setSiteName] = useState(initialSiteName);
    const [isSaving, setIsSaving] = useState(false);
    const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
    
    // State for token packs
    const [localTokenPacks, setLocalTokenPacks] = useState<TokenPack[]>(tokenPacks);
    const [modal, setModal] = useState<null | { type: 'ADD' } | { type: 'EDIT', pack: TokenPack }>(null);
    const [formData, setFormData] = useState<Partial<TokenPack>>({});

    useEffect(() => {
        setSiteName(initialSiteName);
    }, [initialSiteName]);

    useEffect(() => {
        setLocalTokenPacks(tokenPacks);
    }, [tokenPacks]);
    
    const handleSave = async () => {
        setIsSaving(true);
        setSaveStatus('idle');
        try {
            await onSave(siteName);
            onTokenPacksUpdate(localTokenPacks);
            setSaveStatus('success');
        } catch (error) {
            console.error("Failed to save settings:", error);
            setSaveStatus('error');
        } finally {
            setIsSaving(false);
            setTimeout(() => setSaveStatus('idle'), 3000); // Reset status after 3s
        }
    };
    
    const openModal = (type: 'ADD' | 'EDIT', pack?: TokenPack) => {
        setModal({ type, pack: pack! });
        setFormData(pack || { amount: 50, price: 4.99, isBestValue: false });
    };

    const handlePackFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : (type === 'number' ? parseFloat(value) || 0 : value)
        }));
    };

    const handlePackSubmit = () => {
        if (!formData.amount || !formData.price) {
            alert('Amount and price are required.');
            return;
        }
        let updatedPacks;
        if (modal?.type === 'ADD') {
            const newPack: TokenPack = {
                id: (localTokenPacks.length > 0 ? Math.max(...localTokenPacks.map(p => p.id)) : 0) + 1,
                amount: formData.amount!,
                price: formData.price!,
                isBestValue: formData.isBestValue || false
            };
            updatedPacks = [...localTokenPacks, newPack];
        } else {
             updatedPacks = localTokenPacks.map(p => p.id === formData.id ? { ...p, ...formData } as TokenPack : p);
        }
        
        // If 'isBestValue' is checked, uncheck it for all other packs
        if (formData.isBestValue) {
            updatedPacks = updatedPacks.map(p => p.id === formData.id ? p : { ...p, isBestValue: false });
        }

        setLocalTokenPacks(updatedPacks);
        setModal(null);
    };

    const handlePackDelete = (packId: number) => {
        setLocalTokenPacks(localTokenPacks.filter(p => p.id !== packId));
    };

    const hasChanges = siteName !== initialSiteName || JSON.stringify(tokenPacks) !== JSON.stringify(localTokenPacks);


    return (
        <div className="p-4 sm:p-6 md:p-8">
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-6">General Settings</h1>
            
            <div className="space-y-8 max-w-4xl">
                {/* General Settings Card */}
                <div className="bg-admin-card p-6 rounded-lg">
                    <h2 className="text-xl font-semibold mb-4 text-white border-b border-gray-600 pb-3">Branding</h2>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="siteName" className="block text-sm font-medium text-gray-300 mb-1">
                                Site Name
                            </label>
                            <input
                                type="text"
                                id="siteName"
                                value={siteName}
                                onChange={(e) => setSiteName(e.target.value)}
                                className="w-full bg-admin-sidebar border border-gray-600 rounded-md px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-admin-accent"
                                placeholder="e.g., Myflix"
                            />
                             <p className="text-xs text-gray-400 mt-1">This name will be displayed in the header, footer, and browser tab.</p>
                        </div>
                    </div>
                </div>

                {/* Feature Toggles Card */}
                <div className="bg-admin-card p-6 rounded-lg">
                    <h2 className="text-xl font-semibold mb-4 text-white border-b border-gray-600 pb-3">Feature Toggles</h2>
                    <div className="flex items-center justify-between">
                        <div>
                            <label htmlFor="cartoon-toggle" className="font-medium text-gray-200">"Cartoon" Section</label>
                            <p className="text-xs text-gray-400 mt-1">Enable or disable the "Cartoon" section in the navigation.</p>
                        </div>
                        <label htmlFor="cartoon-toggle" className="relative inline-flex items-center cursor-pointer">
                            <input 
                                type="checkbox" 
                                id="cartoon-toggle" 
                                className="sr-only peer"
                                checked={isCartoonSectionEnabled}
                                onChange={(e) => onCartoonSectionToggle(e.target.checked)}
                            />
                            <div className="w-11 h-6 bg-gray-600 rounded-full peer peer-focus:ring-2 peer-focus:ring-admin-accent peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-admin-accent"></div>
                        </label>
                    </div>
                </div>

                {/* Monetization Settings Card */}
                <div className="bg-admin-card p-6 rounded-lg">
                    <div className="flex justify-between items-center mb-4 border-b border-gray-600 pb-3">
                        <h2 className="text-xl font-semibold text-white">Monetization Settings: Token Packs</h2>
                        <button onClick={() => openModal('ADD')} className="bg-admin-accent text-white font-bold py-1.5 px-3 rounded-md text-sm hover:opacity-90">Add Pack</button>
                    </div>
                    <div className="space-y-3">
                        {localTokenPacks.map(pack => (
                            <div key={pack.id} className="flex items-center justify-between bg-admin-sidebar p-3 rounded-md">
                                <div>
                                    <p className="font-bold">{pack.amount} Tokens - ${pack.price.toFixed(2)}</p>
                                    {pack.isBestValue && <span className="text-xs bg-yellow-400 text-black font-bold px-1.5 py-0.5 rounded-full">Best Value</span>}
                                </div>
                                <div className="flex items-center gap-3">
                                    <button onClick={() => openModal('EDIT', pack)} className="text-yellow-400 hover:text-yellow-300">Edit</button>
                                    <button onClick={() => handlePackDelete(pack.id)} className="text-red-400 hover:text-red-300">Delete</button>
                                </div>
                            </div>
                        ))}
                         {localTokenPacks.length === 0 && (
                            <p className="text-center text-gray-400 py-4">No token packs configured.</p>
                        )}
                    </div>
                </div>

                 {/* Save Button */}
                <div className="mt-6 flex items-center justify-end gap-4">
                    {saveStatus === 'success' && <span className="text-green-400 text-sm">Settings saved!</span>}
                    {saveStatus === 'error' && <span className="text-red-400 text-sm">Failed to save.</span>}
                    <button
                        onClick={handleSave}
                        disabled={isSaving || !hasChanges}
                        className="bg-admin-accent text-white font-bold py-2 px-5 rounded-md hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </div>

             {/* Token Pack Modal */}
            {modal && (
                 <div className="fixed inset-0 z-[100] bg-black bg-opacity-70 flex items-center justify-center">
                    <div className="bg-admin-card p-6 rounded-lg w-full max-w-md space-y-4">
                        <h3 className="text-xl font-bold">{modal.type === 'ADD' ? 'Add Token Pack' : 'Edit Token Pack'}</h3>
                        <div><label className="text-sm text-gray-400">Token Amount</label><input type="number" name="amount" value={formData.amount || ''} onChange={handlePackFormChange} className="bg-gray-700 rounded px-3 py-2 w-full mt-1"/></div>
                        <div><label className="text-sm text-gray-400">Price (USD)</label><input type="number" name="price" step="0.01" value={formData.price || ''} onChange={handlePackFormChange} className="bg-gray-700 rounded px-3 py-2 w-full mt-1"/></div>
                        <div className="flex items-center gap-2"><input type="checkbox" name="isBestValue" id="isBestValue" checked={formData.isBestValue || false} onChange={handlePackFormChange} className="h-4 w-4 bg-gray-700 border-gray-600 text-admin-accent rounded focus:ring-admin-accent"/><label htmlFor="isBestValue" className="text-sm">Mark as "Best Value"</label></div>
                        <div className="flex justify-end gap-4 pt-4">
                            <button onClick={() => setModal(null)} className="bg-gray-600 hover:opacity-90 text-white font-bold py-2 px-4 rounded-md">Cancel</button>
                            <button onClick={handlePackSubmit} className="bg-admin-accent hover:opacity-90 text-white font-bold py-2 px-4 rounded-md">Save</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SettingsPage;