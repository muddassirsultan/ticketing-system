import { useEffect, useState } from 'react';
import Layout from '../../components/layout/Layout';
import { getAllUsers } from '../../services/adminService';
import UserList from '../../components/admin/UserList';

export default function UserManagementPage() {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchUsers = async () => {
        try {
            setIsLoading(true);
            const data = await getAllUsers();
            setUsers(data);
        } catch (err) {
            setError('Failed to fetch users. You may not have permission to view this page.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // This function will be passed down to the UserList component
    const onUserUpdate = () => {
        fetchUsers(); // Re-fetch users after an update
    };

    return (
        <Layout>
            <div className="p-6">
                <h1 className="text-2xl font-semibold text-gray-900">User Management</h1>
                <div className="mt-8">
                    {isLoading ? (
                        <p>Loading users...</p>
                    ) : error ? (
                        <p className="text-red-500">{error}</p>
                    ) : (
                        <UserList users={users} onUserUpdate={onUserUpdate} />
                    )}
                </div>
            </div>
        </Layout>
    );
}