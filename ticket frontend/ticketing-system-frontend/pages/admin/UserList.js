import { useState } from 'react';
import { updateUserRole } from '../../services/adminService';

export default function UserList({ users, onUserUpdate }) {
    const [editingUserId, setEditingUserId] = useState(null);
    const [selectedRole, setSelectedRole] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleRoleChangeClick = (user) => {
        setEditingUserId(user.id);
        setSelectedRole(user.role);
    };

    const handleSave = async (userId) => {
        setIsLoading(true);
        setError('');
        try {
            await updateUserRole(userId, selectedRole);
            setEditingUserId(null);
            onUserUpdate(); // Notify parent to refresh the user list
        } catch (err) {
            setError('Failed to update role.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
            {error && <p className="p-4 text-sm text-red-600">{error}</p>}
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Username</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((user) => (
                        <tr key={user.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.username}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {editingUserId === user.id ? (
                                    <select
                                        value={selectedRole}
                                        onChange={(e) => setSelectedRole(e.target.value)}
                                        className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                                    >
                                        <option>USER</option>
                                        <option>SUPPORT_AGENT</option>
                                        <option>ADMIN</option>
                                    </select>
                                ) : (
                                    user.role
                                )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                {editingUserId === user.id ? (
                                    <>
                                        <button onClick={() => handleSave(user.id)} className="text-blue-600 hover:text-blue-900" disabled={isLoading}>
                                            {isLoading ? 'Saving...' : 'Save'}
                                        </button>
                                        <button onClick={() => setEditingUserId(null)} className="ml-4 text-gray-600 hover:text-gray-900">Cancel</button>
                                    </>
                                ) : (
                                    <button onClick={() => handleRoleChangeClick(user)} className="text-blue-600 hover:text-blue-900">Change Role</button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
