'use client'
import { useLocalePersistence } from '@/hooks/useLocalePersistence'
import { LocaleInitializer } from './LocaleInitializer'
import { LocaleCookie } from '@/config/locales.config'

interface LocaleProviderProps {
    children: React.ReactNode
    initialLocale: LocaleCookie
}

export function LocaleProvider({ children, initialLocale }: LocaleProviderProps) {
    // Set up cookie persistence
    useLocalePersistence()

    return (
        <>
            <LocaleInitializer initialLocale={initialLocale} />
            {children}
        </>
    )
}