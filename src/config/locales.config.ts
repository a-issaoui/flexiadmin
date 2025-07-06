// src/lib/config/locales.config.ts
export const localesConfig = [
    {
        code: 'en',
        name: 'English',
        nativeName: 'English',
        flag: '🇬🇧',
        direction: 'ltr',
    },
    {
        code: 'fr',
        name: 'French',
        nativeName: 'Français',
        flag: '🇫🇷',
        direction: 'ltr',
    },
    {
        code: 'ar',
        name: 'Arabic',
        nativeName: 'العربية',
        flag: '🇹🇳',
        direction: 'rtl',
    },
] as const;

export const LOCALE_CODES = localesConfig.map(l => l.code) as readonly typeof localesConfig[number]['code'][];
export type LocaleCode = typeof LOCALE_CODES[number];

export const TEXT_DIRECTIONS = ['ltr', 'rtl'] as const;
export type TextDirection = typeof TEXT_DIRECTIONS[number];

export type LocaleConfig = typeof localesConfig[number];

export const defaultLocale: LocaleCode = 'en';

// Helper function to validate locale codes
export function isValidLocaleCode(code: string): code is LocaleCode {
    return LOCALE_CODES.includes(code as LocaleCode);
}
