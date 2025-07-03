// src/lib/navigation-utils.ts

import type { NavigationItem, NavigationGroup, ProcessedNavigationItem, ProcessedNavigationGroup, NavigationAction } from '@/config/navigation/types';

/**
 * Enhanced function to translate a navigation item with all features preserved
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
        badge: item.badge ? {
            ...item.badge,
            // If badge has a labelKey, translate it, otherwise use the direct value
            value: typeof item.badge.value === 'string' && item.badge.value.includes('.')
                ? t(item.badge.value)
                : item.badge.value
        } : undefined,
        actions: item.actions ? translateNavigationActions(item.actions, t) : undefined,
        children: item.children?.map(child => translateNavigationItem(child, t)),
        defaultExpanded: item.defaultExpanded,
        disabled: item.disabled,
    };
}

/**
 * Enhanced function to translate a navigation group with all features preserved
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
        actions: group.actions ? translateNavigationActions(group.actions, t) : undefined,
    };
}

/**
 * Function to translate navigation actions
 */
export function translateNavigationActions(
    actions: NavigationAction[],
    t: (key: string) => string
): NavigationAction[] {
    return actions.map(action => ({
        ...action,
        label: t(`actions.${action.id}`) || action.label, // Fallback to original label if translation fails
    }));
}

/**
 * Enhanced function to translate an entire navigation configuration
 */
export function translateNavigation(
    navigationGroups: NavigationGroup[],
    t: (key: string) => string
): ProcessedNavigationGroup[] {
    return navigationGroups.map(group => translateNavigationGroup(group, t));
}

/**
 * Enhanced helper to get page metadata with better path recognition
 */
export function getPageInfo(pathname: string, t: (key: string) => string): { title: string; description: string } {
    // Enhanced mapping with more comprehensive path coverage
    const pageMap: Record<string, { titleKey: string; descriptionKey: string }> = {
        // Admin pages
        '/admin': { titleKey: 'pages.admin.dashboard.title', descriptionKey: 'pages.admin.dashboard.description' },
        '/admin/analytics': { titleKey: 'pages.admin.analytics.title', descriptionKey: 'pages.admin.analytics.description' },
        '/admin/users': { titleKey: 'pages.admin.users.title', descriptionKey: 'pages.admin.users.description' },
        '/admin/roles': { titleKey: 'pages.admin.roles.title', descriptionKey: 'pages.admin.roles.description' },
        '/admin/permissions': { titleKey: 'pages.admin.permissions.title', descriptionKey: 'pages.admin.permissions.description' },
        '/admin/settings': { titleKey: 'pages.admin.settings.title', descriptionKey: 'pages.admin.settings.description' },

        // Teacher pages
        '/teacher': { titleKey: 'pages.teacher.dashboard.title', descriptionKey: 'pages.teacher.dashboard.description' },
        '/teacher/schedule': { titleKey: 'pages.teacher.schedule.title', descriptionKey: 'pages.teacher.schedule.description' },
        '/teacher/classes': { titleKey: 'pages.teacher.classes.title', descriptionKey: 'pages.teacher.classes.description' },
        '/teacher/students': { titleKey: 'pages.teacher.students.title', descriptionKey: 'pages.teacher.students.description' },
        '/teacher/assignments': { titleKey: 'pages.teacher.assignments.title', descriptionKey: 'pages.teacher.assignments.description' },
        '/teacher/assignments/create': { titleKey: 'pages.teacher.createAssignment.title', descriptionKey: 'pages.teacher.createAssignment.description' },
        '/teacher/assignments/grade': { titleKey: 'pages.teacher.gradeAssignments.title', descriptionKey: 'pages.teacher.gradeAssignments.description' },
        '/teacher/gradebook': { titleKey: 'pages.teacher.gradebook.title', descriptionKey: 'pages.teacher.gradebook.description' },
        '/teacher/reports': { titleKey: 'pages.teacher.reports.title', descriptionKey: 'pages.teacher.reports.description' },

        // Student pages
        '/student': { titleKey: 'pages.student.dashboard.title', descriptionKey: 'pages.student.dashboard.description' },
        '/student/schedule': { titleKey: 'pages.student.schedule.title', descriptionKey: 'pages.student.schedule.description' },
        '/student/classes': { titleKey: 'pages.student.classes.title', descriptionKey: 'pages.student.classes.description' },
        '/student/assignments': { titleKey: 'pages.student.assignments.title', descriptionKey: 'pages.student.assignments.description' },
        '/student/assignments/current': { titleKey: 'pages.student.currentAssignments.title', descriptionKey: 'pages.student.currentAssignments.description' },
        '/student/assignments/completed': { titleKey: 'pages.student.completedAssignments.title', descriptionKey: 'pages.student.completedAssignments.description' },
        '/student/grades': { titleKey: 'pages.student.grades.title', descriptionKey: 'pages.student.grades.description' },

        // Parent pages
        '/parent': { titleKey: 'pages.parent.dashboard.title', descriptionKey: 'pages.parent.dashboard.description' },
        '/parent/children': { titleKey: 'pages.parent.children.title', descriptionKey: 'pages.parent.children.description' },
        '/parent/progress': { titleKey: 'pages.parent.progress.title', descriptionKey: 'pages.parent.progress.description' },
        '/parent/messages': { titleKey: 'pages.parent.messages.title', descriptionKey: 'pages.parent.messages.description' },
        '/parent/meetings': { titleKey: 'pages.parent.meetings.title', descriptionKey: 'pages.parent.meetings.description' },
    };

    const pageInfo = pageMap[pathname];

    if (!pageInfo) {
        // Try to extract role and page from path for dynamic pages
        const pathSegments = pathname.split('/').filter(Boolean);
        if (pathSegments.length >= 2) {
            const [role, page] = pathSegments;
            const fallbackTitleKey = `pages.${role}.${page}.title`;
            const fallbackDescriptionKey = `pages.${role}.${page}.description`;

            // Try the fallback translation
            try {
                const title = t(fallbackTitleKey);
                const description = t(fallbackDescriptionKey);

                // If translation succeeded (didn't return the key), use it
                if (title !== fallbackTitleKey) {
                    return { title, description };
                }
            } catch (error) {
                // Translation failed, fall through to default
                console.log(error)
            }
        }

        // Default fallback for unknown pages
        return {
            title: 'Page',
            description: ''
        };
    }

    return {
        title: t(pageInfo.titleKey),
        description: t(pageInfo.descriptionKey)
    };
}