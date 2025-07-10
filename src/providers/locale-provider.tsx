// src/providers/locale-provider.tsx
'use client';

import React, { useEffect, ReactNode, useMemo, useRef } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import {
    useLocaleStore,
    useCurrentMessages,
} from '@/stores/locale.store';

interface LocaleProviderProps {
    children: ReactNode;
    fallback?: ReactNode;
}

function LocaleSwitchingIndicator() {
    return (
        <div className="fixed top-4 right-4 bg-primary text-primary-foreground px-3 py-2 rounded-lg shadow-lg z-50">
            <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                <span className="text-sm">Switching language...</span>
            </div>
        </div>
    );
}

const LocaleProviderComponent = ({ children, fallback }: LocaleProviderProps) => {
    // ✅ Always call all hooks unconditionally - including refs at the top
    const hasTriggeredBackgroundLoad = useRef(false);
    const renderCountRef = useRef(0);
    
    const {
        locale,
        isHydrated,
        isTranslationsReady,
        isLoading,
        isInitializing,
        translationError,
        initializeMessages,
    } = useLocaleStore();

    const messages = useCurrentMessages();

    // ✅ Defensive default fallback to avoid hook mismatch
    const safeMessages = useMemo(() => messages || {}, [messages]);

    // ✅ Derived values with safe defaults
    const hasAnyMessages = useMemo(() => Object.keys(safeMessages).length > 0, [safeMessages]);
    const shouldBlockRender = useMemo(() => {
        return (!isHydrated && !hasAnyMessages) || (!hasAnyMessages && !isTranslationsReady);
    }, [isHydrated, isTranslationsReady, hasAnyMessages]);

    const showSwitchingIndicator = useMemo(() => {
        return isLoading && isHydrated && isTranslationsReady;
    }, [isLoading, isHydrated, isTranslationsReady]);
    
    useEffect(() => {
        if (isHydrated && isTranslationsReady && !isInitializing && !translationError && !hasTriggeredBackgroundLoad.current) {
            hasTriggeredBackgroundLoad.current = true;
            const timer = setTimeout(() => {
                initializeMessages();
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [isHydrated, isTranslationsReady, isInitializing, translationError, initializeMessages]);

    // ✅ Error UI
    if (translationError) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center space-y-4 max-w-md">
                    <div className="text-destructive text-lg font-semibold">
                        Translation Loading Error
                    </div>
                    <div className="text-muted-foreground text-sm bg-muted p-3 rounded">
                        {translationError}
                    </div>
                    <div className="flex gap-2 justify-center">
                        <button
                            onClick={() => {
                                useLocaleStore.getState().reset();
                                setTimeout(() => {
                                    useLocaleStore.getState().hydrate();
                                }, 100);
                            }}
                            className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm"
                        >
                            Retry
                        </button>
                        <button
                            onClick={() => window.location.reload()}
                            className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md text-sm"
                        >
                            Reload Page
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // ✅ Initial loading fallback
    if (shouldBlockRender) {
        return fallback || (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center space-y-4">
                    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
                    <div className="text-sm text-muted-foreground">Loading application...</div>
                </div>
            </div>
        );
    }

    // Use ref to track renders and prevent duplicate logs
    renderCountRef.current += 1;
    
    // ✅ Dev logs - only log first render to avoid duplicates
    if (process.env.NODE_ENV === 'development' && renderCountRef.current === 1) {
        console.log('✅ LocaleProvider rendering', {
            locale,
            totalKeys: Object.keys(safeMessages).length,
            isLoading,
            showSwitchingIndicator,
        });
    }

    return (
        <>
            <NextIntlClientProvider
                locale={locale}
                messages={safeMessages}
                timeZone="UTC"
                now={new Date()}
            >
                {children}
            </NextIntlClientProvider>

            {showSwitchingIndicator && <LocaleSwitchingIndicator />}
        </>
    );
};

// Memoize the LocaleProvider to prevent unnecessary re-renders
// Custom comparison function to prevent re-renders when only children change
export const LocaleProvider = React.memo(LocaleProviderComponent, (prevProps, nextProps) => {
  // Only re-render if fallback prop changes (children changes are expected)
  return prevProps.fallback === nextProps.fallback;
});
