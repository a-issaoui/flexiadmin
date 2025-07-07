// src/components/common/hydration/locale-hydrator.tsx
'use client';

import { useEffect } from 'react';
import { useLocaleStore } from '@/stores/locale.store';

interface LocaleHydratorProps {
    initialLocale: string;
    initialDirection: string;
}

export default function LocaleHydrator({ initialLocale, initialDirection }: LocaleHydratorProps) {
    const { hydrate, isHydrated } = useLocaleStore();

    useEffect(() => {
        // Hydrate on mount - this will also initialize messages
        if (!isHydrated) {
            console.log('🚀 Hydrating locale store...');
            hydrate();
        }
    }, [hydrate, isHydrated]);

    // This component doesn't render anything
    return null;
}