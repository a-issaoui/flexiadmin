// src/providers/locale-provider.tsx
'use client';

import React, { useEffect, ReactNode } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { useLocaleStore, useCurrentMessages, useTranslationsReady } from '@/stores/locale.store';

interface LocaleProviderProps {
    children: ReactNode;
    fallback?: ReactNode;
}

/**
 * Minimal loading indicator for locale switching only
 */
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

/**
 * Enhanced locale provider that eliminates initial loading skeleton
 * Only shows loading when actually switching between locales
 */
export function LocaleProvider({ children, fallback }: LocaleProviderProps) {
    const {
        locale,
        isHydrated,
        isTranslationsReady,
        isLoading,
        isInitializing,
        translationError,
        initializeMessages
    } = useLocaleStore();

    const messages = useCurrentMessages();

    // Enhanced initialization effect - but only for background loading
    useEffect(() => {
        console.log('🔍 LocaleProvider state check:', {
            isHydrated,
            isTranslationsReady,
            isLoading,
            isInitializing,
            translationError,
            hasMessages: Object.keys(messages).length > 0
        });

        // Only initialize background loading if we're hydrated and ready but haven't started loading other locales
        if (isHydrated && isTranslationsReady && !isInitializing && !translationError) {
            // Check if we need to load additional locales in background
            setTimeout(() => {
                console.log('🔄 Checking if background locale loading is needed...');
                initializeMessages();
            }, 1000); // Delay to avoid blocking initial render
        }
    }, [isHydrated, isTranslationsReady, isInitializing, translationError, initializeMessages]);

    // Show error state
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
                                console.log('🔄 Manual retry...');
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

    // NEW LOGIC: Only block rendering if we truly don't have any messages
    // This eliminates the skeleton for SSR-loaded content
    const hasAnyMessages = Object.keys(messages).length > 0;
    const shouldBlockRender = (!isHydrated && !hasAnyMessages) || (!hasAnyMessages && !isTranslationsReady);

    if (shouldBlockRender) {
        console.log('⏳ Blocking render - no messages available:', {
            isHydrated,
            isTranslationsReady,
            hasAnyMessages,
            reason: !isHydrated && !hasAnyMessages ? 'not hydrated and no messages' :
                !hasAnyMessages && !isTranslationsReady ? 'no messages and not ready' : 'unknown'
        });

        // Only return fallback if absolutely necessary
        return fallback || (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center space-y-4">
                    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
                    <div className="text-sm text-muted-foreground">Loading application...</div>
                </div>
            </div>
        );
    }

    // Show locale switching indicator only when actively switching
    const showSwitchingIndicator = isLoading && isHydrated && isTranslationsReady;

    console.log('✅ Rendering with locale provider:', {
        locale,
        messageKeys: Object.keys(messages).slice(0, 5),
        totalKeys: Object.keys(messages).length,
        isLoading,
        showSwitchingIndicator
    });

    return (
        <>
            <NextIntlClientProvider
                locale={locale}
                messages={messages}
                timeZone="UTC"
                now={new Date()}
            >
                {children}
            </NextIntlClientProvider>

            {/* Show switching indicator only when changing locales */}
            {showSwitchingIndicator && <LocaleSwitchingIndicator />}
        </>
    );
}