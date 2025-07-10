// src/stores/user.store.ts
import { create } from 'zustand';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: string;
}

export interface UserState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // Actions
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  // Initial state
  user: null,
  isAuthenticated: false,
  isLoading: false,
  
  // Actions
  setUser: (user: User | null) => 
    set({ user, isAuthenticated: !!user }),
  setLoading: (loading: boolean) => 
    set({ isLoading: loading }),
  logout: () => 
    set({ user: null, isAuthenticated: false }),
}));