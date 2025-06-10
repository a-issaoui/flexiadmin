// src/i18n/request.ts
import { getRequestConfig } from 'next-intl/server';
import { headers } from 'next/headers';
import { defaultLocale } from '@/lib/config/locales';
import type { LocaleCode } from '@/types/locale';

export default getRequestConfig(async () => {
    // Get locale from middleware header (set in middleware.ts)
    const headersList = await headers();
    const locale = (headersList.get('x-locale') as LocaleCode) || defaultLocale;

    return {
        locale,
        messages: (await import(`./messages/${locale}.json`)).default,
        timeZone: 'UTC',
        now: new Date(),
    };
});