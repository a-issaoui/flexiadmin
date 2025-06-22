import { getRequestConfig } from 'next-intl/server';
import { getUserLocale } from "@/stores/locale.store";

export default getRequestConfig(async () => {
    const { lang } = await getUserLocale();

    return {
        locale: lang,
        messages: (await import(`./messages/${lang}.json`)).default,
        timeZone: 'UTC',
        now: new Date(),
    };
});