// hooks/useTranslations.ts - Perfect translation hook
'use client';
import { useEffect } from 'react';
import { useLocaleStore } from '@/stores/locale.store';
import { useI18nStore } from '@/stores/i18n.store';
import type { TranslationValues } from '@/i18n/i18n.types';

export function useTranslations(namespace?: string) {
    const { lang, _hydrated } = useLocaleStore();
    const { t, isInitialized, initialize, switchLocale } = useI18nStore();

    // Initialize i18n when locale store is hydrated
    useEffect(() => {
        if (_hydrated && lang && !isInitialized) {
            initialize(lang);
        }
    }, [_hydrated, lang, isInitialized, initialize]);

    // Switch locale when language changes
    useEffect(() => {
        if (isInitialized && lang) {
            switchLocale(lang);
        }
    }, [lang, isInitialized, switchLocale]);

    const translate = (key: string, values?: TranslationValues): string => {
        if (!_hydrated || !isInitialized) return key;

        const fullKey = namespace ? `${namespace}.${key}` : key;
        return t(fullKey, values);
    };

    return translate;
}
