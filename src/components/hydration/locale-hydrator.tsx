// src/components/common/hydration/locale-hydrator.tsx
'use client';

import { useEffect } from 'react';
import { useLocaleStore } from '@/stores/locale.store';
import { useMessages } from 'next-intl';
import { LocaleCode } from '@/config/locales.config';

interface LocaleHydratorProps {
    initialLocale: string;
    initialDirection: string;
}

export default function LocaleHydrator({ initialLocale, initialDirection }: LocaleHydratorProps) {
    const { hydrate, isHydrated, setSSRMessages, initializeMessages } = useLocaleStore();
    const ssrMessages = useMessages(); // Get messages from Next-Intl SSR

    useEffect(() => {
        if (!isHydrated) {
            console.log('🚀 Hydrating locale store with SSR data...');
            console.log('📦 SSR Messages keys:', Object.keys(ssrMessages).length);

            // First, set the SSR messages to make translations immediately available
            if (Object.keys(ssrMessages).length > 0) {
                console.log('📦 Setting SSR messages for instant availability');
                setSSRMessages(initialLocale as LocaleCode, ssrMessages);
            }

            // Then hydrate the store with cookie data
            hydrate();

            // Finally, load remaining locales in background
            setTimeout(() => {
                console.log('🔄 Starting background locale loading...');
                initializeMessages();
            }, 100);
        }
    }, [hydrate, isHydrated, setSSRMessages, initializeMessages, initialLocale, ssrMessages]);

    // This component doesn't render anything
    return null;
}