import type { NavigationItem, NavigationConfig } from "@/types/navigation.types";

export function getTranslationKey(
    item: NavigationItem | NavigationConfig,
    type: 'label' | 'tooltip' | 'title' | 'description' = 'label',
    context?: 'group' | 'item'
): string {
    // Handle group translations
    if (context === 'group') {
        return `sidebar.group.${item.id}`;
    }

    // Handle item translations based on namespace
    const ns = item.namespace ?? 'sidebar.route'; // default namespace fallback

    switch (type) {
        case 'title':
            return `${ns}.${item.id}.title`;
        case 'description':
            return `${ns}.${item.id}.description`;
        case 'tooltip':
            // For tooltips, try description first, then title
            return `${ns}.${item.id}.description`;
        case 'label':
        default:
            // For menu items without children, use the key directly
            // For route items, this will be handled by the component logic
            return ns.includes('menu') ? `${ns}.${item.id}` : `${ns}.${item.id}.title`;
    }
}

// Helper function to get translation with proper fallback
export function getTranslatedText(
    t: (key: string, options?: any) => string,
    item: NavigationItem | NavigationConfig,
    type: 'label' | 'tooltip' | 'title' | 'description' = 'label',
    context?: 'group' | 'item'
): string {
    try {
        const key = getTranslationKey(item, type, context);
        const fallback = item.label ?? item.id ?? 'Unnamed';

        return t(key, { defaultValue: fallback });
    } catch (error) {
        console.error('Translation error in getTranslatedText:', {
            error,
            item: item.id,
            type,
            context,
            namespace: item.namespace
        });
        return item.label ?? item.id ?? 'Unnamed';
    }
}

// Special function for tooltip translation with smart fallback chain
export function getTooltipText(
    t: (key: string, options?: any) => string,
    item: NavigationItem,
    checkTranslationExists?: (key: string) => boolean
): string {
    try {
        const ns = item.namespace ?? 'sidebar.route';

        // If we have a way to check if translation exists, use it for smart fallback
        if (checkTranslationExists) {
            try {
                // 1. Try custom tooltip first
                if (item.tooltip) {
                    const tooltipKey = `${ns}.${item.tooltip}.tooltip`;
                    if (checkTranslationExists(tooltipKey)) {
                        return t(tooltipKey);
                    }
                }

                // 2. Try title (but only for route items, not menu items)
                if (!ns.includes('menu')) {
                    const titleKey = `${ns}.${item.id}.title`;
                    if (checkTranslationExists(titleKey)) {
                        return t(titleKey);
                    }
                }

                // 3. Try direct label (for menu items)
                const labelKey = `${ns}.${item.id}`;
                if (checkTranslationExists(labelKey)) {
                    return t(labelKey);
                }

                // 4. Try description last (but only for route items, not menu items)
                if (!ns.includes('menu')) {
                    const descriptionKey = `${ns}.${item.id}.description`;
                    if (checkTranslationExists(descriptionKey)) {
                        return t(descriptionKey);
                    }
                }
            } catch (error) {
                console.error('Translation error in getTooltipText (with checker):', {
                    error,
                    item: item.id,
                    namespace: ns,
                    hasTooltip: !!item.tooltip
                });
            }
        } else {
            // Fallback approach using next-intl's behavior
            // We'll try each key and see what we get back

            try {
                // 1. Try custom tooltip first
                if (item.tooltip) {
                    const tooltipKey = `${ns}.${item.tooltip}.tooltip`;
                    const tooltipResult = t(tooltipKey, { defaultValue: null });
                    if (tooltipResult !== null && tooltipResult !== tooltipKey) {
                        return tooltipResult;
                    }
                }
            } catch (error) {
                console.error('Translation error for custom tooltip:', {
                    error,
                    item: item.id,
                    tooltip: item.tooltip,
                    key: `${ns}.${item.tooltip}.tooltip`
                });
            }

            try {
                // 2. Try title (but only for route items, not menu items)
                if (!ns.includes('menu')) {
                    const titleKey = `${ns}.${item.id}.title`;
                    const titleResult = t(titleKey, { defaultValue: null });
                    if (titleResult !== null && titleResult !== titleKey) {
                        return titleResult;
                    }
                }
            } catch (error) {
                console.error('Translation error for title:', {
                    error,
                    item: item.id,
                    key: `${ns}.${item.id}.title`
                });
            }

            try {
                // 3. Try direct label (for menu items)
                const labelKey = `${ns}.${item.id}`;
                const labelResult = t(labelKey, { defaultValue: null });
                if (labelResult !== null && labelResult !== labelKey) {
                    return labelResult;
                }
            } catch (error) {
                console.error('Translation error for label:', {
                    error,
                    item: item.id,
                    key: `${ns}.${item.id}`
                });
            }

            try {
                // 4. Try description last (but only for route items, not menu items)
                if (!ns.includes('menu')) {
                    const descriptionKey = `${ns}.${item.id}.description`;
                    const descriptionResult = t(descriptionKey, { defaultValue: null });
                    if (descriptionResult !== null && descriptionResult !== descriptionKey) {
                        return descriptionResult;
                    }
                }
            } catch (error) {
                console.error('Translation error for description:', {
                    error,
                    item: item.id,
                    key: `${ns}.${item.id}.description`
                });
            }
        }
    } catch (error) {
        console.error('Critical translation error in getTooltipText:', {
            error,
            item: item.id,
            namespace: item.namespace
        });
    }

    // Final fallback if nothing is found
    return item.label ?? item.id ?? 'Unnamed';
}