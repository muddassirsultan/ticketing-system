import axios from 'axios';

const API_URL = 'http://localhost:8080/api/admin';

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error('No authentication token found. Please log in.');
    }
    return { Authorization: `Bearer ${token}` };
};

export const getAllUsers = async () => {
    try {
        const response = await axios.get(`${API_URL}/users`, {
            headers: getAuthHeaders(),
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || new Error('Could not fetch users');
    }
};

export const updateUserRole = async (userId, role) => {
    try {
        const response = await axios.put(`${API_URL}/users/${userId}/role`, { role }, {
            headers: getAuthHeaders(),
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || new Error('Could not update user role');
    }
};

export const getAllTickets = async () => {
    try {
        const response = await axios.get(`${API_URL}/tickets`, {
            headers: getAuthHeaders(),
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || new Error('Could not fetch tickets');
    }
};

export const assignTicket = async (ticketId, assigneeId) => {
    try {
        const response = await axios.put(`${API_URL}/tickets/${ticketId}/assign`, { assigneeId }, {
            headers: getAuthHeaders(),
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || new Error('Could not assign ticket');
    }
};

export const adminUpdateTicketStatus = async (ticketId, status) => {
    try {
        const response = await axios.put(`${API_URL}/tickets/${ticketId}/status`, { status }, {
            headers: getAuthHeaders(),
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || new Error('Could not update ticket status');
    }
};
