import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { jwtDecode } from 'jwt-decode';
import Layout from '../../components/layout/Layout';
import { getTicketById, addComment, updateTicketStatus } from '../../services/ticketService';
import Button from '../../components/ui/Button';

export default function TicketDetailPage() {
    const router = useRouter();
    const { id } = router.query;
    const [ticket, setTicket] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [newComment, setNewComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [userRole, setUserRole] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const decoded = jwtDecode(token);
            setUserRole(decoded.authorities[0]);
        }
    }, []);

    const fetchTicket = async () => {
        if (!id) return;
        try {
            setIsLoading(true);
            const data = await getTicketById(id);
            setTicket(data);
        } catch (err) {
            setError('Failed to fetch ticket details.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTicket();
    }, [id]);

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;
        setIsSubmitting(true);
        try {
            await addComment(id, newComment);
            setNewComment('');
            fetchTicket();
        } catch (err) {
            setError('Failed to add comment.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleStatusChange = async (newStatus) => {
        try {
            await updateTicketStatus(id, newStatus);
            fetchTicket();
        } catch (err) {
            setError('Failed to update status.');
        }
    };

    if (isLoading) return <Layout><p>Loading...</p></Layout>;
    if (error) return <Layout><p className="text-red-500">{error}</p></Layout>;
    if (!ticket) return <Layout><p>Ticket not found.</p></Layout>;

    const canChangeStatus = userRole === 'SUPPORT_AGENT' || userRole === 'ADMIN';

    return (
        <Layout>
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                    <div>
                        <h3 className="text-lg leading-6 font-medium text-gray-900">Ticket Details</h3>
                        <p className="mt-1 max-w-2xl text-sm text-gray-500">Subject: {ticket.subject}</p>
                    </div>
                    {canChangeStatus && (
                        <div className="flex items-center space-x-2">
                            <label htmlFor="status" className="text-sm font-medium text-gray-500">Change Status:</label>
                            <select
                                id="status"
                                value={ticket.status}
                                onChange={(e) => handleStatusChange(e.target.value)}
                                className="rounded-md border-gray-300"
                            >
                                <option>OPEN</option>
                                <option>IN_PROGRESS</option>
                                <option>RESOLVED</option>
                                <option>CLOSED</option>
                            </select>
                        </div>
                    )}
                </div>
                <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                    <dl className="sm:divide-y sm:divide-gray-200">
                        {/* ... other details ... */}
                        <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">Description</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 whitespace-pre-wrap">{ticket.description}</dd>
                        </div>
                    </dl>
                </div>
            </div>

            <div className="mt-8">
                <h3 className="text-lg font-medium text-gray-900">Comment History</h3>
                <div className="mt-4 space-y-4">
                    {ticket.comments.length > 0 ? (
                        ticket.comments.map(comment => (
                            <div key={comment.id} className="bg-white p-4 rounded-lg shadow">
                                <p className="text-sm text-gray-800">{comment.content}</p>
                                <p className="mt-2 text-xs text-gray-500">
                                    By {comment.authorUsername} on {new Date(comment.createdAt).toLocaleString()}
                                </p>
                            </div>
                        ))
                    ) : (
                        <p className="text-sm text-gray-500">No comments yet.</p>
                    )}
                </div>
            </div>

            <div className="mt-8">
                <form onSubmit={handleCommentSubmit} className="bg-white p-4 rounded-lg shadow">
                    <label htmlFor="comment" className="block text-sm font-medium text-gray-700">Add a new comment</label>
                    <textarea
                        id="comment"
                        rows="3"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                        required
                    ></textarea>
                    <div className="mt-2 text-right">
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Submitting...' : 'Add Comment'}
                        </Button>
                    </div>
                </form>
            </div>
        </Layout>
    );
}
