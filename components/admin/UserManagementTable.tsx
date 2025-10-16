// FIX: Removed redundant side-effect import for types as it is now handled globally in index.tsx.
import React, { useState } from 'react';
import type { User } from '../../types';

interface UserManagementTableProps {
    users: User[];
    onUpdate: (users: User[]) => void;
}

const USERS_PER_PAGE = 8;

const UserManagementTable: React.FC<UserManagementTableProps> = ({ users, onUpdate }) => {
    const [currentPage, setCurrentPage] = useState(0);
    const [modal, setModal] = useState<null | { type: 'ADD' } | { type: 'EDIT'; user: User } | { type: 'ADD_TOKENS', user: User }>(null);
    const [deleteConfirm, setDeleteConfirm] = useState<User | null>(null);
    const [formData, setFormData] = useState<any>({ id: 0, email: '', password: '', role: 'user' as 'user' | 'admin', tokens: 0 });
    const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
    
    const totalPages = Math.ceil(users.length / USERS_PER_PAGE);
    const paginatedUsers = users.slice(currentPage * USERS_PER_PAGE, (currentPage + 1) * USERS_PER_PAGE);

    const openAddModal = () => {
        setFormData({ id: 0, email: '', password: '', role: 'user', tokens: 0 });
        setModal({ type: 'ADD' });
    };

    const openEditModal = (user: User) => {
        setFormData({ ...user, password: '' }); // Don't pre-fill password for editing
        setModal({ type: 'EDIT', user });
    };

    const openTokenModal = (user: User) => {
        setFormData({ tokens: 0 });
        setModal({ type: 'ADD_TOKENS', user });
    };

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const value = e.target.type === 'number' ? parseInt(e.target.value, 10) || 0 : e.target.value;
        setFormData({ ...formData, [e.target.name]: value });
    };

    const handleSubmit = () => {
        if (modal?.type === 'ADD') {
            if (!formData.email || !formData.password) {
                alert('Email and password are required.');
                return;
            }
            const newUser: User = {
                id: (users.length > 0 ? Math.max(...users.map(u => u.id)) : 0) + 1,
                email: formData.email,
                password: formData.password,
                role: formData.role,
                tokens: formData.tokens || 0,
            };
            onUpdate([...users, newUser]);
        } else if (modal?.type === 'EDIT') {
            const updatedUsers = users.map(u => {
                if (u.id === formData.id) {
                    return {
                        ...u,
                        email: formData.email,
                        role: formData.role,
                        password: formData.password ? formData.password : u.password,
                    };
                }
                return u;
            });
            onUpdate(updatedUsers);
        } else if (modal?.type === 'ADD_TOKENS') {
            const updatedUsers = users.map(u => 
                u.id === modal.user.id ? { ...u, tokens: u.tokens + formData.tokens } : u
            );
            onUpdate(updatedUsers);
        }
        setModal(null);
    };

    const handleDelete = (userToDelete: User) => {
        const updatedUsers = users.filter(u => u.id !== userToDelete.id);
        onUpdate(updatedUsers);
        setDeleteConfirm(null);
    };

    const handleSelectUser = (userId: number) => {
        setSelectedUsers(prev => 
            prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
        );
    };

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        const paginatedUserIds = paginatedUsers.map(u => u.id);
        if (e.target.checked) {
            // Select all on the page
             setSelectedUsers(prev => [...new Set([...prev, ...paginatedUserIds])]);
        } else {
            // Deselect all on the page
            setSelectedUsers(prev => prev.filter(id => !paginatedUserIds.includes(id)));
        }
    };

    const handleBulkDelete = () => {
        if (window.confirm(`Are you sure you want to delete ${selectedUsers.length} user(s)?`)) {
            onUpdate(users.filter(u => !selectedUsers.includes(u.id)));
            setSelectedUsers([]);
        }
    };
    
    const handleBulkRoleChange = (role: 'admin' | 'user') => {
        onUpdate(users.map(u => 
            selectedUsers.includes(u.id) ? { ...u, role } : u
        ));
        setSelectedUsers([]);
    };
    
    const allOnPageSelected = paginatedUsers.length > 0 && paginatedUsers.every(u => selectedUsers.includes(u.id));

    return (
        <div className="overflow-x-auto">
             <div className="mb-6 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <button onClick={openAddModal} className="bg-admin-accent hover:opacity-90 text-white font-bold py-2 px-4 rounded-md">
                    Add New User
                </button>
                 {selectedUsers.length > 0 && (
                     <div className="flex items-center gap-2 self-end sm:self-center">
                         <span className="text-sm text-gray-400">{selectedUsers.length} selected</span>
                         <div className="flex items-center gap-2 p-1 bg-admin-card rounded-md">
                            <button onClick={handleBulkDelete} title="Delete Selected" className="px-2 py-1 bg-red-600 text-white rounded-md hover:bg-red-500 text-xs font-bold">Delete</button>
                            <button onClick={() => handleBulkRoleChange('admin')} title="Change Role to Admin" className="px-2 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-500 text-xs font-bold">Make Admin</button>
                            <button onClick={() => handleBulkRoleChange('user')} title="Change Role to User" className="px-2 py-1 bg-gray-600 text-white rounded-md hover:bg-gray-500 text-xs font-bold">Make User</button>
                         </div>
                    </div>
                )}
            </div>
            <table className="min-w-full bg-admin-card rounded-lg border-collapse">
                <thead className="bg-gray-700 hidden md:table-header-group">
                    <tr className="md:table-row">
                        <th className="py-3 px-4 w-12 md:table-cell">
                            <input
                                type="checkbox"
                                className="form-checkbox h-4 w-4 bg-gray-800 border-gray-600 text-admin-accent rounded focus:ring-admin-accent"
                                onChange={handleSelectAll}
                                checked={allOnPageSelected}
                            />
                        </th>
                        <th className="text-left py-3 px-4 uppercase font-semibold text-sm md:table-cell">User ID</th>
                        <th className="text-left py-3 px-4 uppercase font-semibold text-sm md:table-cell">Email</th>
                        <th className="text-left py-3 px-4 uppercase font-semibold text-sm md:table-cell">Role</th>
                        <th className="text-left py-3 px-4 uppercase font-semibold text-sm md:table-cell">Tokens</th>
                        <th className="text-left py-3 px-4 uppercase font-semibold text-sm md:table-cell">Actions</th>
                    </tr>
                </thead>
                <tbody className="text-gray-300">
                    {paginatedUsers.map(user => (
                         <tr key={user.id} className={`block md:table-row mb-4 md:mb-0 rounded-lg md:rounded-none overflow-hidden ${selectedUsers.includes(user.id) ? 'bg-gray-800' : 'bg-admin-card'} md:bg-transparent border-b border-gray-700`}>
                            <td className="block md:table-cell p-3 md:py-3 md:px-4 text-right md:text-left border-b md:border-none border-gray-700">
                                <span className="md:hidden font-semibold float-left">Select</span>
                                 <input
                                    type="checkbox"
                                    className="form-checkbox h-4 w-4 bg-gray-700 border-gray-600 text-admin-accent rounded focus:ring-admin-accent"
                                    checked={selectedUsers.includes(user.id)}
                                    onChange={() => handleSelectUser(user.id)}
                                />
                            </td>
                            <td className="block md:table-cell p-3 md:py-3 md:px-4 text-right md:text-left border-b md:border-none border-gray-700">
                               <span className="md:hidden font-semibold float-left">User ID</span>
                               {user.id}
                            </td>
                            <td className="block md:table-cell p-3 md:py-3 md:px-4 text-right md:text-left border-b md:border-none border-gray-700">
                                <span className="md:hidden font-semibold float-left">Email</span>
                                {user.email}
                            </td>
                            <td className="block md:table-cell p-3 md:py-3 md:px-4 text-right md:text-left border-b md:border-none border-gray-700">
                                <span className="md:hidden font-semibold float-left">Role</span>
                                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${user.role === 'admin' ? 'bg-blue-600 text-blue-100' : 'bg-gray-600 text-gray-200'}`}>
                                    {user.role.toUpperCase()}
                                </span>
                            </td>
                            <td className="block md:table-cell p-3 md:py-3 md:px-4 text-right md:text-left border-b md:border-none border-gray-700">
                                <span className="md:hidden font-semibold float-left">Tokens</span>
                                <span className="font-mono text-yellow-400">{user.tokens}</span>
                            </td>
                            <td className="block md:table-cell p-3 md:py-3 md:px-4 text-right md:text-left">
                                <span className="md:hidden font-semibold float-left">Actions</span>
                                <div className="flex justify-end md:justify-start gap-4">
                                    <button onClick={() => openTokenModal(user)} className="text-green-400 hover:text-green-300" title="Add tokens">
                                        <ion-icon name="add-circle-outline"></ion-icon>
                                    </button>
                                    <button onClick={() => openEditModal(user)} className="text-yellow-400 hover:text-yellow-300" title="Edit user">
                                        <ion-icon name="pencil-outline"></ion-icon>
                                    </button>
                                    <button onClick={() => setDeleteConfirm(user)} className="text-red-400 hover:text-red-300" title="Delete user">
                                        <ion-icon name="trash-outline"></ion-icon>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            
             {totalPages > 1 && (
                <div className="flex justify-center items-center mt-6 space-x-4">
                    <button
                        onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                        disabled={currentPage === 0}
                        className="px-4 py-2 bg-admin-card rounded-md text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600"
                    >
                        Previous
                    </button>
                    <span className="text-sm text-gray-400">
                        Page {currentPage + 1} of {totalPages}
                    </span>
                    <button
                        onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                        disabled={currentPage >= totalPages - 1}
                        className="px-4 py-2 bg-admin-card rounded-md text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600"
                    >
                        Next
                    </button>
                </div>
            )}

            {/* Modals */}
            {modal && (
                <div className="fixed inset-0 z-[100] bg-black bg-opacity-70 flex items-center justify-center">
                    <div className="bg-admin-card p-6 rounded-lg w-full max-w-md space-y-4">
                        <h3 className="text-xl font-bold">{modal.type === 'ADD' ? 'Add User' : (modal.type === 'EDIT' ? 'Edit User' : 'Add Tokens')}</h3>
                        {['ADD', 'EDIT'].includes(modal.type) && (
                            <>
                                <input type="email" name="email" value={formData.email} onChange={handleFormChange} placeholder="Email" disabled={modal.type === 'EDIT'} className="bg-gray-700 rounded px-3 py-2 w-full disabled:opacity-50"/>
                                {modal.type === 'ADD' && <input type="password" name="password" value={formData.password} onChange={handleFormChange} placeholder="Password" className="bg-gray-700 rounded px-3 py-2 w-full"/>}
                                {modal.type === 'EDIT' && <input type="password" name="password" value={formData.password} onChange={handleFormChange} placeholder="New Password (optional)" className="bg-gray-700 rounded px-3 py-2 w-full"/>}
                                <select name="role" value={formData.role} onChange={handleFormChange} className="bg-gray-700 rounded px-3 py-2 w-full">
                                    <option value="user">User</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </>
                        )}
                        {modal.type === 'ADD_TOKENS' && (
                            <div>
                                <label className="text-sm text-gray-400">Tokens to Add for {modal.user.email}</label>
                                <input type="number" name="tokens" value={formData.tokens} onChange={handleFormChange} className="bg-gray-700 rounded px-3 py-2 w-full mt-1"/>
                            </div>
                        )}
                        <div className="flex justify-end gap-4">
                            <button onClick={() => setModal(null)} className="bg-gray-600 hover:opacity-90 text-white font-bold py-2 px-4 rounded-md">Cancel</button>
                            <button onClick={handleSubmit} className="bg-admin-accent hover:opacity-90 text-white font-bold py-2 px-4 rounded-md">Save</button>
                        </div>
                    </div>
                </div>
            )}

            {deleteConfirm && (
                <div className="fixed inset-0 z-[100] bg-black bg-opacity-70 flex items-center justify-center">
                    <div className="bg-admin-card p-6 rounded-lg w-full max-w-md text-center">
                        <h3 className="text-xl font-bold">Are you sure?</h3>
                        <p className="my-4">You want to delete user "{deleteConfirm.email}". This cannot be undone.</p>
                        <div className="flex justify-center gap-4">
                            <button onClick={() => setDeleteConfirm(null)} className="bg-gray-600">Cancel</button>
                            <button onClick={() => handleDelete(deleteConfirm)} className="bg-red-600">Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export { UserManagementTable };
export default UserManagementTable;