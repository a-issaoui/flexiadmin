// src/config/navigation/student.navigation.ts

import type { NavigationGroup, SafeColor } from './types';
import { NavigationActions } from "@/lib/navigation/navigation-actions";

/**
 * Student navigation configuration with learning and academic features.
 */
export const studentNavigation: NavigationGroup[] = [
    {
        id: 'dashboard',
        labelKey: 'navigation.student.groups.dashboard',
        items: [
            {
                id: 'overview',
                labelKey: 'navigation.student.items.overview',
                href: '/student',
                icon: { name: 'WindowsLogoIcon', weight: 'duotone' },
            },
            {
                id: 'schedule',
                labelKey: 'navigation.student.items.schedule',
                href: '/student/schedule',
                icon: { name: 'CalendarIcon', weight: 'duotone' },
                color: '#3b82f6' as SafeColor,
                badge: {
                    value: 'Today',
                    variant: 'default',
                    color: '#10b981' as SafeColor,
                },
            },
        ],
    },
    {
        id: 'academics',
        labelKey: 'navigation.student.groups.academics',
        items: [
            {
                id: 'courses',
                labelKey: 'navigation.student.items.courses',
                icon: { name: 'BookIcon', weight: 'duotone' },
                color: '#10b981' as SafeColor,
                dotColor: '#f59e0b' as SafeColor,
                children: [
                    {
                        id: 'current-courses',
                        labelKey: 'navigation.student.items.currentCourses',
                        href: '/student/courses/current',
                        icon: { name: 'BookOpenIcon', weight: 'duotone' },
                        badge: {
                            value: 6,
                            variant: 'outline',
                            color: '#3b82f6' as SafeColor,
                        },
                    },
                    {
                        id: 'materials',
                        labelKey: 'navigation.student.items.materials',
                        href: '/student/materials',
                        icon: { name: 'FolderIcon', weight: 'duotone' },
                        badge: {
                            value: 'New',
                            variant: 'default',
                            color: '#f59e0b' as SafeColor,
                        },
                    },
                ],
            },
            {
                id: 'assignments',
                labelKey: 'navigation.student.items.assignments',
                href: '/student/assignments',
                icon: { name: 'ClipboardIcon', weight: 'duotone' },
                color: '#f59e0b' as SafeColor,
                badge: {
                    value: 3,
                    variant: 'default',
                    color: '#ef4444' as SafeColor,
                },
                actions: [
                    {
                        id: 'submit-assignment',
                        label: 'Submit Assignment',
                        icon: { name: 'PaperPlaneIcon', weight: 'regular' },
                        handler: () => NavigationActions.submitAssignment()
                    },
                ],
            },
        ],
    },
    {
        id: 'performance',
        labelKey: 'navigation.student.groups.performance',
        items: [
            {
                id: 'grades',
                labelKey: 'navigation.student.items.grades',
                href: '/student/grades',
                icon: { name: 'StarIcon', weight: 'duotone' },
                color: '#f59e0b' as SafeColor,
            },
            {
                id: 'progress',
                labelKey: 'navigation.student.items.progress',
                href: '/student/progress',
                icon: { name: 'ChartBarIcon', weight: 'duotone' },
                color: '#8b5cf6' as SafeColor,
                actions: [
                    {
                        id: 'view-report',
                        label: 'View Report',
                        icon: { name: 'FileTextIcon', weight: 'regular' },
                        handler: () => NavigationActions.viewProgressReport()
                    },
                ],
            },
            {
                id: 'certificates',
                labelKey: 'navigation.student.items.certificates',
                href: '/student/certificates',
                icon: { name: 'AwardIcon', weight: 'duotone' },
                color: '#10b981' as SafeColor,
            },
        ],
    },
    {
        id: 'resources',
        labelKey: 'navigation.student.groups.resources',
        items: [
            {
                id: 'library',
                labelKey: 'navigation.student.items.library',
                href: '/student/library',
                icon: { name: 'LibraryIcon', weight: 'duotone' },
                color: '#06b6d4' as SafeColor,
            },
            {
                id: 'help',
                labelKey: 'navigation.student.items.help',
                href: '/student/help',
                icon: { name: 'QuestionMarkIcon', weight: 'duotone' },
                color: '#ec4899' as SafeColor,
            },
        ],
    },
    {
        id: 'communication',
        labelKey: 'navigation.student.groups.communication',
        items: [
            {
                id: 'messages',
                labelKey: 'navigation.student.items.messages',
                href: '/student/messages',
                icon: { name: 'ChatIcon', weight: 'duotone' },
                color: '#ec4899' as SafeColor,
                badge: {
                    value: 2,
                    variant: 'default',
                    color: '#ef4444' as SafeColor,
                },
            },
            {
                id: 'forum',
                labelKey: 'navigation.student.items.forum',
                href: '/student/forum',
                icon: { name: 'ChatCircleIcon', weight: 'duotone' },
                color: '#f59e0b' as SafeColor,
            },
        ],
    },
];