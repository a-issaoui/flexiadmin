// src/lib/cookies/sidebar/sidebar-cookie.client.ts
import Cookies from 'js-cookie';
import { appConfig } from '@/config/app.config';
import { SidebarData, COOKIE_NAME } from './sidebar-cookie.types';

// Re-export SidebarData for convenience
export type { SidebarData } from './sidebar-cookie.types';

// Default sidebar data
const DEFAULT_SIDEBAR_DATA: SidebarData = {
    open: appConfig.ui.sidebar.defaultOpen,
    openMobile: appConfig.ui.sidebar.defaultOpenMobile,
    side: appConfig.ui.sidebar.defaultSide,
    variant: appConfig.ui.sidebar.defaultVariant,
    collapsible: appConfig.ui.sidebar.defaultCollapsible,
};

/** 🍪 Parse sidebar data from cookie string */
function parseSidebarData(cookieValue: string | undefined): SidebarData {
    if (!cookieValue) return DEFAULT_SIDEBAR_DATA;

    try {
        const parsed = JSON.parse(cookieValue) as SidebarData;

        // Validate the parsed data
        if (
            parsed &&
            typeof parsed === 'object' &&
            typeof parsed.open === 'boolean' &&
            typeof parsed.openMobile === 'boolean' &&
            ['left', 'right'].includes(parsed.side) &&
            ['sidebar', 'floating', 'inset'].includes(parsed.variant) &&
            ['offcanvas', 'icon', 'none'].includes(parsed.collapsible)
        ) {
            return parsed;
        }
    } catch (error) {
        console.warn('Failed to parse sidebar cookie:', error);
    }

    return DEFAULT_SIDEBAR_DATA;
}

/** 🍪 Client-side: Get sidebar data from cookie */
export function getSidebarDataClient(): SidebarData {
    if (typeof window === 'undefined') return DEFAULT_SIDEBAR_DATA;

    try {
        const raw = Cookies.get(COOKIE_NAME);
        return parseSidebarData(raw);
    } catch (error) {
        console.warn('Failed to get sidebar cookie on client:', error);
        return DEFAULT_SIDEBAR_DATA;
    }
}

/** 🍪 Client-side: Set sidebar data cookie */
export function setSidebarDataClient(sidebarData: Partial<SidebarData>): boolean {
    if (typeof window === 'undefined') return false;

    try {
        const fullData: SidebarData = {
            ...DEFAULT_SIDEBAR_DATA,
            ...sidebarData,
        };

        Cookies.set(COOKIE_NAME, JSON.stringify(fullData), {
            path: '/',
            expires: 365,
            sameSite: 'Lax',
        });

        return true;
    } catch (error) {
        console.error('Failed to set sidebar cookie:', error);
        return false;
    }
}

/** 🍪 Client-side: Remove sidebar cookie */
export function removeSidebarDataClient(): void {
    if (typeof window === 'undefined') return;

    try {
        Cookies.remove(COOKIE_NAME, { path: '/' });
    } catch (error) {
        console.error('Failed to remove sidebar cookie:', error);
    }
}

/** 🍪 Client-side: Check if sidebar cookie exists */
export function hasSidebarDataClient(): boolean {
    if (typeof window === 'undefined') return false;

    try {
        return !!Cookies.get(COOKIE_NAME);
    } catch (error) {
        console.warn('Failed to check sidebar cookie existence:', error);
        return false;
    }
}