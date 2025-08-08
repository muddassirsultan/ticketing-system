import { useEffect, useState } from 'react';
import Layout from '../../components/layout/Layout';
import { getAllTickets, getAllUsers } from '../../services/adminService';
import AdminTicketList from '../../components/admin/AdminTicketList';

export default function AdminTicketPage() {
    const [tickets, setTickets] = useState([]);
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchData = async () => {
        try {
            setIsLoading(true);
            const [ticketData, userData] = await Promise.all([
                getAllTickets(),
                getAllUsers()
            ]);
            setTickets(ticketData);
            setUsers(userData);
        } catch (err) {
            setError('Failed to fetch data. You may not have permission to view this page.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const onTicketUpdate = () => {
        fetchData(); // Re-fetch all data after an update
    };

    return (
        <Layout>
            <div className="p-6">
                <h1 className="text-2xl font-semibold text-gray-900">Admin - All Tickets</h1>
                <div className="mt-8">
                    {isLoading ? (
                        <p>Loading...</p>
                    ) : error ? (
                        <p className="text-red-500">{error}</p>
                    ) : (
                        <AdminTicketList tickets={tickets} users={users} onTicketUpdate={onTicketUpdate} />
                    )}
                </div>
            </div>
        </Layout>
    );
}