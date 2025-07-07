// src/lib/cookies/locale-cookie.server.ts
import { cookies } from 'next/headers';
import {
    DEFAULT_LOCALE,
    DEFAULT_DIRECTION,
    isSupportedLocale,
    getLocaleData,
    LocaleCode,
} from '@/config/locales.config';
import { LocaleData, COOKIE_NAME, COOKIE_MAX_AGE } from './locale-cookie.types';

// Re-export LocaleData for convenience
export type { LocaleData } from './locale-cookie.types';

// Default locale data
const DEFAULT_LOCALE_DATA: LocaleData = {
    locale: DEFAULT_LOCALE,
    direction: DEFAULT_DIRECTION,
};

/** 🍪 Parse locale data from cookie string */
function parseLocaleData(cookieValue: string | undefined): LocaleData {
    if (!cookieValue) return DEFAULT_LOCALE_DATA;

    try {
        const parsed = JSON.parse(cookieValue) as LocaleData;

        // Validate the parsed data
        if (
            parsed &&
            typeof parsed === 'object' &&
            isSupportedLocale(parsed.locale) &&
            (parsed.direction === 'ltr' || parsed.direction === 'rtl')
        ) {
            return parsed;
        }
    } catch (error) {
        console.warn('Failed to parse locale cookie:', error);
    }

    return DEFAULT_LOCALE_DATA;
}

/** 🍪 Server-side: Get locale data from cookie (App Router) */
export async function getLocaleDataSSR(): Promise<LocaleData> {
    try {
        const cookieStore = await cookies();
        const raw = cookieStore.get(COOKIE_NAME)?.value;
        return parseLocaleData(raw);
    } catch (error) {
        console.warn('Failed to get locale cookie on server:', error);
        return DEFAULT_LOCALE_DATA;
    }
}

/** 🍪 Server-side: Get locale data from cookie (synchronous - for middleware) */
export function getLocaleDataSSRSync(cookieStore: any): LocaleData {
    try {
        const raw = cookieStore.get(COOKIE_NAME)?.value;
        return parseLocaleData(raw);
    } catch (error) {
        console.warn('Failed to get locale cookie on server:', error);
        return DEFAULT_LOCALE_DATA;
    }
}

/** 🍪 Server-side: Set locale data cookie in response headers */
export function setLocaleDataSSR(
    response: Response | import('next/server').NextResponse,
    locale: LocaleCode
): Response | import('next/server').NextResponse {
    try {
        const localeConfig = getLocaleData(locale);
        if (!localeConfig) {
            console.warn(`Unsupported locale: ${locale}`);
            return response;
        }

        const localeData: LocaleData = {
            locale: localeConfig.code,
            direction: localeConfig.direction,
        };

        response.headers.append(
            'Set-Cookie',
            `${COOKIE_NAME}=${JSON.stringify(localeData)}; Path=/; Max-Age=${COOKIE_MAX_AGE}; SameSite=Lax`
        );
    } catch (error) {
        console.error('Failed to set locale cookie on server:', error);
    }

    return response;
}

/** 🍪 Server-side: Set locale data cookie in cookies() (App Router server actions) */
export async function setLocaleDataSSRAction(locale: LocaleCode): Promise<boolean> {
    try {
        const localeConfig = getLocaleData(locale);
        if (!localeConfig) {
            console.warn(`Unsupported locale: ${locale}`);
            return false;
        }

        const localeData: LocaleData = {
            locale: localeConfig.code,
            direction: localeConfig.direction,
        };

        const cookieStore = await cookies();
        cookieStore.set(COOKIE_NAME, JSON.stringify(localeData), {
            path: '/',
            maxAge: COOKIE_MAX_AGE,
            sameSite: 'lax',
        });

        return true;
    } catch (error) {
        console.error('Failed to set locale cookie in server action:', error);
        return false;
    }
}

/** 🍪 Server-side: Remove locale cookie */
export async function removeLocaleDataSSR(): Promise<void> {
    try {
        const cookieStore = await cookies();
        cookieStore.delete(COOKIE_NAME);
    } catch (error) {
        console.error('Failed to remove locale cookie on server:', error);
    }
}

/** 🍪 Server-side: Check if locale cookie exists */
export async function hasLocaleDataSSR(): Promise<boolean> {
    try {
        const cookieStore = await cookies();
        return cookieStore.has(COOKIE_NAME);
    } catch (error) {
        console.warn('Failed to check locale cookie existence on server:', error);
        return false;
    }
}

/** 🍪 Pages Router: Get locale data from request object */
export function getLocaleDataFromReq(req: any): LocaleData {
    try {
        if (!req?.cookies) return DEFAULT_LOCALE_DATA;
        const raw = req.cookies[COOKIE_NAME];
        return parseLocaleData(raw);
    } catch (error) {
        console.warn('Failed to get locale cookie from request:', error);
        return DEFAULT_LOCALE_DATA;
    }
}