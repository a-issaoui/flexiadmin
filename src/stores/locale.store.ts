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
    SUPPORTED_LOCALES, // ✨ Import the config
} from '@/config/locales.config';
import {
    getLocaleDataClient,
    setLocaleDataClient,
    type LocaleData,
} from '@/lib/cookies/locale/locale-cookie.client';

interface LocaleState {
    locale: LocaleCode;
    direction: LocaleDirection;
    messages: Record<string, any>;
    availableMessages: Record<LocaleCode, Record<string, any>>;
    isTranslationsReady: boolean;
    translationError: string | null;
    isHydrated: boolean;
    isLoading: boolean;

    setLocale: (locale: LocaleCode) => void;
    initializeMessages: () => Promise<void>;
    hydrate: () => void;
    reset: () => void;
}

export const useLocaleStore = create<LocaleState>()(
    subscribeWithSelector(
        immer((set, get) => ({
            // Initial state
            locale: DEFAULT_LOCALE,
            direction: DEFAULT_DIRECTION,
            messages: {},
            availableMessages: {},
            isTranslationsReady: false,
            translationError: null,
            isHydrated: false,
            isLoading: false,

            // ✨ Dynamic message loading based on config
            initializeMessages: async () => {
                try {
                    console.log('🌍 Loading translations for supported locales...');

                    // ✨ Dynamically import based on SUPPORTED_LOCALES config
                    const messagePromises = SUPPORTED_LOCALES.map(async (localeConfig) => {
                        try {
                            const messages = await import(`@/i18n/messages/${localeConfig.code}.json`);
                            return {
                                code: localeConfig.code,
                                messages: messages.default
                            };
                        } catch (error) {
                            console.error(`Failed to load messages for ${localeConfig.code}:`, error);
                            return {
                                code: localeConfig.code,
                                messages: {} // Fallback to empty object
                            };
                        }
                    });

                    // Wait for all translations to load
                    const loadedMessages = await Promise.all(messagePromises);

                    // Build the availableMessages object dynamically
                    const allMessages: Record<LocaleCode, Record<string, any>> = {};
                    loadedMessages.forEach(({ code, messages }) => {
                        allMessages[code as LocaleCode] = messages;
                    });

                    set((state) => {
                        state.availableMessages = allMessages;
                        state.messages = allMessages[state.locale] || {};
                        state.isTranslationsReady = true;
                        state.translationError = null;
                    });

                    const loadedLocales = loadedMessages.map(m => m.code).join(', ');
                    console.log(`✅ Translations loaded for: ${loadedLocales}`);

                } catch (error) {
                    console.error('❌ Failed to load translations:', error);
                    set((state) => {
                        state.translationError = 'Failed to load translations';
                        state.isTranslationsReady = false;
                    });
                }
            },

            setLocale: (newLocale: LocaleCode) => {
                const currentState = get();
                if (currentState.locale === newLocale || currentState.isLoading) return;

                const localeConfig = getLocaleData(newLocale);
                if (!localeConfig) {
                    console.warn(`Unsupported locale: ${newLocale}`);
                    return;
                }

                // Check if we have the messages ready
                if (!currentState.availableMessages[newLocale]) {
                    console.warn(`Messages not available for locale: ${newLocale}`);
                    return;
                }

                set((state) => {
                    state.isLoading = true;
                });

                setTimeout(() => {
                    set((state) => {
                        state.locale = localeConfig.code;
                        state.direction = localeConfig.direction;
                        state.messages = state.availableMessages[newLocale];
                        state.isLoading = false;
                    });

                    if (typeof window !== 'undefined') {
                        const success = setLocaleDataClient(newLocale);
                        if (success) {
                            updateDocumentLocale(localeConfig.code, localeConfig.direction);
                        }
                    }

                    console.log(`🌍 Switched to ${newLocale} instantly!`);
                }, 50);
            },

            hydrate: async () => {
                if (typeof window === 'undefined') return;

                const localeData = getLocaleDataClient();

                set((state) => {
                    state.locale = localeData.locale;
                    state.direction = localeData.direction;
                    state.isHydrated = true;
                });

                updateDocumentLocale(localeData.locale, localeData.direction);

                const currentState = get();
                if (!currentState.isTranslationsReady) {
                    await currentState.initializeMessages();
                }
            },

            reset: () => {
                set((state) => {
                    state.locale = DEFAULT_LOCALE;
                    state.direction = DEFAULT_DIRECTION;
                    state.messages = {};
                    state.availableMessages = {};
                    state.isTranslationsReady = false;
                    state.translationError = null;
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

// Rest of the file remains the same...
function updateDocumentLocale(locale: LocaleCode, direction: LocaleDirection) {
    if (typeof window === 'undefined') return;

    try {
        const html = document.documentElement;

        if (html.lang !== locale) {
            html.lang = locale;
        }

        if (html.dir !== direction) {
            html.dir = direction;
            window.dispatchEvent(new CustomEvent('localeDirectionChange', {
                detail: { locale, direction }
            }));
        }
    } catch (error) {
        console.error('Failed to update document locale:', error);
    }
}

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

// Helper hooks
export function useCurrentLocaleData(): LocaleData {
    const { locale, direction } = useLocaleStore();
    return { locale, direction };
}

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

export function useCurrentMessages(): Record<string, any> {
    return useLocaleStore((state) => state.messages);
}

export function useTranslationsReady(): boolean {
    return useLocaleStore((state) => state.isTranslationsReady);
}