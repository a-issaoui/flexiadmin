import { getRequestConfig } from 'next-intl/server';
import { getLocaleDataSSR } from "@/lib/cookies/locale/locale-cookie.server";

export default getRequestConfig(async () => {
    const { locale } = await getLocaleDataSSR();

    return {
        locale,
        messages: (await import(`./messages/${locale}.json`)).default,
        timeZone: 'UTC',
        now: new Date(),
    };
});