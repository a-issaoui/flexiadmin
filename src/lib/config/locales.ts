import type { LocaleConfig } from "@/types/locale"

export const defaultLocale = 'en' as const;
export const localesConfig: LocaleConfig[] = [
    {
        code: "en",
        name: "English",
        nativeName: "English",
        flag: "🇺🇸",
        direction: "ltr",
    },
    {
        code: "fr",
        name: "French",
        nativeName: "Français",
        flag: "🇫🇷",
        direction: "ltr",
    },
    {
        code: "ar",
        name: "Arabic",
        nativeName: "العربية",
        flag: "🇹🇳",
        direction: "rtl",
    },
] as const;

export const localeCodes = localesConfig.map(l => l.code);
export type AppLocale = typeof localeCodes[number];