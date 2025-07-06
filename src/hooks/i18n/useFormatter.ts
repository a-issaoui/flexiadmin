// hooks/useFormatter.ts - Perfect formatting hook
'use client';
import { useMemo } from 'react';
import { useLocaleStore } from '@/stores/locale.store';
import {
    createDateTimeFormatter,
    createNumberFormatter,
    createCurrencyFormatter,
    createPercentFormatter,
    createRelativeTimeFormatter,
    getTimezone,
} from '@/i18n/formatters';

export function useFormatter() {
    const { lang, _hydrated } = useLocaleStore();

    return useMemo(() => {
        if (!_hydrated) {
            return {
                dateTime: (date: Date) => date.toISOString(),
                number: (num: number) => num.toString(),
                currency: (num: number) => num.toString(),
                percent: (num: number) => `${num}%`,
                relativeTime: (date: Date) => date.toISOString(),
                timeZone: 'UTC',
            };
        }

        const dateTimeFormatter = createDateTimeFormatter(lang);
        const numberFormatter = createNumberFormatter(lang);
        const currencyFormatter = createCurrencyFormatter(lang);
        const percentFormatter = createPercentFormatter(lang);
        const relativeTimeFormatter = createRelativeTimeFormatter(lang);

        return {
            dateTime: (date: Date, options?: Intl.DateTimeFormatOptions) => {
                if (options) {
                    return createDateTimeFormatter(lang, options).format(date);
                }
                return dateTimeFormatter.format(date);
            },

            number: (num: number, options?: Intl.NumberFormatOptions) => {
                if (options) {
                    return createNumberFormatter(lang, options).format(num);
                }
                return numberFormatter.format(num);
            },

            currency: (num: number) => {
                return currencyFormatter.format(num);
            },

            percent: (num: number) => {
                return percentFormatter.format(num);
            },

            relativeTime: (date: Date) => {
                const diff = (date.getTime() - Date.now()) / 1000;

                if (Math.abs(diff) < 60) return relativeTimeFormatter.format(Math.round(diff), 'second');
                if (Math.abs(diff) < 3600) return relativeTimeFormatter.format(Math.round(diff / 60), 'minute');
                if (Math.abs(diff) < 86400) return relativeTimeFormatter.format(Math.round(diff / 3600), 'hour');
                return relativeTimeFormatter.format(Math.round(diff / 86400), 'day');
            },

            timeZone: getTimezone(lang),
        };
    }, [lang, _hydrated]);
}