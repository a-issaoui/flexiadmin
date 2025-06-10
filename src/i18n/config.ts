import { localeCodes, defaultLocale } from "@/lib/config/locales"
import type { LocaleCode } from "@/types/locale"

// Re-export for consistency
export type Locale = LocaleCode
export const locales = localeCodes

// Helper to get all supported locales
export { localesConfig as getSupportedLocales } from "@/lib/config/locales"

// Export default locale
export { defaultLocale }