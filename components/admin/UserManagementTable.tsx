import React, { useState } from 'react';
import '../../types';
import type { User } from '../../types';

interface UserManagementTableProps {
    users: User[];
    onUpdate: (users: User[]) => void;
}

const USERS_PER_PAGE = 8;

const UserManagementTable: React.FC<UserManagementTableProps> = ({ users, onUpdate }) => {
    const [currentPage, setCurrentPage] = useState(0);
    const [modal, setModal] = useState<null | { type: 'ADD' } | { type: 'EDIT'; user: User }>(null);
    const [deleteConfirm, setDeleteConfirm] = useState<User | null>(null);
    const [formData, setFormData] = useState({ id: 0, email: '', password: '', role: 'user' as 'user' | 'admin' });
    
    const totalPages = Math.ceil(users.length / USERS_PER_PAGE);
    const paginatedUsers = users.slice(currentPage * USERS_PER_PAGE, (currentPage + 1) * USERS_PER_PAGE);

    const openAddModal = () => {
        setFormData({ id: 0, email: '', password: '', role: 'user' });
        setModal({ type: 'ADD' });
    };

    const openEditModal = (user: User) => {
        setFormData({ ...user, password: '' }); // Don't pre-fill password for editing
        setModal({ type: 'EDIT', user });
    };

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
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
            };
            onUpdate([...users, newUser]);
        } else if (modal?.type === 'EDIT') {
            const updatedUsers = users.map(u => {
                if (u.id === formData.id) {
                    return {
                        ...u,
                        role: formData.role,
                        // Only update password if a new one was entered
                        password: formData.password ? formData.password : u.password,
                    };
                }
                return u;
            });
            onUpdate(updatedUsers);
        }
        setModal(null);
    };

    const handleDelete = (userToDelete: User) => {
        const updatedUsers = users.filter(u => u.id !== userToDelete.id);
        onUpdate(updatedUsers);
        setDeleteConfirm(null);
    };

    return (
        <div className="overflow-x-auto">
             <div className="mb-6">
                <button onClick={openAddModal} className="bg-admin-accent hover:opacity-90 text-white font-bold py-2 px-4 rounded-md">
                    Add New User
                </button>
            </div>
            <table className="min-w-full bg-admin-card rounded-lg">
                <thead className="bg-gray-700">
                    <tr>
                        <th className="text-left py-3 px-4 uppercase font-semibold text-sm">User ID</th>
                        <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Email</th>
                        <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Role</th>
                        <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Actions</th>
                    </tr>
                </thead>
                <tbody className="text-gray-300">
                    {paginatedUsers.map(user => (
                         <tr key={user.id} className="border-b border-gray-700 hover:bg-gray-800">
                            <td className="py-3 px-4">{user.id}</td>
                            <td className="py-3 px-4">{user.email}</td>
                            <td className="py-3 px-4">
                                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${user.role === 'admin' ? 'bg-blue-600 text-blue-100' : 'bg-gray-600 text-gray-200'}`}>
                                    {user.role.toUpperCase()}
                                </span>
                            </td>
                            <td className="py-3 px-4 flex gap-4">
                                <button onClick={() => openEditModal(user)} className="text-yellow-400 hover:text-yellow-300" title="Edit user">
                                    <ion-icon name="pencil-outline"></ion-icon>
                                </button>
                                <button onClick={() => setDeleteConfirm(user)} className="text-red-400 hover:text-red-300" title="Delete user">
                                     <ion-icon name="trash-outline"></ion-icon>
                                </button>
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
            
            {/* Add/Edit Modal */}
            {modal && (
                 <div className="fixed inset-0 z-[100] bg-black bg-opacity-70 flex items-center justify-center">
                    <div className="bg-admin-card p-6 rounded-lg w-full max-w-md space-y-4">
                        <h3 className="text-xl font-bold">{modal.type === 'ADD' ? 'Add New User' : 'Edit User'}</h3>
                        <div>
                            <label className="text-sm text-gray-400">Email</label>
                            <input type="email" name="email" value={formData.email} onChange={handleFormChange} disabled={modal.type === 'EDIT'} className="bg-gray-700 rounded px-3 py-2 w-full mt-1 disabled:opacity-50"/>
                        </div>
                        <div>
                            <label className="text-sm text-gray-400">Password</label>
                            <input type="password" name="password" value={formData.password} onChange={handleFormChange} placeholder={modal.type === 'EDIT' ? 'Leave blank to keep current password' : ''} className="bg-gray-700 rounded px-3 py-2 w-full mt-1"/>
                        </div>
                         <div>
                            <label className="text-sm text-gray-400">Role</label>
                            <select name="role" value={formData.role} onChange={handleFormChange} className="bg-gray-700 rounded px-3 py-2 w-full mt-1">
                                <option value="user">User</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>
                        <div className="flex justify-end gap-4 pt-4">
                            <button onClick={() => setModal(null)} className="bg-gray-600 hover:opacity-90 text-white font-bold py-2 px-4 rounded-md">Cancel</button>
                            <button onClick={handleSubmit} className="bg-admin-accent hover:opacity-90 text-white font-bold py-2 px-4 rounded-md">
                                {modal.type === 'ADD' ? 'Add User' : 'Save Changes'}
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
                            You are about to delete the user <span className="font-semibold text-white">{deleteConfirm.email}</span>.
                            This action cannot be undone.
                        </p>
                        <div className="flex justify-center gap-4 pt-4">
                            <button onClick={() => setDeleteConfirm(null)} className="bg-gray-600 hover:opacity-90 text-white font-bold py-2 px-4 rounded-md">
                                Cancel
                            </button>
                            <button onClick={() => handleDelete(deleteConfirm)} className="bg-red-600 hover:bg-red-500 text-white font-bold py-2 px-4 rounded-md">
                                Delete User
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserManagementTable;
