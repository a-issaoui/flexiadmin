import { getRequestConfig } from 'next-intl/server'
import { getUserLocale } from '@/store/locale-store'

export default getRequestConfig(async () => {
    // Get locale from cookies
    const { lang: locale } = await getUserLocale()

    try {
        const messages = (await import(`./messages/${locale}.json`)).default

        return {
            locale,
            messages
        }
    } catch (error) {
        console.error(`Failed to load messages for locale ${locale}:`, error)

        // Return empty messages to prevent crashes
        return {
            locale,
            messages: {}
        }
    }
})