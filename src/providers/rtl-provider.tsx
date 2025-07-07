// src/providers/rtl-provider.tsx
'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { LocaleCode, LocaleDirection } from '@/config/locales.config';

interface RTLContextType {
    direction: LocaleDirection;
    locale: LocaleCode;
    isRTL: boolean;
    setDirection: (direction: LocaleDirection) => void;
}

const RTLContext = createContext<RTLContextType | undefined>(undefined);

interface RTLProviderProps {
    children: React.ReactNode;
    direction: LocaleDirection;
    locale: LocaleCode;
}

export function RTLProvider({ children, direction: initialDirection, locale: initialLocale }: RTLProviderProps) {
    const [direction, setDirection] = useState<LocaleDirection>(initialDirection);
    const [locale, setLocale] = useState<LocaleCode>(initialLocale);
    const [mounted, setMounted] = useState(false);

    const isRTL = direction === 'rtl';

    // Handle mounting for hydration safety
    useEffect(() => {
        setMounted(true);
    }, []);

    // Update document direction when direction changes
    useEffect(() => {
        if (mounted && typeof window !== 'undefined') {
            const html = document.documentElement;

            // Update dir attribute
            if (html.dir !== direction) {
                html.dir = direction;
            }

            // Update lang attribute
            if (html.lang !== locale) {
                html.lang = locale;
            }

            // Dispatch custom event for components that need to react to direction changes
            window.dispatchEvent(new CustomEvent('rtl-direction-change', {
                detail: { direction, locale, isRTL }
            }));
        }
    }, [direction, locale, isRTL, mounted]);

    // Listen for locale store changes
    useEffect(() => {
        if (typeof window === 'undefined') return;

        const handleLocaleChange = (event: CustomEvent) => {
            const { locale: newLocale, direction: newDirection } = event.detail;
            setDirection(newDirection);
            setLocale(newLocale);
        };

        window.addEventListener('localeDirectionChange', handleLocaleChange as EventListener);

        return () => {
            window.removeEventListener('localeDirectionChange', handleLocaleChange as EventListener);
        };
    }, []);

    const contextValue: RTLContextType = {
        direction,
        locale,
        isRTL,
        setDirection,
    };

    return (
        <RTLContext.Provider value={contextValue}>
            {children}
        </RTLContext.Provider>
    );
}

export function useRTL(): RTLContextType {
    const context = useContext(RTLContext);
    if (context === undefined) {
        throw new Error('useRTL must be used within an RTLProvider');
    }
    return context;
}

// Convenience hooks
export function useIsRTL(): boolean {
    const { isRTL } = useRTL();
    return isRTL;
}

export function useDirection(): LocaleDirection {
    const { direction } = useRTL();
    return direction;
}