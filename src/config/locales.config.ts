// src/config/locales.config.ts

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

// Type of one locale item
export type LocaleConfig = typeof localesConfig[number];

// 'en' | 'fr' | 'ar'
export type LocaleCode = LocaleConfig['code'];

// 'ltr' | 'rtl'
export type TextDirection = LocaleConfig['direction'];

// For cookies
export interface LocaleCookie {
    lang: LocaleCode;
    dir: TextDirection;
}


export const LOCALE_CODES = localesConfig.map(l => l.code) as readonly LocaleCode[];
export const TEXT_DIRECTIONS = ['ltr', 'rtl'] as const satisfies readonly TextDirection[];

export const DEFAULT_LOCALE: LocaleCode = 'en';

export function isValidLocaleCode(code: string): code is LocaleCode {
    return LOCALE_CODES.includes(code as LocaleCode);
}

export function isValidTextDirection(dir: string): dir is TextDirection {
    return TEXT_DIRECTIONS.includes(dir as TextDirection);
}

export function getLocaleConfig(code: LocaleCode): LocaleConfig {
    return localesConfig.find(locale => locale.code === code) ?? localesConfig[0];
}

export function getLocaleDirectionByCode(code: LocaleCode): TextDirection {
    return getLocaleConfig(code).direction;
}

export function getDefaultLocaleData(): LocaleCookie {
    const config = getLocaleConfig(DEFAULT_LOCALE);
    return {
        lang: config.code,
        dir: config.direction,
    };
}
