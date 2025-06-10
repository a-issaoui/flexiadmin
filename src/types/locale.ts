export const LOCALE_CODES = ['en', 'fr', 'ar'] as const;
export type LocaleCode = typeof LOCALE_CODES[number];
export type TextDirection = 'ltr' | 'rtl';

export interface LocaleConfig {
    code: LocaleCode;
    name: string;
    nativeName: string;
    flag: string;
    direction: TextDirection;
}

export interface LocaleCookie {
    lang: LocaleCode;
    dir: TextDirection;
}

// Helper function to validate locale codes
export function isValidLocaleCode(code: string): code is LocaleCode {
    return LOCALE_CODES.includes(code as LocaleCode);
}