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
    SUPPORTED_LOCALES,
} from '@/config/locales.config';
import {
    getLocaleDataClient,
    setLocaleDataClient,
    type LocaleData,
} from '@/lib/cookies/locale/locale-cookie.client';

// Type for translation messages
type TranslationMessages = Record<string, unknown>;

interface LocaleState {
    locale: LocaleCode;
    direction: LocaleDirection;
    messages: TranslationMessages;
    availableMessages: Partial<Record<LocaleCode, TranslationMessages>>;
    isTranslationsReady: boolean;
    translationError: string | null;
    isHydrated: boolean;
    isLoading: boolean;
    isInitializing: boolean;
    ssrMessages: TranslationMessages; // NEW: Store SSR messages
    hasLoadedBackground: boolean; // NEW: Prevent duplicate background loading

    setLocale: (locale: LocaleCode) => void;
    initializeMessages: () => Promise<void>;
    hydrate: () => void;
    reset: () => void;
    setSSRMessages: (locale: LocaleCode, messages: TranslationMessages) => void; // NEW
}

export const useLocaleStore = create<LocaleState>()(
    subscribeWithSelector(
        immer((set, get) => ({
            // Initial state
            locale: DEFAULT_LOCALE,
            direction: DEFAULT_DIRECTION,
            messages: {} as TranslationMessages,
            availableMessages: {} as Partial<Record<LocaleCode, TranslationMessages>>,
            ssrMessages: {} as TranslationMessages, // NEW
            isTranslationsReady: false,
            translationError: null,
            isHydrated: false,
            isLoading: false,
            isInitializing: false,
            hasLoadedBackground: false, // NEW: Track background loading

            // NEW: Method to set SSR messages
            setSSRMessages: (locale: LocaleCode, messages: TranslationMessages) => {
                if (process.env.NODE_ENV === 'development') {
                    console.log(`📦 Setting SSR messages for ${locale}:`, Object.keys(messages).length, 'keys');
                }

                set((state) => {
                    state.ssrMessages = messages;
                    state.messages = messages;
                    state.availableMessages[locale] = messages;
                    state.locale = locale;

                    // Mark as ready if we have SSR messages
                    if (Object.keys(messages).length > 0) {
                        state.isTranslationsReady = true;
                        console.log('✅ Translations ready with SSR messages');
                    }
                });
            },

            initializeMessages: async () => {
                const currentState = get();

                // If we already have SSR messages and they're for the current locale,
                // just load the remaining locales in the background
                if (currentState.isTranslationsReady &&
                    Object.keys(currentState.ssrMessages).length > 0) {
                    if (process.env.NODE_ENV === 'development') {
                        console.log('🔄 SSR messages available, loading remaining locales in background...');
                    }

                    // Prevent duplicate background loading
                    if (currentState.hasLoadedBackground) {
                        if (process.env.NODE_ENV === 'development') {
                            console.log('🎯 Background loading already completed, skipping...');
                        }
                        return;
                    }

                    // Load remaining locales without blocking UI
                    loadRemainingLocalesInBackground();
                    return;
                }

                // Prevent multiple simultaneous initialization attempts
                if (currentState.isInitializing) {
                    console.log('🔄 Messages already loading, skipping...');
                    return;
                }

                set((state) => {
                    state.isInitializing = true;
                    state.translationError = null;
                });

                try {
                    console.log('🌍 Loading translations for all supported locales...');

                    const messagePromises = SUPPORTED_LOCALES.map(async (localeConfig) => {
                        try {
                            // Skip if we already have this locale from SSR
                            const existing = currentState.availableMessages[localeConfig.code];
                            if (existing && Object.keys(existing).length > 0) {
                                console.log(`⚡ Using cached messages for ${localeConfig.code}`);
                                return {
                                    code: localeConfig.code,
                                    messages: existing
                                };
                            }

                            const messages = await import(`../i18n/messages/${localeConfig.code}.json`);
                            console.log(`✅ Loaded ${localeConfig.code} messages:`, Object.keys(messages.default || {}).length, 'keys');
                            return {
                                code: localeConfig.code,
                                messages: messages.default || {}
                            };
                        } catch (error) {
                            console.error(`❌ Failed to load messages for ${localeConfig.code}:`, error);
                            return {
                                code: localeConfig.code,
                                messages: {}
                            };
                        }
                    });

                    const loadedMessages = await Promise.all(messagePromises);
                    console.log('📦 All message promises resolved:', loadedMessages.length);

                    const allMessages: Partial<Record<LocaleCode, TranslationMessages>> = {};
                    loadedMessages.forEach(({ code, messages }) => {
                        allMessages[code as LocaleCode] = messages;
                    });

                    const currentLocale = get().locale;
                    console.log('🎯 Setting messages for current locale:', currentLocale);

                    set((state) => {
                        state.availableMessages = allMessages;
                        state.messages = allMessages[currentLocale] || state.ssrMessages || {};
                        state.isTranslationsReady = true;
                        state.translationError = null;
                        state.isInitializing = false;
                    });

                    const loadedLocales = loadedMessages.map(m => m.code).join(', ');
                    console.log(`🎉 All translations loaded successfully: ${loadedLocales}`);

                } catch (error) {
                    console.error('💥 Failed to load translations:', error);
                    set((state) => {
                        state.translationError = `Failed to load translations: ${error instanceof Error ? error.message : 'Unknown error'}`;
                        state.isTranslationsReady = false;
                        state.isInitializing = false;
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

                // Check if we have messages for this locale
                const hasMessages = currentState.availableMessages[newLocale] &&
                    Object.keys(currentState.availableMessages[newLocale] || {}).length > 0;

                if (!hasMessages) {
                    console.warn(`Messages not available for locale: ${newLocale}, loading...`);
                    // Set loading state and load the specific locale
                    set((state) => {
                        state.isLoading = true;
                    });

                    // Load the specific locale
                    loadSpecificLocale(newLocale).then(() => {
                        // Now switch to it
                        set((state) => {
                            state.locale = localeConfig.code;
                            state.direction = localeConfig.direction;
                            state.messages = state.availableMessages[newLocale] || {};
                            state.isLoading = false;
                        });

                        if (typeof window !== 'undefined') {
                            setLocaleDataClient(newLocale);
                            updateDocumentLocale(localeConfig.code, localeConfig.direction);
                        }
                    });
                    return;
                }

                // Instant switch if messages are available
                set((state) => {
                    state.locale = localeConfig.code;
                    state.direction = localeConfig.direction;
                    state.messages = state.availableMessages[newLocale] || {};
                });

                if (typeof window !== 'undefined') {
                    setLocaleDataClient(newLocale);
                    updateDocumentLocale(localeConfig.code, localeConfig.direction);
                }

                console.log(`🌍 Switched to ${newLocale} instantly!`);
            },

            hydrate: () => {
                if (typeof window === 'undefined') return;

                console.log('🚀 Starting locale hydration...');

                const localeData = getLocaleDataClient();
                console.log('📱 Locale data from client:', localeData);

                set((state) => {
                    state.locale = localeData.locale;
                    state.direction = localeData.direction;
                    state.isHydrated = true;
                });

                updateDocumentLocale(localeData.locale, localeData.direction);
                console.log('✅ Locale hydration complete');
            },

            reset: () => {
                set((state) => {
                    state.locale = DEFAULT_LOCALE;
                    state.direction = DEFAULT_DIRECTION;
                    state.messages = {} as TranslationMessages;
                    state.availableMessages = {} as Partial<Record<LocaleCode, TranslationMessages>>;
                    state.ssrMessages = {} as TranslationMessages;
                    state.isTranslationsReady = false;
                    state.translationError = null;
                    state.isHydrated = false;
                    state.isLoading = false;
                    state.isInitializing = false;
                    state.hasLoadedBackground = false;
                });

                if (typeof window !== 'undefined') {
                    updateDocumentLocale(DEFAULT_LOCALE, DEFAULT_DIRECTION);
                }
            },
        }))
    )
);

// Helper function to load remaining locales in background
async function loadRemainingLocalesInBackground() {
    const currentState = useLocaleStore.getState();

    try {
        const missingLocales = SUPPORTED_LOCALES.filter(locale =>
            !currentState.availableMessages[locale.code] ||
            Object.keys(currentState.availableMessages[locale.code] || {}).length === 0
        );

        if (missingLocales.length === 0) {
            if (process.env.NODE_ENV === 'development') {
                console.log('🎯 All locales already loaded');
            }
            return;
        }

        if (process.env.NODE_ENV === 'development') {
            console.log('🔄 Loading missing locales in background:', missingLocales.map(l => l.code));
        }

        const loadPromises = missingLocales.map(async (localeConfig) => {
            try {
                const messages = await import(`../i18n/messages/${localeConfig.code}.json`);
                return {
                    code: localeConfig.code,
                    messages: messages.default || {}
                };
            } catch (error) {
                console.error(`❌ Failed to load background messages for ${localeConfig.code}:`, error);
                return {
                    code: localeConfig.code,
                    messages: {}
                };
            }
        });

        const results = await Promise.all(loadPromises);

        useLocaleStore.setState((state) => {
            results.forEach(({ code, messages }) => {
                state.availableMessages[code as LocaleCode] = messages;
            });
            // Set the flag to prevent duplicate background loading
            state.hasLoadedBackground = true;
        });

        if (process.env.NODE_ENV === 'development') {
            console.log('✅ Background locale loading complete');
        }
    } catch (error) {
        console.error('💥 Background locale loading failed:', error);
    }
}

// Helper function to load a specific locale
async function loadSpecificLocale(locale: LocaleCode) {
    try {
        console.log(`🔄 Loading specific locale: ${locale}`);
        const messages = await import(`../i18n/messages/${locale}.json`);

        useLocaleStore.setState((state) => {
            state.availableMessages[locale] = messages.default || {};
        });

        console.log(`✅ Loaded specific locale: ${locale}`);
    } catch (error) {
        console.error(`❌ Failed to load specific locale ${locale}:`, error);
    }
}

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

// Keep subscription logic
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

// Helper hooks (unchanged)
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

export function useCurrentMessages(): TranslationMessages {
    return useLocaleStore((state) => state.messages);
}

export function useTranslationsReady(): boolean {
    return useLocaleStore((state) => state.isTranslationsReady);
}