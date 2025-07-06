// components/I18nProvider.tsx - Perfect initialization
'use client';
import { useEffect } from 'react';
import { useLocaleStore } from '@/stores/locale.store';
import { preloadAllMessages } from './request';

export function I18nProvider({ children }: { children: React.ReactNode }) {
    const { _hydrated } = useLocaleStore();

    useEffect(() => {
        if (_hydrated) {
            // Preload all messages for instant switching
            preloadAllMessages().then(() => {
                console.log('✅ All translations preloaded');
            });
        }
    }, [_hydrated]);

    return <>{children}</>;
}