// src/lib/cookies/sidebar/sidebar-cookie.server.ts
import { cookies } from 'next/headers';
import { appConfig } from '@/config/app.config';
import { SidebarData, COOKIE_NAME, COOKIE_MAX_AGE } from './sidebar-cookie.types';

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

/** 🍪 Server-side: Get sidebar data from cookie (App Router) */
export async function getSidebarDataSSR(): Promise<SidebarData> {
    try {
        const cookieStore = await cookies();
        const raw = cookieStore.get(COOKIE_NAME)?.value;
        return parseSidebarData(raw);
    } catch (error) {
        // Silently return default data during static generation
        if (process.env.NODE_ENV === 'development') {
            console.warn('Failed to get sidebar cookie on server:', error);
        }
        return DEFAULT_SIDEBAR_DATA;
    }
}

/** 🍪 Server-side: Get sidebar data from cookie (synchronous - for middleware) */
export function getSidebarDataSSRSync(cookieStore: { get: (name: string) => { value?: string } | undefined }): SidebarData {
    try {
        const raw = cookieStore.get(COOKIE_NAME)?.value;
        return parseSidebarData(raw);
    } catch (error) {
        console.warn('Failed to get sidebar cookie on server:', error);
        return DEFAULT_SIDEBAR_DATA;
    }
}

/** 🍪 Server-side: Set sidebar data cookie in response headers */
export function setSidebarDataSSR(
    response: Response | import('next/server').NextResponse,
    sidebarData: Partial<SidebarData>
): Response | import('next/server').NextResponse {
    try {
        const fullData: SidebarData = {
            ...DEFAULT_SIDEBAR_DATA,
            ...sidebarData,
        };

        response.headers.append(
            'Set-Cookie',
            `${COOKIE_NAME}=${JSON.stringify(fullData)}; Path=/; Max-Age=${COOKIE_MAX_AGE}; SameSite=Lax`
        );
    } catch (error) {
        console.error('Failed to set sidebar cookie on server:', error);
    }

    return response;
}

/** 🍪 Server-side: Set sidebar data cookie in cookies() (App Router server actions) */
export async function setSidebarDataSSRAction(sidebarData: Partial<SidebarData>): Promise<boolean> {
    try {
        const fullData: SidebarData = {
            ...DEFAULT_SIDEBAR_DATA,
            ...sidebarData,
        };

        const cookieStore = await cookies();
        cookieStore.set(COOKIE_NAME, JSON.stringify(fullData), {
            path: '/',
            maxAge: COOKIE_MAX_AGE,
            sameSite: 'lax',
        });

        return true;
    } catch (error) {
        console.error('Failed to set sidebar cookie in server action:', error);
        return false;
    }
}

/** 🍪 Server-side: Remove sidebar cookie */
export async function removeSidebarDataSSR(): Promise<void> {
    try {
        const cookieStore = await cookies();
        cookieStore.delete(COOKIE_NAME);
    } catch (error) {
        console.error('Failed to remove sidebar cookie on server:', error);
    }
}

/** 🍪 Server-side: Check if sidebar cookie exists */
export async function hasSidebarDataSSR(): Promise<boolean> {
    try {
        const cookieStore = await cookies();
        return cookieStore.has(COOKIE_NAME);
    } catch (error) {
        console.warn('Failed to check sidebar cookie existence on server:', error);
        return false;
    }
}

/** 🍪 Pages Router: Get sidebar data from request object */
export function getSidebarDataFromReq(req: { cookies?: Record<string, string> }): SidebarData {
    try {
        if (!req?.cookies) return DEFAULT_SIDEBAR_DATA;
        const raw = req.cookies[COOKIE_NAME];
        return parseSidebarData(raw);
    } catch (error) {
        console.warn('Failed to get sidebar cookie from request:', error);
        return DEFAULT_SIDEBAR_DATA;
    }
}