import { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import Layout from '../../components/layout/Layout';
import TicketModal from '../../components/tickets/TicketModal';
import TicketList from '../../components/tickets/TicketList';
import { getMyTickets, getAssignedTickets } from '../../services/ticketService';

export default function DashboardPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [tickets, setTickets] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [userRole, setUserRole] = useState(null);
    const [viewTitle, setViewTitle] = useState('My Tickets');

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const decoded = jwtDecode(token);
            const role = decoded.authorities[0];
            setUserRole(role);
            fetchTickets(role);
        }
    }, []);

    const fetchTickets = async (role) => {
        try {
            setIsLoading(true);
            let data;
            if (role === 'SUPPORT_AGENT') {
                setViewTitle('Tickets Assigned to Me');
                data = await getAssignedTickets();
            } else {
                setViewTitle('My Created Tickets');
                data = await getMyTickets();
            }
            setTickets(data);
        } catch (err) {
            setError('Failed to fetch tickets.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleTicketCreated = () => {
        setIsModalOpen(false);
        fetchTickets(userRole);
    };

    return (
        <Layout>
            <div className="p-6">
                <h1 className="text-2xl font-semibold text-gray-900">My Dashboard</h1>
                <div className="mt-8">
                    <div className="flex justify-between items-center">
                        <h2 className="text-lg font-medium text-gray-800">{viewTitle}</h2>
                        {userRole === 'USER' && (
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                            >
                                Create New Ticket
                            </button>
                        )}
                    </div>
                    <div className="mt-4">
                        {isLoading ? (
                            <p>Loading tickets...</p>
                        ) : error ? (
                            <p className="text-red-500">{error}</p>
                        ) : (
                            <TicketList tickets={tickets} />
                        )}
                    </div>
                </div>
            </div>

            {isModalOpen && (
                <TicketModal
                    onClose={() => setIsModalOpen(false)}
                    onTicketCreated={handleTicketCreated}
                />
            )}
        </Layout>
    );
}

