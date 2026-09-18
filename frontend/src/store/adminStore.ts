import { create } from 'zustand';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
};

interface AdminState {
    stats: any;
    orders: any[];
    users: any[];
    reports: any;
    isLoading: boolean;
    error: string | null;
    fetchStats: () => Promise<void>;
    fetchOrders: (filters?: { status?: string; startDate?: string; endDate?: string }) => Promise<void>;
    updateOrderStatus: (id: string, updates: any) => Promise<void>;
    fetchUsers: () => Promise<void>;
    toggleUserRole: (id: string) => Promise<void>;
    deleteUser: (id: string) => Promise<void>;
    fetchReports: () => Promise<void>;
}

export const useAdminStore = create<AdminState>((set, get) => ({
    stats: null,
    orders: [],
    users: [],
    reports: null,
    isLoading: false,
    error: null,

    fetchStats: async () => {
        set({ isLoading: true, error: null });
        try {
            const { data } = await axios.get(`${API_URL}/admin/stats`, getAuthHeaders());
            set({ stats: data, isLoading: false });
        } catch (error: any) {
            set({ error: error.response?.data?.message || 'Failed to fetch stats', isLoading: false });
        }
    },

    fetchOrders: async (filters = {}) => {
        set({ isLoading: true, error: null });
        try {
            const params = new URLSearchParams();
            if (filters.status && filters.status !== 'All') params.set('status', filters.status);
            if (filters.startDate) params.set('startDate', filters.startDate);
            if (filters.endDate) params.set('endDate', filters.endDate);
            const query = params.toString() ? `?${params.toString()}` : '';
            const { data } = await axios.get(`${API_URL}/admin/orders${query}`, getAuthHeaders());
            set({ orders: data, isLoading: false });
        } catch (error: any) {
            set({ error: error.response?.data?.message || 'Failed to fetch orders', isLoading: false });
        }
    },

    updateOrderStatus: async (id, updates) => {
        try {
            const { data } = await axios.put(`${API_URL}/admin/order/${id}/status`, updates, getAuthHeaders());
            const updatedOrders = get().orders.map(order => order._id === id ? data : order);
            set({ orders: updatedOrders });
        } catch (error: any) {
            set({ error: error.response?.data?.message || 'Failed to update order' });
            throw error;
        }
    },

    fetchUsers: async () => {
        set({ isLoading: true, error: null });
        try {
            const { data } = await axios.get(`${API_URL}/admin/users`, getAuthHeaders());
            set({ users: data, isLoading: false });
        } catch (error: any) {
            set({ error: error.response?.data?.message || 'Failed to fetch users', isLoading: false });
        }
    },

    toggleUserRole: async (id) => {
        try {
            const { data } = await axios.put(`${API_URL}/admin/user/${id}/role`, {}, getAuthHeaders());
            const updatedUsers = get().users.map(user => user._id === id ? { ...user, role: data.role } : user);
            set({ users: updatedUsers });
        } catch (error: any) {
            set({ error: error.response?.data?.message || 'Failed to update user role' });
            throw error;
        }
    },

    deleteUser: async (id) => {
        try {
            await axios.delete(`${API_URL}/admin/user/${id}`, getAuthHeaders());
            const updatedUsers = get().users.filter(user => user._id !== id);
            set({ users: updatedUsers });
        } catch (error: any) {
            set({ error: error.response?.data?.message || 'Failed to delete user' });
            throw error;
        }
    },

    fetchReports: async () => {
        set({ isLoading: true, error: null });
        try {
            const { data } = await axios.get(`${API_URL}/admin/reports`, getAuthHeaders());
            set({ reports: data, isLoading: false });
        } catch (error: any) {
            set({ error: error.response?.data?.message || 'Failed to fetch reports', isLoading: false });
        }
    }
}));
