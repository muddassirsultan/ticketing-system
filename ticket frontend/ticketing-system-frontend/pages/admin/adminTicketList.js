import { useState } from 'react';
import { assignTicket, adminUpdateTicketStatus } from '../../services/adminService';
import Link from 'next/link';

export default function AdminTicketList({ tickets, users, onTicketUpdate }) {
    const [editingTicketId, setEditingTicketId] = useState(null);
    const [selectedAssignee, setSelectedAssignee] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const supportAgents = users.filter(user => user.role === 'SUPPORT_AGENT');

    const handleEditClick = (ticket) => {
        setEditingTicketId(ticket.id);
        setSelectedAssignee(ticket.assigneeUsername || '');
        setSelectedStatus(ticket.status);
    };

    const handleCancel = () => {
        setEditingTicketId(null);
        setError('');
    };

    const handleSave = async (ticketId) => {
        setIsLoading(true);
        setError('');
        try {
            // Find the user ID from the selected username
            const agent = users.find(u => u.username === selectedAssignee);
            if (agent) {
                await assignTicket(ticketId, agent.id);
            }
            await adminUpdateTicketStatus(ticketId, selectedStatus);
            onTicketUpdate();
            setEditingTicketId(null);
        } catch (err) {
            setError('Failed to update ticket.');
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
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subject</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Owner</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Assignee</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {tickets.map((ticket) => (
                        <tr key={ticket.id}>
                            <td className="px-6 py-4 text-sm font-medium text-blue-600 hover:text-blue-800">
                                <Link href={`/tickets/${ticket.id}`} legacyBehavior><a>{ticket.subject}</a></Link>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500">{ticket.ownerUsername}</td>
                            <td className="px-6 py-4 text-sm text-gray-500">
                                {editingTicketId === ticket.id ? (
                                    <select value={selectedAssignee} onChange={e => setSelectedAssignee(e.target.value)} className="rounded-md">
                                        <option value="">Unassigned</option>
                                        {supportAgents.map(agent => <option key={agent.id} value={agent.username}>{agent.username}</option>)}
                                    </select>
                                ) : (
                                    ticket.assigneeUsername || 'Unassigned'
                                )}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500">
                                {editingTicketId === ticket.id ? (
                                    <select value={selectedStatus} onChange={e => setSelectedStatus(e.target.value)} className="rounded-md">
                                        <option>OPEN</option>
                                        <option>IN_PROGRESS</option>
                                        <option>RESOLVED</option>
                                        <option>CLOSED</option>
                                    </select>
                                ) : (
                                    ticket.status
                                )}
                            </td>
                            <td className="px-6 py-4 text-right text-sm font-medium">
                                {editingTicketId === ticket.id ? (
                                    <>
                                        <button onClick={() => handleSave(ticket.id)} className="text-blue-600 hover:text-blue-900" disabled={isLoading}>Save</button>
                                        <button onClick={handleCancel} className="ml-4 text-gray-600 hover:text-gray-900">Cancel</button>
                                    </>
                                ) : (
                                    <button onClick={() => handleEditClick(ticket)} className="text-blue-600 hover:text-blue-900">Edit</button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

