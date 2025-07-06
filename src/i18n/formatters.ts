// lib/i18n/formatters.ts - Advanced formatting utilities
import type { LocaleCode } from '@/config/locales.config';
import { getLocaleConfig } from '@/config/locales.config';

// Locale mappings
const LOCALE_MAP: Record<LocaleCode, string> = {
    'en': 'en-US',
    'fr': 'fr-FR',
    'ar': 'ar-TN'
};

const CURRENCY_MAP: Record<LocaleCode, string> = {
    'en': 'USD',
    'fr': 'EUR',
    'ar': 'TND'
};

const TIMEZONE_MAP: Record<LocaleCode, string> = {
    'en': 'UTC',
    'fr': 'Europe/Paris',
    'ar': 'Africa/Tunis'
};

export function getIntlLocale(locale: LocaleCode): string {
    return LOCALE_MAP[locale] || 'en-US';
}

export function getCurrency(locale: LocaleCode): string {
    return CURRENCY_MAP[locale] || 'USD';
}

export function getTimezone(locale: LocaleCode): string {
    return TIMEZONE_MAP[locale] || 'UTC';
}

export function shouldUseArabicNumerals(locale: LocaleCode): boolean {
    return locale === 'ar';
}

// Create formatters
export function createDateTimeFormatter(
    locale: LocaleCode,
    options?: Intl.DateTimeFormatOptions
): Intl.DateTimeFormat {
    const intlLocale = getIntlLocale(locale);
    const defaultOptions: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZone: getTimezone(locale),
        ...(shouldUseArabicNumerals(locale) && { numberingSystem: 'arab' }),
    };

    return new Intl.DateTimeFormat(intlLocale, { ...defaultOptions, ...options });
}

export function createNumberFormatter(
    locale: LocaleCode,
    options?: Intl.NumberFormatOptions
): Intl.NumberFormat {
    const intlLocale = getIntlLocale(locale);
    const defaultOptions: Intl.NumberFormatOptions = {
        ...(shouldUseArabicNumerals(locale) && { numberingSystem: 'arab' }),
    };

    return new Intl.NumberFormat(intlLocale, { ...defaultOptions, ...options });
}

export function createCurrencyFormatter(locale: LocaleCode): Intl.NumberFormat {
    return createNumberFormatter(locale, {
        style: 'currency',
        currency: getCurrency(locale),
    });
}

export function createPercentFormatter(locale: LocaleCode): Intl.NumberFormat {
    return createNumberFormatter(locale, {
        style: 'percent',
        minimumFractionDigits: 0,
        maximumFractionDigits: 1,
    });
}

export function createRelativeTimeFormatter(locale: LocaleCode): Intl.RelativeTimeFormat {
    const intlLocale = getIntlLocale(locale);
    return new Intl.RelativeTimeFormat(intlLocale, { numeric: 'auto' });
}