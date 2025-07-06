import type { LocaleCode, TextDirection } from '@/config/locales.config';

export type { LocaleCode, TextDirection };

export interface LocaleCookie {
    lang: LocaleCode;
    dir: TextDirection;
}