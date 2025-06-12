// src/store/locale-store.ts
'use server'

import { cookies } from 'next/headers';
import { defaultLocale, localesConfig, type LocaleCode } from '@/lib/config/locales';
import type { LocaleCookie } from '@/types/locale';

const ONE_YEAR = 60 * 60 * 24 * 365;

// Helper function to get cookie name
function getCookieName(): string {
    return `${process.env.NEXT_PUBLIC_APP_NAME || 'NEXT'}_LOCALE`;
}

// Safe version that doesn't throw on not-found pages
export async function getUserLocale(): Promise<LocaleCookie> {
    try {
        const cookieStore = await cookies();
        const cookieValue = cookieStore.get(getCookieName())?.value;

        if (cookieValue) {
            const parsed = JSON.parse(cookieValue) as LocaleCookie;

            // Validate against actual config
            const isValid = localesConfig.some(
                ({ code, direction }) => code === parsed.lang && direction === parsed.dir
            );

            if (isValid) {
                return parsed;
            }
        }
    } catch (error) {
        // Silently handle errors for not-found pages and other edge cases
        console.warn('Could not read locale cookie:', error);
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
        cookieStore.set(getCookieName(), JSON.stringify(value), {
            httpOnly: false, // Keep false for client-side access
            path: '/',
            maxAge: ONE_YEAR,
            sameSite: 'lax',
            secure: process.env.NODE_ENV === 'production',
        });
    } catch (error) {
        console.error('Failed to set locale cookie:', error);
        throw error;
    }
}