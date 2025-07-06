// src/stores/sidebar.store.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { subscribeWithSelector } from 'zustand/middleware';
import React from "react";

/**
 * Comprehensive type definitions for our sidebar state.
 * This single interface represents ALL sidebar-related state.
 */
interface SidebarState {
    // Core sidebar open/closed state
    isOpen: boolean;
    isMobileOpen: boolean;

    // Track which navigation items are expanded
    expandedItems: Set<string>;

    // Track the active navigation path
    activePath: string | null;

    // Settings
    defaultItemsExpanded: boolean;

    // Actions (think of these as methods that modify the state)
    setOpen: (open: boolean) => void;
    setMobileOpen: (open: boolean) => void;
    toggleSidebar: () => void;
    toggleMobileSidebar: () => void;

    // Navigation item management
    expandItem: (itemId: string) => void;
    collapseItem: (itemId: string) => void;
    toggleItem: (itemId: string) => void;
    expandAllItems: () => void;
    collapseAllItems: () => void;

    // Active path management
    setActivePath: (path: string) => void;

    // Utility actions
    resetToDefaults: () => void;
}

/**
 * Helper function to safely serialize/deserialize Sets for persistence
 */
const setReplacer = (_key: string, value: any) => {
    if (value instanceof Set) {
        return { _type: 'Set', data: Array.from(value) };
    }
    return value;
};

const setReviver = (_key: string, value: any) => {
    if (value?._type === 'Set') {
        return new Set(value.data);
    }
    return value;
};

/**
 * Create our sidebar store with persistence and subscription capabilities.
 *
 * The beauty of Zustand is that this single store definition contains:
 * - All state
 * - All actions to modify state
 * - Persistence logic
 * - Subscription capabilities
 */
export const useSidebarStore = create<SidebarState>()(
    subscribeWithSelector(
        persist(
            (set, get) => ({
                // Initial state values
                isOpen: true,
                isMobileOpen: false,
                expandedItems: new Set<string>(),
                activePath: null,
                defaultItemsExpanded: true,

                // Core sidebar actions
                setOpen: (open) => set({ isOpen: open }),
                setMobileOpen: (open) => set({ isMobileOpen: open }),

                toggleSidebar: () => set((state) => ({
                    isOpen: !state.isOpen
                })),

                toggleMobileSidebar: () => set((state) => ({
                    isMobileOpen: !state.isMobileOpen
                })),

                // Navigation item management
                expandItem: (itemId) => set((state) => ({
                    expandedItems: new Set(state.expandedItems).add(itemId)
                })),

                collapseItem: (itemId) => set((state) => {
                    const newExpanded = new Set(state.expandedItems);
                    newExpanded.delete(itemId);
                    return { expandedItems: newExpanded };
                }),

                toggleItem: (itemId) => {
                    const state = get();
                    if (state.expandedItems.has(itemId)) {
                        state.collapseItem(itemId);
                    } else {
                        state.expandItem(itemId);
                    }
                },

                expandAllItems: () => set({
                    expandedItems: new Set<string>(),
                    defaultItemsExpanded: true
                }),

                collapseAllItems: () => set({
                    expandedItems: new Set<string>(),
                    defaultItemsExpanded: false
                }),

                // Active path management
                setActivePath: (path) => set({ activePath: path }),

                // Reset functionality
                resetToDefaults: () => set({
                    isOpen: true,
                    isMobileOpen: false,
                    expandedItems: new Set<string>(),
                    activePath: null,
                    defaultItemsExpanded: true,
                }),
            }),
            {
                name: 'flexiadmin-sidebar', // localStorage key
                storage: createJSONStorage(() => localStorage, {
                    replacer: setReplacer,
                    reviver: setReviver,
                }),
                // Only persist certain values
                partialize: (state) => ({
                    isOpen: state.isOpen,
                    expandedItems: state.expandedItems,
                    defaultItemsExpanded: state.defaultItemsExpanded,
                }),
            }
        )
    )
);

/**
 * Convenient hooks for specific sidebar functionality.
 * These make it easier to use just the parts you need in components.
 */

// Hook for sidebar open/closed state
export const useSidebarOpen = () => {
    const isOpen = useSidebarStore((state) => state.isOpen);
    const setOpen = useSidebarStore((state) => state.setOpen);
    const toggleSidebar = useSidebarStore((state) => state.toggleSidebar);

    return { isOpen, setOpen, toggleSidebar };
};

// Hook for mobile sidebar
export const useMobileSidebar = () => {
    const isMobileOpen = useSidebarStore((state) => state.isMobileOpen);
    const setMobileOpen = useSidebarStore((state) => state.setMobileOpen);
    const toggleMobileSidebar = useSidebarStore((state) => state.toggleMobileSidebar);

    return { isMobileOpen, setMobileOpen, toggleMobileSidebar };
};

// Hook for navigation item expansion
export const useNavigationItemExpanded = (itemId: string) => {
    const expandedItems = useSidebarStore((state) => state.expandedItems);
    const defaultExpanded = useSidebarStore((state) => state.defaultItemsExpanded);
    const toggleItem = useSidebarStore((state) => state.toggleItem);

    // Determine if this item should be expanded
    const isExpanded = expandedItems.has(itemId) ||
        (expandedItems.size === 0 && defaultExpanded);

    return { isExpanded, toggleItem: () => toggleItem(itemId) };
};

// Hook to sync active path with current route
export const useSyncActivePath = (pathname: string) => {
    const setActivePath = useSidebarStore((state) => state.setActivePath);

    React.useEffect(() => {
        setActivePath(pathname);
    }, [pathname, setActivePath]);
};