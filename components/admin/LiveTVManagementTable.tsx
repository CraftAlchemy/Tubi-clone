import React, { useState } from 'react';
import '../../types';
import type { LiveTVChannel } from '../../types';

interface LiveTVManagementTableProps {
    channels: LiveTVChannel[];
    onUpdate: (channels: LiveTVChannel[]) => void;
}

const LiveTVManagementTable: React.FC<LiveTVManagementTableProps> = ({ channels, onUpdate }) => {
    const [modal, setModal] = useState<null | { type: 'ADD' } | { type: 'EDIT'; channel: LiveTVChannel }>(null);
    const [deleteConfirm, setDeleteConfirm] = useState<LiveTVChannel | null>(null);
    const [formData, setFormData] = useState<Partial<LiveTVChannel>>({ name: '', logoUrl: '', streamUrl: '' });

    const openAddModal = () => {
        setFormData({ name: '', logoUrl: '', streamUrl: '' });
        setModal({ type: 'ADD' });
    };

    const openEditModal = (channel: LiveTVChannel) => {
        setFormData(channel);
        setModal({ type: 'EDIT', channel });
    };

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = () => {
        if (!formData.name || !formData.logoUrl || !formData.streamUrl) {
            alert('All fields are required.');
            return;
        }

        if (modal?.type === 'ADD') {
            const newChannel: LiveTVChannel = {
                id: (channels.length > 0 ? Math.max(...channels.map(c => c.id)) : 0) + 1,
                name: formData.name,
                logoUrl: formData.logoUrl,
                streamUrl: formData.streamUrl,
            };
            onUpdate([...channels, newChannel]);
        } else if (modal?.type === 'EDIT') {
            const updatedChannels = channels.map(c =>
                c.id === formData.id ? { ...c, ...formData } : c
            );
            onUpdate(updatedChannels);
        }
        setModal(null);
    };

    const handleDelete = (channelToDelete: LiveTVChannel) => {
        onUpdate(channels.filter(c => c.id !== channelToDelete.id));
        setDeleteConfirm(null);
    };

    return (
        <div className="overflow-x-auto">
            <div className="mb-6">
                <button onClick={openAddModal} className="bg-admin-accent hover:opacity-90 text-white font-bold py-2 px-4 rounded-md">
                    Add New Channel
                </button>
            </div>
            <table className="min-w-full bg-admin-card rounded-lg">
                <thead className="bg-gray-700">
                    <tr>
                        <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Logo</th>
                        <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Channel Name</th>
                        <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Stream URL</th>
                        <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Actions</th>
                    </tr>
                </thead>
                <tbody className="text-gray-300">
                    {channels.map(channel => (
                         <tr key={channel.id} className="border-b border-gray-700 hover:bg-gray-800">
                            <td className="py-2 px-4">
                                <img src={channel.logoUrl} alt={channel.name} className="w-12 h-12 rounded-full object-cover bg-gray-700" />
                            </td>
                            <td className="py-3 px-4 font-semibold">{channel.name}</td>
                            <td className="py-3 px-4 text-sm truncate max-w-xs text-gray-400">{channel.streamUrl}</td>
                            <td className="py-3 px-4 flex items-center gap-4 h-full mt-4">
                                <button onClick={() => openEditModal(channel)} className="text-yellow-400 hover:text-yellow-300" title="Edit channel">
                                    <ion-icon name="pencil-outline"></ion-icon>
                                </button>
                                <button onClick={() => setDeleteConfirm(channel)} className="text-red-400 hover:text-red-300" title="Delete channel">
                                     <ion-icon name="trash-outline"></ion-icon>
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            
            {/* Add/Edit Modal */}
            {modal && (
                 <div className="fixed inset-0 z-[100] bg-black bg-opacity-70 flex items-center justify-center">
                    <div className="bg-admin-card p-6 rounded-lg w-full max-w-md space-y-4">
                        <h3 className="text-xl font-bold">{modal.type === 'ADD' ? 'Add New Channel' : 'Edit Channel'}</h3>
                        <div>
                            <label className="text-sm text-gray-400">Channel Name</label>
                            <input type="text" name="name" value={formData.name || ''} onChange={handleFormChange} className="bg-gray-700 rounded px-3 py-2 w-full mt-1"/>
                        </div>
                        <div>
                            <label className="text-sm text-gray-400">Logo URL</label>
                            <input type="text" name="logoUrl" value={formData.logoUrl || ''} onChange={handleFormChange} className="bg-gray-700 rounded px-3 py-2 w-full mt-1"/>
                        </div>
                         <div>
                            <label className="text-sm text-gray-400">Stream URL</label>
                            <input type="text" name="streamUrl" value={formData.streamUrl || ''} onChange={handleFormChange} placeholder="e.g., YouTube embed URL" className="bg-gray-700 rounded px-3 py-2 w-full mt-1"/>
                        </div>
                        <div className="flex justify-end gap-4 pt-4">
                            <button onClick={() => setModal(null)} className="bg-gray-600 hover:opacity-90 text-white font-bold py-2 px-4 rounded-md">Cancel</button>
                            <button onClick={handleSubmit} className="bg-admin-accent hover:opacity-90 text-white font-bold py-2 px-4 rounded-md">
                                {modal.type === 'ADD' ? 'Add Channel' : 'Save Changes'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

             {/* Delete Confirmation Modal */}
            {deleteConfirm && (
                 <div className="fixed inset-0 z-[100] bg-black bg-opacity-70 flex items-center justify-center">
                    <div className="bg-admin-card p-6 rounded-lg w-full max-w-md space-y-4 text-center">
                        <h3 className="text-xl font-bold text-white">Are you sure?</h3>
                        <p className="text-gray-300">
                            You are about to delete the channel <span className="font-semibold text-white">{deleteConfirm.name}</span>.
                            This action cannot be undone.
                        </p>
                        <div className="flex justify-center gap-4 pt-4">
                            <button onClick={() => setDeleteConfirm(null)} className="bg-gray-600 hover:opacity-90 text-white font-bold py-2 px-4 rounded-md">
                                Cancel
                            </button>
                            <button onClick={() => handleDelete(deleteConfirm)} className="bg-red-600 hover:bg-red-500 text-white font-bold py-2 px-4 rounded-md">
                                Delete Channel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LiveTVManagementTable;
