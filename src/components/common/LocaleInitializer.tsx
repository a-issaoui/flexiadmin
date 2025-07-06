'use client'
import { useEffect, useRef } from 'react'
import { useLocaleStore } from '@/stores/locale.store'
import { LocaleCookie } from '@/config/locales.config'

interface LocaleInitializerProps {
    initialLocale: LocaleCookie
}

export function LocaleInitializer({ initialLocale }: LocaleInitializerProps) {
    const initializeFromCookies = useLocaleStore((state) => state.initializeFromCookies)
    const initialized = useRef(false)

    useEffect(() => {
        if (!initialized.current) {
            initializeFromCookies(initialLocale)
            initialized.current = true
        }
    }, [initializeFromCookies, initialLocale])

    return null
}