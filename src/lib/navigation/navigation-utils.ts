// Simplified Navigation Utils
import type { NavigationItem, NavigationGroup, ProcessedNavigationItem, ProcessedNavigationGroup } from '@/config/navigation/types';

/**
 * Translate a navigation item
 */
export function translateNavigationItem(
    item: NavigationItem,
    t: (key: string) => string
): ProcessedNavigationItem {
    return {
        id: item.id,
        label: t(item.labelKey),
        href: item.href,
        icon: item.icon,
        color: item.color,
        dotColor: item.dotColor,
        badge: item.badge,
        actions: item.actions,
        children: item.children?.map(child => translateNavigationItem(child, t)),
        defaultExpanded: item.defaultExpanded,
        disabled: item.disabled,
    };
}

/**
 * Translate a navigation group
 */
export function translateNavigationGroup(
    group: NavigationGroup,
    t: (key: string) => string
): ProcessedNavigationGroup {
    return {
        id: group.id,
        label: t(group.labelKey),
        color: group.color,
        icon: group.icon,
        items: group.items.map(item => translateNavigationItem(item, t)),
        collapsible: group.collapsible,
        defaultOpen: group.defaultOpen,
        actions: group.actions,
    };
}

/**
 * Translate entire navigation configuration
 */
export function translateNavigation(
    navigationGroups: NavigationGroup[],
    t: (key: string) => string
): ProcessedNavigationGroup[] {
    return navigationGroups.map(group => translateNavigationGroup(group, t));
}

/**
 * Get basic page info from pathname
 */
export function getPageInfo(pathname: string, t: (key: string) => string): { title: string; description: string } {
    const pathSegments = pathname.split('/').filter(Boolean);
    
    if (pathSegments.length >= 2) {
        const [role, page] = pathSegments;
        const titleKey = `pages.${role}.${page}.title`;
        const descriptionKey = `pages.${role}.${page}.description`;
        
        return {
            title: t(titleKey),
            description: t(descriptionKey)
        };
    }
    
    return {
        title: 'Dashboard',
        description: ''
    };
}