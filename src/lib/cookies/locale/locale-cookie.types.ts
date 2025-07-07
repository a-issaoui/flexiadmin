import { LocaleCode, LocaleDirection } from '@/config/locales.config';

export interface LocaleData {
    locale: LocaleCode;
    direction: LocaleDirection;
}

export const COOKIE_NAME = 'flexiadmin-locale';
export const COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year