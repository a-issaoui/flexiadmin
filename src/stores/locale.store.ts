// src/stores/locale.store.ts
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { subscribeWithSelector } from 'zustand/middleware';
import {
    DEFAULT_LOCALE,
    DEFAULT_DIRECTION,
    getLocaleData,
    LocaleCode,
    LocaleDirection,
} from '@/config/locales.config';
import {
    getLocaleDataClient,
    setLocaleDataClient,
    type LocaleData,
} from '@/lib/cookies/locale/locale-cookie.client';

interface LocaleState {
    // Locale data properties
    locale: LocaleCode;
    direction: LocaleDirection;
    // State management
    isHydrated: boolean;
    isLoading: boolean;
    // Actions
    setLocale: (locale: LocaleCode) => void;
    hydrate: () => void;
    reset: () => void;
}

export const useLocaleStore = create<LocaleState>()(
    subscribeWithSelector(
        immer((set, get) => ({
            // Initial state
            locale: DEFAULT_LOCALE,
            direction: DEFAULT_DIRECTION,
            isHydrated: false,
            isLoading: false,

            setLocale: (newLocale: LocaleCode) => {
                const currentState = get();
                if (currentState.locale === newLocale || currentState.isLoading) return;

                const localeConfig = getLocaleData(newLocale);
                if (!localeConfig) {
                    console.warn(`Unsupported locale: ${newLocale}`);
                    return;
                }

                set((state) => {
                    state.isLoading = true;
                });

                // Use setTimeout to allow UI to show loading state
                setTimeout(() => {
                    set((state) => {
                        state.locale = localeConfig.code;
                        state.direction = localeConfig.direction;
                        state.isLoading = false;
                    });

                    // Update cookie and DOM
                    if (typeof window !== 'undefined') {
                        const success = setLocaleDataClient(newLocale);
                        if (success) {
                            updateDocumentLocale(localeConfig.code, localeConfig.direction);
                        }
                    }
                }, 50);
            },

            hydrate: () => {
                if (typeof window === 'undefined') return;

                const localeData = getLocaleDataClient();

                set((state) => {
                    state.locale = localeData.locale;
                    state.direction = localeData.direction;
                    state.isHydrated = true;
                });

                // Ensure DOM is in sync after hydration
                updateDocumentLocale(localeData.locale, localeData.direction);
            },

            reset: () => {
                set((state) => {
                    state.locale = DEFAULT_LOCALE;
                    state.direction = DEFAULT_DIRECTION;
                    state.isHydrated = false;
                    state.isLoading = false;
                });

                if (typeof window !== 'undefined') {
                    updateDocumentLocale(DEFAULT_LOCALE, DEFAULT_DIRECTION);
                }
            },
        }))
    )
);

/** Update document locale attributes */
function updateDocumentLocale(locale: LocaleCode, direction: LocaleDirection) {
    if (typeof window === 'undefined') return;

    try {
        const html = document.documentElement;

        if (html.lang !== locale) {
            html.lang = locale;
        }

        if (html.dir !== direction) {
            html.dir = direction;

            // Dispatch custom event for any components that need to react to direction change
            window.dispatchEvent(new CustomEvent('localeDirectionChange', {
                detail: { locale, direction }
            }));
        }
    } catch (error) {
        console.error('Failed to update document locale:', error);
    }
}

// Subscribe to locale changes and update DOM reactively
if (typeof window !== 'undefined') {
    useLocaleStore.subscribe(
        (state) => ({
            locale: state.locale,
            direction: state.direction,
            isHydrated: state.isHydrated,
            isLoading: state.isLoading
        }),
        ({ locale, direction, isHydrated, isLoading }) => {
            if (isHydrated && !isLoading) {
                updateDocumentLocale(locale, direction);
            }
        },
        {
            equalityFn: (a, b) =>
                a.locale === b.locale &&
                a.direction === b.direction &&
                a.isHydrated === b.isHydrated &&
                a.isLoading === b.isLoading
        }
    );
}

// Helper hook to get current locale data
export function useCurrentLocaleData(): LocaleData {
    const { locale, direction } = useLocaleStore();
    return { locale, direction };
}

// Helper hooks for convenience
export function useCurrentLocale(): LocaleCode {
    return useLocaleStore((state) => state.locale);
}

export function useCurrentDirection(): LocaleDirection {
    return useLocaleStore((state) => state.direction);
}

export function useIsLocaleLoading(): boolean {
    return useLocaleStore((state) => state.isLoading);
}

export function useIsLocaleHydrated(): boolean {
    return useLocaleStore((state) => state.isHydrated);
}