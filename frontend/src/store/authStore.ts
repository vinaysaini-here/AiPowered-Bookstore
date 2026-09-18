import { create } from 'zustand';

interface AuthState {
    user: any | null;
    token: string | null;
    setUser: (userData: any, userToken: string) => void;
    logout: () => void;
    checkAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    token: null,
    setUser: (userData, userToken) => {
        set({ user: userData, token: userToken });
        if (typeof window !== 'undefined') {
            localStorage.setItem('user', JSON.stringify(userData));
            localStorage.setItem('token', userToken);
        }
    },
    logout: () => {
        set({ user: null, token: null });
        if (typeof window !== 'undefined') {
            localStorage.removeItem('user');
            localStorage.removeItem('token');
        }
    },
    checkAuth: () => {
        if (typeof window !== 'undefined') {
            const userStr = localStorage.getItem('user');
            const token = localStorage.getItem('token');
            if (userStr && token) {
                try {
                    const user = JSON.parse(userStr);
                    set({ user, token });
                } catch {
                    localStorage.removeItem('user');
                    localStorage.removeItem('token');
                }
            }
        }
    }
}));
