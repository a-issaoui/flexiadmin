// src/i18n/request.ts
import { getRequestConfig } from 'next-intl/server';
import { getLocaleDataSSR } from "@/lib/cookies/locale/locale-cookie.server";

export default getRequestConfig(async () => {
    const { locale } = await getLocaleDataSSR();

    // We'll provide a minimal set of messages for SSR
    // The real messages will be loaded client-side
    return {
        locale,
        messages: {}, // Empty for now - client will handle this
        timeZone: 'UTC',
        now: new Date(),
    };
});