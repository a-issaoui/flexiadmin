import { cookies } from 'next/headers';
import {
    getDefaultLocaleData,
    isValidLocaleCode,
    isValidTextDirection,
    getLocaleConfig,
} from '@/config/locales.config';
import type { LocaleCookie } from '@/config/locales.config';

const COOKIE_NAME = 'flexiadmin-locale';

export async function getLocaleFromServerCookie(): Promise<LocaleCookie> {
    try {
        const cookieStore = await cookies();
        const raw = cookieStore.get(COOKIE_NAME)?.value;

        if (!raw) return getDefaultLocaleData();

        const parsed = JSON.parse(raw);
        const lang = isValidLocaleCode(parsed.lang) ? parsed.lang : undefined;
        const dir = isValidTextDirection(parsed.dir) ? parsed.dir : undefined;

        if (lang && dir) {
            // Validate that the direction matches the language's expected direction
            const config = getLocaleConfig(lang);
            return { lang, dir };
        }
    } catch (error) {
        console.warn('Failed to parse locale cookie:', error);
    }

    return getDefaultLocaleData();
}