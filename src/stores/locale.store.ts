'use server'

import { cookies } from 'next/headers';
import { defaultLocale, localesConfig, type LocaleCode } from '@/config/locales.config';
import type { LocaleCookie } from '@/types/locale.types';

const ONE_YEAR = 60 * 60 * 24 * 365;

function getCookieName(): string {
    return `${process.env.NEXT_PUBLIC_APP_NAME || 'NEXT'}_LOCALE`;
}

export async function getUserLocale(): Promise<LocaleCookie> {
    try {

        // Fallback to cookie
        const cookieStore = await cookies();
        const cookieValue = cookieStore.get(getCookieName())?.value;

        if (cookieValue) {
            const parsed = JSON.parse(cookieValue) as LocaleCookie;
            const isValid = localesConfig.some(
                ({ code, direction }) => code === parsed.lang && direction === parsed.dir
            );

            if (isValid) {
                return parsed;
            }
        }
    } catch (error) {
        // Log error in development
        if (process.env.NODE_ENV === 'development') {
            console.warn('Could not read locale:', error);
        }
    }

    // Return default locale config
    const fallback = localesConfig.find(l => l.code === defaultLocale) || localesConfig[0];

    return {
        lang: fallback.code,
        dir: fallback.direction,
    };
}

export async function setUserLocale(lang: LocaleCode): Promise<void> {
    const config = localesConfig.find(l => l.code === lang);

    if (!config) {
        throw new Error(`Invalid locale code: ${lang}`);
    }

    const value: LocaleCookie = {
        lang: config.code,
        dir: config.direction,
    };

    try {
        const cookieStore = await cookies();

        // Set cookie with enhanced security options
        cookieStore.set(getCookieName(), JSON.stringify(value), {
            httpOnly: false,
            path: '/',
            maxAge: ONE_YEAR,
            sameSite: 'lax',
            secure: process.env.NODE_ENV === 'production',
            // Add priority for better performance
            priority: 'high' as const,
        });
    } catch (error) {
        console.error('Failed to set locale cookie:', error);
        throw new Error('Could not save locale preference');
    }
}

export async function isRTL(): Promise<boolean> {
    const { dir } = await getUserLocale();
    return dir === 'rtl';
}
