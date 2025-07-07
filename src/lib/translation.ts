import type { NavigationItem } from "@/config/navigation/types";

// Temporary NavigationConfig type until it's properly defined
interface NavigationConfig {
  labelKey?: string;
  label?: string;
}

export function getTranslationKey(
    item: NavigationItem | NavigationConfig,
    type: 'label' | 'tooltip' | 'title' | 'description' = 'label',
    context?: 'group' | 'item'
): string {
    if (context === 'group') {
        return `sidebar.group.${item.id}`;
    }

    // Default namespace
    const ns = item.namespace ?? 'route';

    // For items that don't need nested keys (like menu items)
    if (ns === 'sidebar.menu') {
        return `${ns}.${item.id}`;
    }

    switch (type) {
        case 'title':
            return `${ns}.${item.id}.title`;
        case 'description':
            return `${ns}.${item.id}.description`;
        case 'tooltip':
            return `${ns}.${item.id}.description`;
        case 'label':
        default:
            // Always return title key to get a string
            return `${ns}.${item.id}.title`;
    }
}

// Helper function to get translation with proper fallback
export function getTranslatedText(
    t: (key: string, options?: any) => string,
    item: NavigationItem | NavigationConfig,
    type: 'label' | 'tooltip' | 'title' | 'description' = 'label',
    context?: 'group' | 'item'
): string {
    const key = getTranslationKey(item, type, context);
    const fallback = item.label ?? item.id ?? 'Unnamed';

    try {
        const translated = t(key, { defaultValue: fallback });
        // If translation returns the key itself, use fallback
        return translated === key ? fallback : translated;
    } catch (error) {
        console.warn(`Translation error for key: ${key}`, error);
        return fallback;
    }
}

// Special function for tooltip translation with smart fallback chain
export function getTooltipText(
    t: (key: string, options?: any) => string,
    item: NavigationItem,
    checkTranslationExists?: (key: string) => boolean
): string {
    const ns = item.namespace ?? 'route';
    const fallback = item.label ?? item.id ?? 'Unnamed';

    // For menu items, just use the simple key
    if (ns === 'sidebar.menu') {
        try {
            const translated = t(`${ns}.${item.id}`, { defaultValue: fallback });
            return translated === `${ns}.${item.id}` ? fallback : translated;
        } catch (error) {
            console.warn(`Translation error for menu item: ${item.id}`, error);
            return fallback;
        }
    }

    // For route items, try the description key
    const descriptionKey = `${ns}.${item.id}.description`;
    const titleKey = `${ns}.${item.id}.title`;

    // If we have a way to check translation existence
    if (checkTranslationExists) {
        if (checkTranslationExists(descriptionKey)) {
            return t(descriptionKey);
        }
        if (checkTranslationExists(titleKey)) {
            return t(titleKey);
        }
        return fallback;
    }

    // Otherwise, try with error handling
    try {
        // Try description first for tooltips
        const description = t(descriptionKey, { defaultValue: null });
        if (description && description !== descriptionKey) {
            return description;
        }

        // Then try title
        const title = t(titleKey, { defaultValue: null });
        if (title && title !== titleKey) {
            return title;
        }

        return fallback;
    } catch (error) {
        console.warn(`Translation error for tooltip: ${item.id}`, error);
        return fallback;
    }
}