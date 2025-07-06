// src/stores/layout.store.ts

import { create } from 'zustand';
import { persist, subscribeWithSelector, createJSONStorage } from 'zustand/middleware';
import Cookies from 'universal-cookie';
import type { LocaleCode, TextDirection } from '@/types/locale.types';

// -- Cookie Storage Setup --
const cookies = new Cookies();
const cookieName = `${process.env.NEXT_PUBLIC_APP_NAME || 'NEXT'}_LAYOUT`;

const cookieStorage = {
    getItem: (name: string): string | null => {
        try {
            return cookies.get(name) || null;
        } catch {
            return null;
        }
    },
    setItem: (name: string, value: string): void => {
        try {
            cookies.set(name, value, {
                path: '/',
                sameSite: 'lax',
                secure: process.env.NODE_ENV === 'production',
                maxAge: 60 * 60 * 24 * 365,
            });
        } catch (error) {
            console.warn('Failed to set cookie:', error);
        }
    },
    removeItem: (name: string): void => {
        try {
            cookies.remove(name, { path: '/' });
        } catch (error) {
            console.warn('Failed to remove cookie:', error);
        }
    },
};

// -- Types --
interface SSRInitialState {
    locale: { language: LocaleCode; direction: TextDirection };
    sidebar: { isOpen: boolean };
    device: { isMobile: boolean };
    theme: { mode: 'light' | 'dark' | 'system' };
}

interface LayoutState {
    sidebar: {
        isOpen: boolean;
        isMobileOpen: boolean;
        sidebarVariant: 'sidebar' | 'floating' | 'inset';
        expandedItems: Set<string>;
        activePath: string | null;
        collapsedGroups: Set<string>;
    };
    theme: {
        mode: 'light' | 'dark' | 'system';
        isDark: boolean;
        transitions: boolean;
    };
    locale: {
        language: LocaleCode;
        direction: TextDirection;
        isLoaded: boolean;
    };
    device: {
        isMobile: boolean;
        isTablet: boolean;
        screenSize: 'sm' | 'md' | 'lg' | 'xl';
        isHydrated: boolean;
    };
    ui: {
        searchOpen: boolean;
        activeDropdown: string | null;
        commandPaletteOpen: boolean;
        notificationsPanelOpen: boolean;
    };
    preferences: {
        compactMode: boolean;
        animationsEnabled: boolean;
        breadcrumbsVisible: boolean;
        soundEnabled: boolean;
    };
}

interface LayoutActions {
    setSidebarOpen: (open: boolean) => void;
    setSidebarVariant: (variant: 'sidebar' | 'floating' | 'inset') => void;
    toggleSidebar: () => void;
    setMobileSidebarOpen: (open: boolean) => void;
    expandNavItem: (itemId: string) => void;
    collapseNavItem: (itemId: string) => void;
    setActivePath: (path: string) => void;
    setTheme: (theme: 'light' | 'dark' | 'system') => void;
    setThemeTransitions: (enabled: boolean) => void;
    setLocale: (language: LocaleCode, direction: TextDirection) => void;
    setLocaleLoaded: (loaded: boolean) => void;
    setDeviceState: (state: Partial<LayoutState['device']>) => void;
    setHydrated: () => void;
    setActiveDropdown: (dropdown: string | null) => void;
    toggleSearch: () => void;
    toggleCommandPalette: () => void;
    toggleNotificationsPanel: () => void;
    updatePreferences: (prefs: Partial<LayoutState['preferences']>) => void;
    initializeFromSSR: (initialState: SSRInitialState) => void;
    reset: () => void;
}

// -- Default State --
const defaultState: LayoutState = {
    sidebar: {
        isOpen: true,
        isMobileOpen: false,
        sidebarVariant: 'sidebar',
        expandedItems: new Set<string>(),
        activePath: null,
        collapsedGroups: new Set<string>(),
    },
    theme: {
        mode: 'system',
        isDark: false,
        transitions: true,
    },
    locale: {
        language: 'en',
        direction: 'ltr',
        isLoaded: false,
    },
    device: {
        isMobile: false,
        isTablet: false,
        screenSize: 'lg',
        isHydrated: false,
    },
    ui: {
        searchOpen: false,
        activeDropdown: null,
        commandPaletteOpen: false,
        notificationsPanelOpen: false,
    },
    preferences: {
        compactMode: false,
        animationsEnabled: true,
        breadcrumbsVisible: true,
        soundEnabled: false,
    },
};

// -- Set Serialization --
const setReplacer = (_key: string, value: unknown) => {
    if (value instanceof Set) {
        return { _type: 'Set', data: [...value] };
    }
    return value;
};

const setReviver = (_key: string, value: unknown) => {
    if (typeof value === 'object' && value !== null && '_type' in value && value._type === 'Set') {
        return new Set((value as { data: unknown[] }).data);
    }
    return value;
};

// -- Store Definition --
export const useLayoutStore = create<LayoutState & LayoutActions>()(
    subscribeWithSelector(
        persist(
            (set, get) => ({
                ...defaultState,

                // Sidebar actions
                setSidebarOpen: (open) => set((state) => ({ sidebar: { ...state.sidebar, isOpen: open } })),
                setSidebarVariant: (variant) =>
                    set((state) => ({ sidebar: { ...state.sidebar, sidebarVariant: variant } })),
                toggleSidebar: () =>
                    set((state) => ({ sidebar: { ...state.sidebar, isOpen: !state.sidebar.isOpen } })),
                setMobileSidebarOpen: (open) =>
                    set((state) => ({ sidebar: { ...state.sidebar, isMobileOpen: open } })),
                expandNavItem: (id) =>
                    set((state) => ({
                        sidebar: {
                            ...state.sidebar,
                            expandedItems: new Set([...state.sidebar.expandedItems, id]),
                        },
                    })),
                collapseNavItem: (id) =>
                    set((state) => {
                        const updated = new Set(state.sidebar.expandedItems);
                        updated.delete(id);
                        return { sidebar: { ...state.sidebar, expandedItems: updated } };
                    }),
                setActivePath: (path) =>
                    set((state) => ({ sidebar: { ...state.sidebar, activePath: path } })),

                // Theme actions
                setTheme: (mode) => set((state) => ({ theme: { ...state.theme, mode } })),
                setThemeTransitions: (transitions) =>
                    set((state) => ({ theme: { ...state.theme, transitions } })),

                // Locale actions
                setLocale: (language, direction) =>
                    set((state) => ({
                        locale: {
                            ...state.locale,
                            language,
                            direction,
                            isLoaded: true
                        }
                    })),
                setLocaleLoaded: (loaded) =>
                    set((state) => ({ locale: { ...state.locale, isLoaded: loaded } })),

                // Device actions
                setDeviceState: (state) =>
                    set((current) => ({ device: { ...current.device, ...state } })),
                setHydrated: () =>
                    set((state) => ({ device: { ...state.device, isHydrated: true } })),

                // UI actions
                setActiveDropdown: (dropdown) =>
                    set((state) => ({ ui: { ...state.ui, activeDropdown: dropdown } })),
                toggleSearch: () =>
                    set((state) => ({ ui: { ...state.ui, searchOpen: !state.ui.searchOpen } })),
                toggleCommandPalette: () =>
                    set((state) => ({
                        ui: {
                            ...state.ui,
                            commandPaletteOpen: !state.ui.commandPaletteOpen
                        }
                    })),
                toggleNotificationsPanel: () =>
                    set((state) => ({
                        ui: {
                            ...state.ui,
                            notificationsPanelOpen: !state.ui.notificationsPanelOpen
                        }
                    })),

                // Preferences actions
                updatePreferences: (prefs) =>
                    set((state) => ({ preferences: { ...state.preferences, ...prefs } })),

                // Initialization
                initializeFromSSR: (initial) =>
                    set(() => ({
                        ...defaultState,
                        sidebar: { ...defaultState.sidebar, isOpen: initial.sidebar.isOpen },
                        locale: { ...defaultState.locale, ...initial.locale, isLoaded: true },
                        device: { ...defaultState.device, isMobile: initial.device.isMobile },
                        theme: { ...defaultState.theme, mode: initial.theme.mode },
                    })),

                reset: () => set(() => defaultState),
            }),
            {
                name: cookieName,
                storage: createJSONStorage(() => cookieStorage, {
                    replacer: setReplacer,
                    reviver: setReviver,
                }),
                partialize: (state) => ({
                    sidebar: {
                        isOpen: state.sidebar.isOpen,
                        expandedItems: state.sidebar.expandedItems,
                        collapsedGroups: state.sidebar.collapsedGroups,
                    },
                    theme: state.theme,
                    locale: {
                        language: state.locale.language,
                        direction: state.locale.direction,
                    },
                    preferences: state.preferences,
                }),
                merge: (persisted, current) => {
                    if (!persisted || typeof persisted !== 'object') return current;

                    return {
                        ...current,
                        ...persisted,
                        sidebar: {
                            ...current.sidebar,
                            ...('sidebar' in persisted ? persisted.sidebar : {}),
                        },
                    };
                },
            }
        )
    )
);

// -- Hooks --
export const useSidebarState = () => useLayoutStore((state) => state.sidebar);
export const useThemeState = () => useLayoutStore((state) => state.theme);
export const useLocaleState = () => useLayoutStore((state) => state.locale);
export const useDeviceState = () => useLayoutStore((state) => state.device);
export const useUIState = () => useLayoutStore((state) => state.ui);
export const usePreferences = () => useLayoutStore((state) => state.preferences);