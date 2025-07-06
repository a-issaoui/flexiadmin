import type { LocaleCode } from '@/config/locales.config';
import { DEFAULT_LOCALE } from '@/config/locales.config';

// Global message cache for instant access
const messageCache = new Map<LocaleCode, Record<string, any>>();
const loadingPromises = new Map<LocaleCode, Promise<Record<string, any>>>();

export async function loadMessages(locale: LocaleCode): Promise<Record<string, any>> {
    // Return immediately if cached
    if (messageCache.has(locale)) {
        return messageCache.get(locale)!;
    }

    // Return existing promise if already loading
    if (loadingPromises.has(locale)) {
        return loadingPromises.get(locale)!;
    }

    // Create loading promise
    const loadingPromise = (async () => {
        try {
            const messages = (await import(`@/messages/${locale}.json`)).default;
            messageCache.set(locale, messages);
            loadingPromises.delete(locale);
            return messages;
        } catch (error) {
            console.log(error)
            console.warn(`Failed to load ${locale}, falling back to ${DEFAULT_LOCALE}`);
            loadingPromises.delete(locale);

            if (locale !== DEFAULT_LOCALE) {
                return loadMessages(DEFAULT_LOCALE);
            }

            return {};
        }
    })();

    loadingPromises.set(locale, loadingPromise);
    return loadingPromise;
}

// Preload all messages for instant switching
export async function preloadAllMessages(): Promise<void> {
    const locales: LocaleCode[] = ['en', 'fr', 'ar'];
    await Promise.allSettled(locales.map(locale => loadMessages(locale)));
}

// Get message synchronously (only use after preloading)
export function getMessages(locale: LocaleCode): Record<string, any> {
    return messageCache.get(locale) || messageCache.get(DEFAULT_LOCALE) || {};
}

// Check if messages are loaded
export function areMessagesLoaded(locale: LocaleCode): boolean {
    return messageCache.has(locale);
}