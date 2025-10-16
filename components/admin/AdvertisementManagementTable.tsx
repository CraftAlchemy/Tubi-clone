
import React, { useState } from 'react';
// FIX: Add side-effect import to load global JSX augmentations for ion-icon.
import '../../types';
import type { Advertisement } from '../../types';

interface AdvertisementManagementTableProps {
    advertisements: Advertisement[];
    onUpdate: (advertisements: Advertisement[]) => void;
}

const AdvertisementManagementTable: React.FC<AdvertisementManagementTableProps> = ({ advertisements, onUpdate }) => {
    const [modal, setModal] = useState<null | { type: 'ADD' } | { type: 'EDIT'; ad: Advertisement }>(null);
    const [deleteConfirm, setDeleteConfirm] = useState<Advertisement | null>(null);
    const [formData, setFormData] = useState<Partial<Advertisement>>({ title: '', videoUrl: '', duration: 30, tokenReward: 1 });
    const [selectedAds, setSelectedAds] = useState<number[]>([]);

    const openAddModal = () => {
        setFormData({ title: '', videoUrl: '', duration: 30, tokenReward: 1 });
        setModal({ type: 'ADD' });
    };

    const openEditModal = (ad: Advertisement) => {
        setFormData(ad);
        setModal({ type: 'EDIT', ad });
    };

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'number' ? parseInt(value, 10) || 0 : value }));
    };

    const handleSubmit = () => {
        if (!formData.title || !formData.videoUrl || (formData.duration === undefined) || (formData.tokenReward === undefined)) {
            alert('All fields are required.');
            return;
        }

        if (modal?.type === 'ADD') {
            const newAd: Advertisement = {
                id: (advertisements.length > 0 ? Math.max(...advertisements.map(c => c.id)) : 0) + 1,
                title: formData.title,
                videoUrl: formData.videoUrl,
                duration: formData.duration,
                tokenReward: formData.tokenReward,
            };
            onUpdate([...advertisements, newAd]);
        } else if (modal?.type === 'EDIT') {
            const updatedAds = advertisements.map(ad =>
                ad.id === formData.id ? { ...ad, ...formData } as Advertisement : ad
            );
            onUpdate(updatedAds);
        }
        setModal(null);
    };

    const handleDelete = (adToDelete: Advertisement) => {
        onUpdate(advertisements.filter(ad => ad.id !== adToDelete.id));
        setDeleteConfirm(null);
    };
    
    const handleSelectAd = (adId: number) => {
        setSelectedAds(prev => 
            prev.includes(adId) ? prev.filter(id => id !== adId) : [...prev, adId]
        );
    };

    const handleSelectAll = () => {
        if (selectedAds.length === advertisements.length) {
            setSelectedAds([]);
        } else {
            setSelectedAds(advertisements.map(c => c.id));
        }
    };
    
    const handleBulkDelete = () => {
        if (window.confirm(`Are you sure you want to delete ${selectedAds.length} advertisement(s)?`)) {
            onUpdate(advertisements.filter(c => !selectedAds.includes(c.id)));
            setSelectedAds([]);
        }
    };

    return (
        <div className="overflow-x-auto">
             <div className="mb-6 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <button onClick={openAddModal} className="bg-admin-accent hover:opacity-90 text-white font-bold py-2 px-4 rounded-md">
                    Add New Ad
                </button>
                {selectedAds.length > 0 && (
                     <div className="flex items-center gap-2 self-end sm:self-center">
                         <span className="text-sm text-gray-400">{selectedAds.length} selected</span>
                         <button onClick={handleBulkDelete} className="px-2 py-1 bg-red-600 text-white rounded-md hover:bg-red-500 text-xs font-bold">Delete Selected</button>
                    </div>
                )}
            </div>
            <table className="min-w-full bg-admin-card rounded-lg border-collapse">
                <thead className="bg-gray-700 hidden md:table-header-group">
                    <tr>
                        <th className="py-3 px-4 w-12"><input type="checkbox" onChange={handleSelectAll} checked={advertisements.length > 0 && selectedAds.length === advertisements.length} className="form-checkbox h-4 w-4 bg-gray-800 border-gray-600 text-admin-accent rounded focus:ring-admin-accent"/></th>
                        <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Ad Title</th>
                        <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Duration</th>
                        <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Token Reward</th>
                        <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Actions</th>
                    </tr>
                </thead>
                <tbody className="text-gray-300">
                    {advertisements.map(ad => (
                         <tr key={ad.id} className={`block md:table-row mb-4 md:mb-0 rounded-lg md:rounded-none overflow-hidden ${selectedAds.includes(ad.id) ? 'bg-gray-800' : 'bg-admin-card'} md:bg-transparent border-b border-gray-700`}>
                             <td className="block md:table-cell p-3 md:py-3 md:px-4 text-right md:text-left border-b md:border-none border-gray-700">
                                <span className="md:hidden font-semibold float-left">Select</span>
                                <input type="checkbox" checked={selectedAds.includes(ad.id)} onChange={() => handleSelectAd(ad.id)} className="form-checkbox h-4 w-4 bg-gray-700 border-gray-600 text-admin-accent rounded focus:ring-admin-accent"/>
                            </td>
                            <td className="block md:table-cell p-3 md:py-3 md:px-4 text-right md:text-left border-b md:border-none border-gray-700 font-semibold">
                                <span className="md:hidden font-semibold float-left">Ad Title</span>
                                {ad.title}
                            </td>
                             <td className="block md:table-cell p-3 md:py-3 md:px-4 text-right md:text-left border-b md:border-none border-gray-700">
                                <span className="md:hidden font-semibold float-left">Duration</span>
                                {ad.duration}s
                            </td>
                            <td className="block md:table-cell p-3 md:py-3 md:px-4 text-right md:text-left border-b md:border-none border-gray-700">
                                <span className="md:hidden font-semibold float-left">Token Reward</span>
                                <span className="font-mono text-yellow-400">{ad.tokenReward}</span>
                            </td>
                            <td className="block md:table-cell p-3 md:py-3 md:px-4 text-right md:text-left">
                                <span className="md:hidden font-semibold float-left">Actions</span>
                                <div className="flex justify-end md:justify-start items-center gap-4">
                                     {/* @ts-ignore */}
                                    <button onClick={() => openEditModal(ad)} className="text-yellow-400 hover:text-yellow-300" title="Edit advertisement"><ion-icon name="pencil-outline"></ion-icon></button>
                                     {/* @ts-ignore */}
                                    <button onClick={() => setDeleteConfirm(ad)} className="text-red-400 hover:text-red-300" title="Delete advertisement"><ion-icon name="trash-outline"></ion-icon></button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            
            {/* Add/Edit Modal */}
            {modal && (
                 <div className="fixed inset-0 z-[100] bg-black bg-opacity-70 flex items-center justify-center">
                    <div className="bg-admin-card p-6 rounded-lg w-full max-w-md space-y-4">
                        <h3 className="text-xl font-bold">{modal.type === 'ADD' ? 'Add New Advertisement' : 'Edit Advertisement'}</h3>
                        <div><label className="text-sm text-gray-400">Ad Title</label><input type="text" name="title" value={formData.title || ''} onChange={handleFormChange} className="bg-gray-700 rounded px-3 py-2 w-full mt-1"/></div>
                        <div><label className="text-sm text-gray-400">Video URL</label><input type="text" name="videoUrl" value={formData.videoUrl || ''} onChange={handleFormChange} placeholder="e.g., YouTube URL" className="bg-gray-700 rounded px-3 py-2 w-full mt-1"/></div>
                        <div><label className="text-sm text-gray-400">Duration (seconds)</label><input type="number" name="duration" value={formData.duration || 0} onChange={handleFormChange} className="bg-gray-700 rounded px-3 py-2 w-full mt-1"/></div>
                        <div><label className="text-sm text-gray-400">Token Reward</label><input type="number" name="tokenReward" value={formData.tokenReward || 0} onChange={handleFormChange} className="bg-gray-700 rounded px-3 py-2 w-full mt-1"/></div>
                        <div className="flex justify-end gap-4 pt-4">
                            <button onClick={() => setModal(null)} className="bg-gray-600 hover:opacity-90 text-white font-bold py-2 px-4 rounded-md">Cancel</button>
                            <button onClick={handleSubmit} className="bg-admin-accent hover:opacity-90 text-white font-bold py-2 px-4 rounded-md">{modal.type === 'ADD' ? 'Add Ad' : 'Save Changes'}</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteConfirm && (
                 <div className="fixed inset-0 z-[100] bg-black bg-opacity-70 flex items-center justify-center">
                    <div className="bg-admin-card p-6 rounded-lg w-full max-w-md space-y-4 text-center">
                        <h3 className="text-xl font-bold text-white">Are you sure?</h3>
                        <p className="text-gray-300">You are about to delete the ad <span className="font-semibold text-white">{deleteConfirm.title}</span>.</p>
                        <div className="flex justify-center gap-4 pt-4">
                            <button onClick={() => setDeleteConfirm(null)} className="bg-gray-600 hover:opacity-90 text-white font-bold py-2 px-4 rounded-md">Cancel</button>
                            <button onClick={() => handleDelete(deleteConfirm)} className="bg-red-600 hover:bg-red-500 text-white font-bold py-2 px-4 rounded-md">Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdvertisementManagementTable;