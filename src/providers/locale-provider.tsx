// src/components/providers/dynamic-locale-provider.tsx
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
 * Loading skeleton for admin dashboard
 */
function AdminLoadingSkeleton() {
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

            {/* Loading indicator */}
            <div className="fixed bottom-4 right-4 bg-primary text-primary-foreground px-4 py-2 rounded-lg shadow-lg">
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    <span className="text-sm">Loading translations...</span>
                </div>
            </div>
        </div>
    );
}

/**
 * Dynamic locale provider that updates translations in real-time
 */
export function LocaleProvider({
                                          children,
                                          fallback
                                      }: LocaleProviderProps) {
    const {
        locale,
        isHydrated,
        isTranslationsReady,
        translationError,
        initializeMessages
    } = useLocaleStore();

    const messages = useCurrentMessages();

    // Initialize translations on mount
    useEffect(() => {
        if (isHydrated && !isTranslationsReady && !translationError) {
            initializeMessages();
        }
    }, [isHydrated, isTranslationsReady, translationError, initializeMessages]);

    // Show error state
    if (translationError) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center space-y-4">
                    <div className="text-destructive text-lg font-semibold">
                        Translation Error
                    </div>
                    <div className="text-muted-foreground">
                        {translationError}
                    </div>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
                    >
                        Reload Page
                    </button>
                </div>
            </div>
        );
    }

    // Show loading state until translations are ready
    if (!isHydrated || !isTranslationsReady) {
        return fallback || <AdminLoadingSkeleton />;
    }

    // ✨ This is where the magic happens - messages update instantly!
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