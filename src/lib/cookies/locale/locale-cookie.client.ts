// src/lib/cookies/locale-cookie.client.ts
import Cookies from 'js-cookie';
import {
    DEFAULT_LOCALE,
    DEFAULT_DIRECTION,
    isSupportedLocale,
    getLocaleData,
    LocaleCode,
} from '@/config/locales.config';
import { LocaleData, COOKIE_NAME } from './locale-cookie.types';

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

/** 🍪 Client-side: Get locale data from cookie */
export function getLocaleDataClient(): LocaleData {
    if (typeof window === 'undefined') return DEFAULT_LOCALE_DATA;

    try {
        const raw = Cookies.get(COOKIE_NAME);
        return parseLocaleData(raw);
    } catch (error) {
        console.warn('Failed to get locale cookie on client:', error);
        return DEFAULT_LOCALE_DATA;
    }
}

/** 🍪 Client-side: Set locale data cookie */
export function setLocaleDataClient(locale: LocaleCode): boolean {
    if (typeof window === 'undefined') return false;

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

        Cookies.set(COOKIE_NAME, JSON.stringify(localeData), {
            path: '/',
            expires: 365,
            sameSite: 'Lax',
        });

        return true;
    } catch (error) {
        console.error('Failed to set locale cookie:', error);
        return false;
    }
}

/** 🍪 Client-side: Remove locale cookie */
export function removeLocaleDataClient(): void {
    if (typeof window === 'undefined') return;

    try {
        Cookies.remove(COOKIE_NAME, { path: '/' });
    } catch (error) {
        console.error('Failed to remove locale cookie:', error);
    }
}

/** 🍪 Client-side: Check if locale cookie exists */
export function hasLocaleDataClient(): boolean {
    if (typeof window === 'undefined') return false;

    try {
        return !!Cookies.get(COOKIE_NAME);
    } catch (error) {
        console.warn('Failed to check locale cookie existence:', error);
        return false;
    }
}
