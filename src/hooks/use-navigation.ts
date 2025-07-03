// src/hooks/use-navigation.ts

import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import { adminNavigation } from '@/config/navigation/admin.navigation';
import { teacherNavigation } from '@/config/navigation/teacher.navigation';
import { studentNavigation } from '@/config/navigation/student.navigation';
import { parentNavigation } from '@/config/navigation/parent.navigation';
import { translateNavigation } from '@/lib/navigation-utils';
import { filterNavigationByPermissions } from '@/lib/navigation-permissions';
import type { ProcessedNavigationGroup, UserPermissions } from '@/config/navigation/types';

/**
 * Simple, straightforward hook for admin navigation.
 * No complex abstraction - just gets admin navigation and applies translations.
 */
export function useAdminNavigation(userPermissions?: UserPermissions): ProcessedNavigationGroup[] {
    const t = useTranslations();

    return useMemo(() => {
        // Translate all the navigation items
        const translatedNavigation = translateNavigation(adminNavigation, t);

        // Apply permission filtering if permissions are provided
        if (userPermissions) {
            return filterNavigationByPermissions(translatedNavigation, userPermissions);
        }

        return translatedNavigation;
    }, [t, userPermissions]);
}

/**
 * Simple, straightforward hook for teacher navigation.
 */
export function useTeacherNavigation(userPermissions?: UserPermissions): ProcessedNavigationGroup[] {
    const t = useTranslations();

    return useMemo(() => {
        const translatedNavigation = translateNavigation(teacherNavigation, t);

        if (userPermissions) {
            return filterNavigationByPermissions(translatedNavigation, userPermissions);
        }

        return translatedNavigation;
    }, [t, userPermissions]);
}

/**
 * Simple, straightforward hook for student navigation.
 */
export function useStudentNavigation(userPermissions?: UserPermissions): ProcessedNavigationGroup[] {
    const t = useTranslations();

    return useMemo(() => {
        const translatedNavigation = translateNavigation(studentNavigation, t);

        if (userPermissions) {
            return filterNavigationByPermissions(translatedNavigation, userPermissions);
        }

        return translatedNavigation;
    }, [t, userPermissions]);
}

/**
 * Simple, straightforward hook for parent navigation.
 */
export function useParentNavigation(userPermissions?: UserPermissions): ProcessedNavigationGroup[] {
    const t = useTranslations();

    return useMemo(() => {
        const translatedNavigation = translateNavigation(parentNavigation, t);

        if (userPermissions) {
            return filterNavigationByPermissions(translatedNavigation, userPermissions);
        }

        return translatedNavigation;
    }, [t, userPermissions]);
}

/**
 * Dynamic hook that returns navigation based on role.
 * Use this when you need to switch navigation based on the current user's role.
 */
export function useRoleNavigation(role: string, userPermissions?: UserPermissions): ProcessedNavigationGroup[] {
    const adminNav = useAdminNavigation(userPermissions);
    const teacherNav = useTeacherNavigation(userPermissions);
    const studentNav = useStudentNavigation(userPermissions);
    const parentNav = useParentNavigation(userPermissions);

    switch (role) {
        case 'admin':
            return adminNav;
        case 'teacher':
            return teacherNav;
        case 'student':
            return studentNav;
        case 'parent':
            return parentNav;
        default:
            console.warn(`Unknown role: ${role}, defaulting to admin navigation`);
            return adminNav;
    }
}