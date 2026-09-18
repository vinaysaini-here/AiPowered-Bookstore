"use client";

import { useEffect } from 'react';
import { useAdminStore } from '@/store/adminStore';
import { Users as UsersIcon, Shield, ShieldAlert, Trash2, Mail } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

export default function AdminUsers() {
    const { users, fetchUsers, toggleUserRole, deleteUser, isLoading, error } = useAdminStore();

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handleToggleRole = async (id: string, currentRole: string) => {
        if (confirm(`Are you sure you want to make this user ${currentRole === 'admin' ? 'a regular user' : 'an admin'}?`)) {
            try {
                await toggleUserRole(id);
                toast.success('User role updated');
            } catch (error) {
                toast.error('Failed to update user role');
            }
        }
    };

    const handleDelete = async (id: string, role: string) => {
        if (role === 'admin') {
            toast.error('Cannot delete an admin user directly. Remove admin role first.');
            return;
        }
        if (confirm('Are you sure you want to delete this user? This cannot be undone.')) {
            try {
                await deleteUser(id);
                toast.success('User deleted successfully');
            } catch (error) {
                toast.error('Failed to delete user');
            }
        }
    };

    if (isLoading && users.length === 0) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
            </div>
        );
    }

    if (error) return <div className="text-red-500 bg-red-50 p-4 rounded-xl">{error}</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                    <UsersIcon className="text-purple-500" />
                    User Management
                </h1>
                <div className="bg-purple-50 text-purple-700 px-4 py-2 rounded-lg font-medium text-sm">
                    Total Users: {users.length}
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
                            <tr>
                                <th className="px-6 py-4 font-medium">Name</th>
                                <th className="px-6 py-4 font-medium">Email</th>
                                <th className="px-6 py-4 font-medium">Joined Date</th>
                                <th className="px-6 py-4 font-medium">Role</th>
                                <th className="px-6 py-4 text-right font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {users.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                                        No users found.
                                    </td>
                                </tr>
                            ) : (
                                users.map(user => (
                                    <tr key={user._id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
                                                    {user.name.charAt(0).toUpperCase()}
                                                </div>
                                                <p className="font-medium text-slate-800">{user.name}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-slate-600">
                                            <div className="flex items-center gap-2">
                                                <Mail size={14} className="text-slate-400" />
                                                {user.email}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-slate-600">
                                            {format(new Date(user.createdAt), 'MMM dd, yyyy')}
                                        </td>
                                        <td className="px-6 py-4">
                                            {user.role === 'admin' ? (
                                                <span className="flex items-center gap-1 text-purple-600 bg-purple-50 px-2 py-1 rounded text-xs font-medium w-fit border border-purple-100">
                                                    <Shield size={14} /> Admin
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-1 text-slate-600 bg-slate-100 px-2 py-1 rounded text-xs font-medium w-fit border border-slate-200">
                                                    <UsersIcon size={14} /> User
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right space-x-2">
                                            <button 
                                                onClick={() => handleToggleRole(user._id, user.role)}
                                                className={`p-2 rounded-lg transition-colors ${
                                                    user.role === 'admin' 
                                                        ? 'text-orange-500 hover:bg-orange-50' 
                                                        : 'text-purple-500 hover:bg-purple-50'
                                                }`}
                                                title={user.role === 'admin' ? "Remove Admin" : "Make Admin"}
                                            >
                                                {user.role === 'admin' ? <ShieldAlert size={18} /> : <Shield size={18} />}
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(user._id, user.role)}
                                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Delete User"
                                                disabled={user.role === 'admin'}
                                            >
                                                <Trash2 size={18} className={user.role === 'admin' ? 'opacity-50' : ''} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
