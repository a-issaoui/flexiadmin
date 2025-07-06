// src/utils/zustand-cookie-storage.ts
import Cookies from 'universal-cookie';

const cookies = new Cookies();

export const cookieStorage = {
    getItem: (name: string): string | null => {
        return cookies.get(name) || null;
    },
    setItem: (name: string, value: string): void => {
        cookies.set(name, value, { path: '/', sameSite: 'lax' });
    },
    removeItem: (name: string): void => {
        cookies.remove(name, { path: '/' });
    },
};
