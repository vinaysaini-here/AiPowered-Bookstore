import { create } from 'zustand';
import api from '@/lib/axios';

export interface CartItem {
    _id: string;
    bookId?: string;
    title: string;
    author?: string;
    price: number;
    imageUrl: string;
    qty: number;
    quantity?: number;
    stock?: number;
}

interface CartState {
    cartItems: CartItem[];
    isLoading: boolean;
    fetchCart: () => Promise<void>;
    addToCart: (item: CartItem) => Promise<void>;
    updateQuantity: (id: string, quantity: number) => Promise<void>;
    removeFromCart: (id: string) => Promise<void>;
    clearCart: () => Promise<void>;
}

const applyCart = (data: any) => ({
    cartItems: data?.items || [],
});

export const useCartStore = create<CartState>((set) => ({
    cartItems: [],
    isLoading: false,

    fetchCart: async () => {
        set({ isLoading: true });
        try {
            const { data } = await api.get('/cart');
            set({ ...applyCart(data), isLoading: false });
        } catch {
            set({ cartItems: [], isLoading: false });
        }
    },

    addToCart: async (item) => {
        const { data } = await api.post('/cart', {
            bookId: item.bookId || item._id,
            quantity: item.qty || 1,
        });
        set(applyCart(data));
    },

    updateQuantity: async (id, quantity) => {
        const { data } = await api.put(`/cart/${id}`, { quantity });
        set(applyCart(data));
    },

    removeFromCart: async (id) => {
        const { data } = await api.delete(`/cart/${id}`);
        set(applyCart(data));
    },

    clearCart: async () => {
        await api.delete('/cart');
        set({ cartItems: [] });
    },
}));
