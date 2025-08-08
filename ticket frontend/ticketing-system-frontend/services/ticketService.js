import axios from 'axios';

const API_URL = 'http://localhost:8080/api/tickets';

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error('No authentication token found. Please log in.');
    }
    return { Authorization: `Bearer ${token}` };
};

export const createTicket = async (ticketData) => {
    try {
        const response = await axios.post(API_URL, ticketData, {
            headers: getAuthHeaders(),
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || new Error('Could not create ticket');
    }
};

export const getMyTickets = async () => {
    try {
        const response = await axios.get(API_URL, {
            headers: getAuthHeaders(),
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || new Error('Could not fetch tickets');
    }
};

export const getAssignedTickets = async () => {
    try {
        const response = await axios.get(`${API_URL}/assigned`, {
            headers: getAuthHeaders(),
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || new Error('Could not fetch assigned tickets');
    }
};

export const getTicketById = async (ticketId) => {
    try {
        const response = await axios.get(`${API_URL}/${ticketId}`, {
            headers: getAuthHeaders(),
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || new Error('Could not fetch ticket details');
    }
};

export const addComment = async (ticketId, content) => {
    try {
        const response = await axios.post(`${API_URL}/${ticketId}/comments`, { content }, {
            headers: getAuthHeaders(),
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || new Error('Could not add comment');
    }
};

export const updateTicketStatus = async (ticketId, status) => {
    try {
        const response = await axios.put(`${API_URL}/${ticketId}/status`, { status }, {
            headers: getAuthHeaders(),
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || new Error('Could not update ticket status');
    }
};
