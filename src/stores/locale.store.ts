import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DEFAULT_LOCALE, type LocaleCode, type TextDirection } from '@/config/locales.config';

interface LocaleState {
    lang: LocaleCode;
    dir: TextDirection;
    setLang: (lang: LocaleCode) => void;
    setDir: (dir: TextDirection) => void;
}

export const useLocaleStore = create<LocaleState>()(
    persist(
        (set) => ({
            lang: DEFAULT_LOCALE,
            dir: 'ltr',
            setLang: (lang) => set({ lang }),
            setDir: (dir) => set({ dir }),
        }),
        { name: 'flexiadmin-locale' }
    )
);