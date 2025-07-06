// stores/i18n.store.ts - High-performance reactive i18n store
'use client';
import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { setCookie } from 'cookies-next';
import { useLocaleStore } from '@/stores/locale.store';
import { loadMessages, getMessages, areMessagesLoaded } from '@/i18n/request';
import type { LocaleCode } from '@/config/locales.config';
import type { TranslationValues } from '@/i18n/i18n.types';

interface I18nState {
    currentLocale: LocaleCode | null;
    isInitialized: boolean;

    // Actions
    initialize: (locale: LocaleCode) => Promise<void>;
    switchLocale: (locale: LocaleCode) => Promise<void>;

    // Translation function
    t: (key: string, values?: TranslationValues) => string;

    // Utilities
    hasTranslation: (key: string) => boolean;
    getNestedValue: (obj: any, path: string) => any;
}

export const useI18nStore = create<I18nState>()(
    subscribeWithSelector((set, get) => ({
        currentLocale: null,
        isInitialized: false,

        initialize: async (locale: LocaleCode) => {
            try {
                await loadMessages(locale);
                set({
                    currentLocale: locale,
                    isInitialized: true
                });
            } catch (error) {
                console.error('Failed to initialize i18n:', error);
                set({ isInitialized: true });
            }
        },

        switchLocale: async (locale: LocaleCode) => {
            if (get().currentLocale === locale) return;

            // Load messages if not cached
            if (!areMessagesLoaded(locale)) {
                await loadMessages(locale);
            }

            set({ currentLocale: locale });
        },

        t: (key: string, values?: TranslationValues) => {
            const { currentLocale, isInitialized, getNestedValue } = get();

            if (!isInitialized || !currentLocale) return key;

            const messages = getMessages(currentLocale);
            const translation = getNestedValue(messages, key);

            if (typeof translation !== 'string') return key;

            // Simple interpolation
            if (values) {
                return translation.replace(/\{(\w+)\}/g, (match, key) => {
                    const value = values[key];
                    return value !== undefined ? String(value) : match;
                });
            }

            return translation;
        },

        hasTranslation: (key: string) => {
            const { currentLocale, getNestedValue } = get();
            if (!currentLocale) return false;

            const messages = getMessages(currentLocale);
            const value = getNestedValue(messages, key);
            return typeof value === 'string';
        },

        getNestedValue: (obj: any, path: string) => {
            return path.split('.').reduce((current, key) => current?.[key], obj);
        },
    }))
);