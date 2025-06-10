'use server'

import { cookies } from 'next/headers'
import { defaultLocale, localesConfig } from '@/lib/config/locales'
import type { LocaleCookie, LocaleCode } from '@/types/locale'

const COOKIE_NAME = `${process.env.NEXT_PUBLIC_APP_NAME || 'NEXT'}_LOCALE`
const ONE_YEAR = 60 * 60 * 24 * 365

export async function getUserLocale(): Promise<LocaleCookie> {
    try {
        const cookieStore = await cookies()
        const cookieValue = cookieStore.get(COOKIE_NAME)?.value

        if (cookieValue) {
            const parsed = JSON.parse(cookieValue) as LocaleCookie

            // Validate against actual config
            const isValid = localesConfig.some(
                ({ code, direction }) =>
                    code === parsed.lang && direction === parsed.dir
            )

            if (isValid) {
                return parsed
            }
        }
    } catch (error) {
        console.error('Failed to parse locale cookie:', error)
    }

    // Return default locale config
    const fallback = localesConfig.find(l => l.code === defaultLocale) || localesConfig[0]

    return {
        lang: fallback.code,
        dir: fallback.direction,
    }
}

export async function setUserLocale(lang: LocaleCode): Promise<void> {
    const config = localesConfig.find(l => l.code === lang)

    if (!config) {
        throw new Error(`Invalid locale code: ${lang}`)
    }

    const value: LocaleCookie = {
        lang: config.code,
        dir: config.direction,
    }

    const cookieStore = await cookies()

    cookieStore.set(COOKIE_NAME, JSON.stringify(value), {
        httpOnly: false, // Keep false for client-side access
        path: '/',
        maxAge: ONE_YEAR,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
    })
}

// New: Get locale from headers (for SSR optimization)
export async function getLocaleFromHeaders(): Promise<LocaleCode> {
    try {
        const userLocale = await getUserLocale()
        return userLocale.lang
    } catch {
        return defaultLocale
    }
}