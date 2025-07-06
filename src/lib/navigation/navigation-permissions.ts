// src/lib/navigation-permissions.ts
/**
 * This is our future permission filtering layer.
 * For now, it just passes navigation through unchanged.
 * Later, we'll add actual permission checking here.
 */
export function filterNavigationByPermissions(
    navigationGroups: NavigationGroup[],
    userPermissions?: UserPermissions
): NavigationGroup[] {

    // TODAY: Just return navigation as-is since we don't have permissions yet
    if (!userPermissions) {
        return navigationGroups;
    }

    // FUTURE: This is where we'll add permission filtering logic
    return navigationGroups
        .map(group => filterGroupByPermissions(group, userPermissions))
        .filter(group => group.items.length > 0); // Remove empty groups
}

function filterGroupByPermissions(
    group: NavigationGroup,
    userPermissions: UserPermissions
): NavigationGroup {

    // Check if user has access to this group at all
    if (group.requiredPermissions &&
        !userPermissions.hasAllPermissions(group.requiredPermissions)) {
        return { ...group, items: [] }; // Return empty group
    }

    // Filter items within the group
    const filteredItems = group.items
        .map(item => filterItemByPermissions(item, userPermissions))
        .filter(item => item !== null) as NavigationItem[];

    return {
        ...group,
        items: filteredItems
    };
}

function filterItemByPermissions(
    item: NavigationItem,
    userPermissions: UserPermissions
): NavigationItem | null {

    // If no permissions required, item is always visible
    if (!item.requiredPermissions || item.requiredPermissions.length === 0) {
        return item;
    }

    const hasRequiredPermissions = item.permissionMode === 'any'
        ? userPermissions.hasAnyPermission(item.requiredPermissions)
        : userPermissions.hasAllPermissions(item.requiredPermissions);

    // Handle different fallback behaviors
    if (!hasRequiredPermissions) {
        switch (item.fallbackBehavior) {
            case 'hide':
                return null; // Remove item completely
            case 'disable':
                return { ...item, disabled: true }; // Keep item but disable it
            case 'show':
            default:
                return item; // Keep item as-is
        }
    }

    // User has permissions - process children if they exist
    if (item.children) {
        const filteredChildren = item.children
            .map(child => filterItemByPermissions(child, userPermissions))
            .filter(child => child !== null) as NavigationItem[];

        return {
            ...item,
            children: filteredChildren
        };
    }

    return item;
}

// Helper function to create a mock permissions object for testing
export function createMockPermissions(permissions: string[]): UserPermissions {
    return {
        roles: ['user'], // Could be extracted from permissions
        permissions,
        hasPermission: (permission: string) => permissions.includes(permission),
        hasAnyPermission: (perms: string[]) => perms.some(p => permissions.includes(p)),
        hasAllPermissions: (perms: string[]) => perms.every(p => permissions.includes(p)),
    };
}