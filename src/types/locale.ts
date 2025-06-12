import type { LocaleCode, TextDirection } from '@/lib/config/locales';

export type { LocaleCode, TextDirection };

export interface LocaleCookie {
    lang: LocaleCode;
    dir: TextDirection;
}