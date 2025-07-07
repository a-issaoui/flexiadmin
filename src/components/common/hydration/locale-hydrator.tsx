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
        // Only hydrate once on mount
        if (!isHydrated) {
            hydrate();
        }
    }, [hydrate, isHydrated]);

    return null;
}
