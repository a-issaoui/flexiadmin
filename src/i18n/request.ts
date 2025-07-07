// src/i18n/request.ts
import { getRequestConfig } from 'next-intl/server';
import { getLocaleDataSSR } from "@/lib/cookies/locale/locale-cookie.server";

export default getRequestConfig(async () => {
    const { locale } = await getLocaleDataSSR();

    // Load the actual messages for the current locale during SSR
    let messages = {};

    try {
        // Dynamically import the messages for the current locale
        const messagesModule = await import(`@/i18n/messages/${locale}.json`);
        messages = messagesModule.default || {};
        console.log(`🚀 SSR loaded ${locale} messages with ${Object.keys(messages).length} keys`);
    } catch (error) {
        console.error(`❌ Failed to load SSR messages for ${locale}:`, error);
        // Fallback to English if the locale fails to load
        try {
            const fallbackModule = await import(`@/i18n/messages/en.json`);
            messages = fallbackModule.default || {};
            console.log(`🔄 SSR fallback to English messages`);
        } catch (fallbackError) {
            console.error('❌ Failed to load fallback English messages:', fallbackError);
        }
    }

    return {
        locale,
        messages,
        timeZone: 'UTC',
        now: new Date(),
    };
});