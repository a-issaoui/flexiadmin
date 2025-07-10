// src/hooks/use-navigation.ts

import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import { adminNavigation } from '@/config/navigation/admin.navigation';
import { teacherNavigation } from '@/config/navigation/teacher.navigation';
import { studentNavigation } from '@/config/navigation/student.navigation';
import { parentNavigation } from '@/config/navigation/parent.navigation';
import { translateNavigation } from '@/lib/navigation/navigation-utils';
import type { ProcessedNavigationGroup } from '@/config/navigation/types';

/**
 * Simple, straightforward hook for admin navigation.
 * No complex abstraction - just gets admin navigation and applies translations.
 */
export function useAdminNavigation(): ProcessedNavigationGroup[] {
    const t = useTranslations();

    return useMemo(() => {
        // Translate all the navigation items
        return translateNavigation(adminNavigation, t);
    }, [t]);
}

/**
 * Simple, straightforward hook for teacher navigation.
 */
export function useTeacherNavigation(): ProcessedNavigationGroup[] {
    const t = useTranslations();

    return useMemo(() => {
        return translateNavigation(teacherNavigation, t);
    }, [t]);
}

/**
 * Simple, straightforward hook for student navigation.
 */
export function useStudentNavigation(): ProcessedNavigationGroup[] {
    const t = useTranslations();

    return useMemo(() => {
        return translateNavigation(studentNavigation, t);
    }, [t]);
}

/**
 * Simple, straightforward hook for parent navigation.
 */
export function useParentNavigation(): ProcessedNavigationGroup[] {
    const t = useTranslations();

    return useMemo(() => {
        return translateNavigation(parentNavigation, t);
    }, [t]);
}

/**
 * Dynamic hook that returns navigation based on role.
 * Use this when you need to switch navigation based on the current user's role.
 */
export function useRoleNavigation(role: string): ProcessedNavigationGroup[] {
    const adminNav = useAdminNavigation();
    const teacherNav = useTeacherNavigation();
    const studentNav = useStudentNavigation();
    const parentNav = useParentNavigation();

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