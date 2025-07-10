// src/stores/app.store.ts
import { create } from 'zustand';

export interface AppState {
  // UI State
  isLoading: boolean;
  loadingMessage?: string;
  
  // Navigation
  currentPath: string;
  
  // Actions
  setLoading: (loading: boolean, message?: string) => void;
  setCurrentPath: (path: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  // Initial state
  isLoading: false,
  loadingMessage: undefined,
  currentPath: '/',
  
  // Actions
  setLoading: (loading: boolean, message?: string) => 
    set({ isLoading: loading, loadingMessage: message }),
  setCurrentPath: (path: string) => 
    set({ currentPath: path }),
}));