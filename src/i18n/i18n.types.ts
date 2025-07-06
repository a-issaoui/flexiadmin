export interface TranslationValues {
    [key: string]: string | number | boolean | Date;
}

export interface FormatOptions {
    dateTime?: Intl.DateTimeFormatOptions;
    number?: Intl.NumberFormatOptions;
    currency?: string;
}