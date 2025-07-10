// src/lib/cookies/mobile-cookie.server.ts
import { cookies } from 'next/headers';
import { appConfig } from '@/config/app.config';
import { MOBILE_CONSTANTS, MobileData } from './mobile-cookie.types';

const COOKIE_NAME = appConfig.cookies.mobile;
const COOKIE_MAX_AGE = MOBILE_CONSTANTS.MOBILE_COOKIE_MAX_AGE;

// Re-export MobileData for convenience
export type { MobileData } from './mobile-cookie.types';

// Default mobile data
const DEFAULT_MOBILE_DATA: MobileData = {
    isMobile: false,
    breakpoint: MOBILE_CONSTANTS.MOBILE_BREAKPOINT,
};

/** 🍪 Parse mobile data from cookie string */
function parseMobileData(cookieValue: string | undefined): MobileData {
    if (!cookieValue) return DEFAULT_MOBILE_DATA;

    try {
        const parsed = JSON.parse(cookieValue) as MobileData;

        // Validate the parsed data
        if (
            parsed &&
            typeof parsed === 'object' &&
            typeof parsed.isMobile === 'boolean' &&
            typeof parsed.breakpoint === 'number'
        ) {
            return parsed;
        }
    } catch (error) {
        console.warn('Failed to parse mobile cookie:', error);
    }

    return DEFAULT_MOBILE_DATA;
}

/** 🍪 Server-side: Get mobile data from cookie (App Router) */
export async function getMobileDataSSR(): Promise<MobileData> {
    try {
        const cookieStore = await cookies();
        const raw = cookieStore.get(COOKIE_NAME)?.value;
        return parseMobileData(raw);
    } catch (error) {
        // Silently return default data during static generation
        if (process.env.NODE_ENV === 'development') {
            console.warn('Failed to get mobile cookie on server:', error);
        }
        return DEFAULT_MOBILE_DATA;
    }
}

/** 🍪 Server-side: Get mobile data from cookie (synchronous - for middleware) */
export function getMobileDataSSRSync(cookieStore: { get: (name: string) => { value?: string } | undefined }): MobileData {
    try {
        const raw = cookieStore.get(COOKIE_NAME)?.value;
        return parseMobileData(raw);
    } catch (error) {
        console.warn('Failed to get mobile cookie on server:', error);
        return DEFAULT_MOBILE_DATA;
    }
}

/** 🍪 Server-side: Set mobile data cookie in response headers */
export function setMobileDataSSR(
    response: Response | import('next/server').NextResponse,
    mobileData: Partial<MobileData>
): Response | import('next/server').NextResponse {
    try {
        const fullData: MobileData = {
            ...DEFAULT_MOBILE_DATA,
            ...mobileData,
        };

        response.headers.append(
            'Set-Cookie',
            `${COOKIE_NAME}=${JSON.stringify(fullData)}; Path=/; Max-Age=${COOKIE_MAX_AGE}; SameSite=Lax`
        );
    } catch (error) {
        console.error('Failed to set mobile cookie on server:', error);
    }

    return response;
}

/** 🍪 Server-side: Set mobile data cookie in cookies() (App Router server actions) */
export async function setMobileDataSSRAction(mobileData: Partial<MobileData>): Promise<boolean> {
    try {
        const fullData: MobileData = {
            ...DEFAULT_MOBILE_DATA,
            ...mobileData,
        };

        const cookieStore = await cookies();
        cookieStore.set(COOKIE_NAME, JSON.stringify(fullData), {
            path: '/',
            maxAge: COOKIE_MAX_AGE,
            sameSite: 'lax',
        });

        return true;
    } catch (error) {
        console.error('Failed to set mobile cookie in server action:', error);
        return false;
    }
}

/** 🍪 Server-side: Remove mobile cookie */
export async function removeMobileDataSSR(): Promise<void> {
    try {
        const cookieStore = await cookies();
        cookieStore.delete(COOKIE_NAME);
    } catch (error) {
        console.error('Failed to remove mobile cookie on server:', error);
    }
}

/** 🍪 Server-side: Check if mobile cookie exists */
export async function hasMobileDataSSR(): Promise<boolean> {
    try {
        const cookieStore = await cookies();
        return cookieStore.has(COOKIE_NAME);
    } catch (error) {
        console.warn('Failed to check mobile cookie existence on server:', error);
        return false;
    }
}

/** 🍪 Pages Router: Get mobile data from request object */
export function getMobileDataFromReq(req: { cookies?: Record<string, string> }): MobileData {
    try {
        if (!req?.cookies) return DEFAULT_MOBILE_DATA;
        const raw = req.cookies[COOKIE_NAME];
        return parseMobileData(raw);
    } catch (error) {
        console.warn('Failed to get mobile cookie from request:', error);
        return DEFAULT_MOBILE_DATA;
    }
}

/** 🍪 Helper function to detect mobile from user agent */
export function detectMobileFromUserAgent(userAgent: string): boolean {
    if (!userAgent) return false;
    
    const mobileRegex = /Mobile|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
    return mobileRegex.test(userAgent);
}

/** 🍪 Helper function to get mobile data with user agent fallback */
export async function getMobileDataWithUserAgent(userAgent?: string): Promise<MobileData> {
    const cookieData = await getMobileDataSSR();
    
    // If no cookie data and user agent is provided, use user agent detection
    if (!cookieData.isMobile && userAgent) {
        const isMobileFromUA = detectMobileFromUserAgent(userAgent);
        return {
            ...cookieData,
            isMobile: isMobileFromUA,
            userAgent,
        };
    }
    
    return cookieData;
}