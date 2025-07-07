// src/providers/locale-provider.tsx
'use client';

import React, { useEffect, ReactNode } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { useLocaleStore, useCurrentMessages, useTranslationsReady } from '@/stores/locale.store';
import { Skeleton } from '@/components/ui/skeleton';

interface LocaleProviderProps {
    children: ReactNode;
    fallback?: ReactNode;
}

/**
 * Enhanced loading skeleton with progress indicator
 */
function AdminLoadingSkeleton() {
    const { isHydrated, isInitializing, translationError } = useLocaleStore();

    return (
        <div className="min-h-screen bg-background p-4">
            <div className="space-y-4">
                {/* Header skeleton */}
                <div className="h-14 bg-muted rounded-lg animate-pulse" />

                {/* Sidebar skeleton */}
                <div className="flex gap-4">
                    <div className="w-64 h-96 bg-muted rounded-lg animate-pulse" />
                    <div className="flex-1 space-y-4">
                        <Skeleton className="h-8 w-64" />
                        <Skeleton className="h-4 w-96" />
                        <div className="grid grid-cols-3 gap-4">
                            <Skeleton className="h-32" />
                            <Skeleton className="h-32" />
                            <Skeleton className="h-32" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Enhanced loading indicator with status */}
            <div className="fixed bottom-4 right-4 bg-primary text-primary-foreground px-4 py-2 rounded-lg shadow-lg">
                <div className="flex items-center gap-2">
                    {translationError ? (
                        <>
                            <div className="w-4 h-4 bg-destructive rounded-full" />
                            <span className="text-sm">Translation Error</span>
                        </>
                    ) : (
                        <>
                            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                            <span className="text-sm">
                                {!isHydrated ? 'Hydrating...' :
                                    isInitializing ? 'Loading translations...' :
                                        'Initializing...'}
                            </span>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

/**
 * Enhanced locale provider with better error handling and debugging
 */
export function LocaleProvider({ children, fallback }: LocaleProviderProps) {
    const {
        locale,
        isHydrated,
        isTranslationsReady,
        isInitializing,
        translationError,
        initializeMessages
    } = useLocaleStore();

    const messages = useCurrentMessages();

    // Enhanced initialization effect with better logging
    useEffect(() => {
        console.log('🔍 LocaleProvider state check:', {
            isHydrated,
            isTranslationsReady,
            isInitializing,
            translationError,
            hasMessages: Object.keys(messages).length > 0
        });

        // Only initialize messages after hydration is complete
        if (isHydrated && !isTranslationsReady && !isInitializing && !translationError) {
            console.log('🚀 Starting message initialization...');
            initializeMessages();
        }
    }, [isHydrated, isTranslationsReady, isInitializing, translationError, initializeMessages, messages]);

    // Debug effect to track state changes
    useEffect(() => {
        if (isHydrated && isTranslationsReady) {
            console.log('🎉 Ready to render! Messages loaded:', Object.keys(messages).length > 0);
        }
    }, [isHydrated, isTranslationsReady, messages]);

    // Show detailed error state
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

    // Show loading state with more specific conditions
    const shouldShowLoading = !isHydrated || !isTranslationsReady || isInitializing;

    if (shouldShowLoading) {
        console.log('⏳ Showing loading state:', {
            isHydrated,
            isTranslationsReady,
            isInitializing,
            reason: !isHydrated ? 'not hydrated' :
                !isTranslationsReady ? 'translations not ready' :
                    isInitializing ? 'currently initializing' : 'unknown'
        });
        return fallback || <AdminLoadingSkeleton />;
    }

    // Final check before rendering
    if (Object.keys(messages).length === 0) {
        console.warn('⚠️ No messages available for locale:', locale);
        return fallback || <AdminLoadingSkeleton />;
    }

    console.log('✅ Rendering with locale provider:', {
        locale,
        messageKeys: Object.keys(messages).slice(0, 5), // Show first 5 keys for debugging
        totalKeys: Object.keys(messages).length
    });

    return (
        <NextIntlClientProvider
            locale={locale}
            messages={messages}
            timeZone="UTC"
            now={new Date()}
        >
            {children}
        </NextIntlClientProvider>
    );
}