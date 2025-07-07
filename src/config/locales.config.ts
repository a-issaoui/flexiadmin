// src/config/locales.config.ts
export const SUPPORTED_LOCALES = [
    {
        code: 'en',
        name: 'English',
        nativeName: 'English',
        flag: '🇬🇧',
        direction: 'ltr',
        // Optional: Add more metadata
        region: 'GB',
        currency: 'GBP',
        dateFormat: 'MM/dd/yyyy',
        numberFormat: 'en-GB',
    },
    {
        code: 'fr',
        name: 'French',
        nativeName: 'Français',
        flag: '🇫🇷',
        direction: 'ltr',
        region: 'FR',
        currency: 'EUR',
        dateFormat: 'dd/MM/yyyy',
        numberFormat: 'fr-FR',
    },
    {
        code: 'ar',
        name: 'Arabic',
        nativeName: 'العربية',
        flag: '🇹🇳',
        direction: 'rtl',
        region: 'TN',
        currency: 'TND',
        dateFormat: 'dd/MM/yyyy',
        numberFormat: 'ar-TN',
    },
] as const;

// Type definitions
export type LocaleCode = typeof SUPPORTED_LOCALES[number]['code'];
export type LocaleDirection = typeof SUPPORTED_LOCALES[number]['direction'];
export type LocaleConfig = typeof SUPPORTED_LOCALES[number];

// Constants
export const DEFAULT_LOCALE: LocaleCode = 'en';
export const DEFAULT_DIRECTION: LocaleDirection = 'ltr';

// Utility functions
export function getLocaleData(code: string): LocaleConfig | undefined {
    return SUPPORTED_LOCALES.find(locale => locale.code === code);
}

export function isSupportedLocale(code: string): code is LocaleCode {
    return SUPPORTED_LOCALES.some(locale => locale.code === code);
}

// Additional helper functions
export function getLocaleDirection(code: string): LocaleDirection {
    const locale = getLocaleData(code);
    return locale?.direction ?? DEFAULT_DIRECTION;
}

export function getLocaleName(code: string): string {
    const locale = getLocaleData(code);
    return locale?.name ?? 'Unknown';
}

export function getLocaleNativeName(code: string): string {
    const locale = getLocaleData(code);
    return locale?.nativeName ?? 'Unknown';
}

export function getLocaleFlag(code: string): string {
    const locale = getLocaleData(code);
    return locale?.flag ?? '🌐';
}

export function getRTLLocales(): LocaleCode[] {
    return SUPPORTED_LOCALES
        .filter(locale => locale.direction === 'rtl')
        .map(locale => locale.code);
}

export function getLTRLocales(): LocaleCode[] {
    return SUPPORTED_LOCALES
        .filter(locale => locale.direction === 'ltr')
        .map(locale => locale.code);
}

export function isRTLLocale(code: string): boolean {
    return getLocaleDirection(code) === 'rtl';
}

// Validation functions
export function validateLocaleCode(code: unknown): LocaleCode {
    if (typeof code === 'string' && isSupportedLocale(code)) {
        return code;
    }
    console.warn(`Invalid locale code: ${code}, falling back to ${DEFAULT_LOCALE}`);
    return DEFAULT_LOCALE;
}

// Format helpers (optional - for future use)
export function formatCurrency(
    amount: number,
    localeCode: LocaleCode,
    currency?: string
): string {
    const locale = getLocaleData(localeCode);
    const currencyCode = currency || locale?.currency || 'USD';
    const numberFormat = locale?.numberFormat || 'en-US';

    return new Intl.NumberFormat(numberFormat, {
        style: 'currency',
        currency: currencyCode,
    }).format(amount);
}

export function formatDate(
    date: Date,
    localeCode: LocaleCode,
    options?: Intl.DateTimeFormatOptions
): string {
    const locale = getLocaleData(localeCode);
    const numberFormat = locale?.numberFormat || 'en-US';

    return new Intl.DateTimeFormat(numberFormat, options).format(date);
}

export function formatNumber(
    number: number,
    localeCode: LocaleCode,
    options?: Intl.NumberFormatOptions
): string {
    const locale = getLocaleData(localeCode);
    const numberFormat = locale?.numberFormat || 'en-US';

    return new Intl.NumberFormat(numberFormat, options).format(number);
}

// Hook for getting current locale in components (optional)
export function useCurrentLocale(): LocaleConfig {
    // This would be implemented in your components
    // For now, just return default
    return getLocaleData(DEFAULT_LOCALE)!;
}

// Constants for easy access
export const LOCALE_CODES = SUPPORTED_LOCALES.map(locale => locale.code);
export const LOCALE_NAMES = SUPPORTED_LOCALES.map(locale => locale.name);
export const RTL_LOCALES = getRTLLocales();
export const LTR_LOCALES = getLTRLocales();

// Type guards
export function isLocaleConfig(obj: unknown): obj is LocaleConfig {
    return (
        typeof obj === 'object' &&
        obj !== null &&
        'code' in obj &&
        'name' in obj &&
        'nativeName' in obj &&
        'flag' in obj &&
        'direction' in obj &&
        typeof (obj as any).code === 'string' &&
        typeof (obj as any).name === 'string' &&
        typeof (obj as any).nativeName === 'string' &&
        typeof (obj as any).flag === 'string' &&
        ((obj as any).direction === 'ltr' || (obj as any).direction === 'rtl')
    );
}