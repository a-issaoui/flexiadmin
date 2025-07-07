// src/config/navigation/teacher.navigation.ts

import type { NavigationGroup, SafeColor } from './types';
import { NavigationActions } from "@/lib/navigation/navigation-actions";

/**
 * Teacher navigation configuration with classroom and student management features.
 */
export const teacherNavigation: NavigationGroup[] = [
    {
        id: 'dashboard',
        labelKey: 'navigation.teacher.groups.dashboard',
        items: [
            {
                id: 'overview',
                labelKey: 'navigation.teacher.items.overview',
                href: '/teacher',
                icon: { name: 'WindowsLogoIcon', weight: 'duotone' },
            },
            {
                id: 'my-classes',
                labelKey: 'navigation.teacher.items.myClasses',
                href: '/teacher/classes',
                icon: { name: 'UsersIcon', weight: 'duotone' },
                color: '#3b82f6' as SafeColor,
                badge: {
                    value: 6,
                    variant: 'outline',
                    color: '#3b82f6' as SafeColor,
                },
            },
        ],
    },
    {
        id: 'teaching',
        labelKey: 'navigation.teacher.groups.teaching',
        items: [
            {
                id: 'lessons',
                labelKey: 'navigation.teacher.items.lessons',
                icon: { name: 'BookIcon', weight: 'duotone' },
                color: '#10b981' as SafeColor,
                dotColor: '#f59e0b' as SafeColor,
                children: [
                    {
                        id: 'lesson-plans',
                        labelKey: 'navigation.teacher.items.lessonPlans',
                        href: '/teacher/lessons/plans',
                        icon: { name: 'FileTextIcon', weight: 'duotone' },
                        badge: {
                            value: 'Draft',
                            variant: 'default',
                            color: '#f59e0b' as SafeColor,
                        },
                    },
                    {
                        id: 'assignments',
                        labelKey: 'navigation.teacher.items.assignments',
                        href: '/teacher/assignments',
                        icon: { name: 'ClipboardIcon', weight: 'duotone' },
                        badge: {
                            value: 12,
                            variant: 'default',
                            color: '#ef4444' as SafeColor,
                        },
                    },
                ],
            },
            {
                id: 'assessments',
                labelKey: 'navigation.teacher.items.assessments',
                href: '/teacher/assessments',
                icon: { name: 'ChartBarIcon', weight: 'duotone' },
                color: '#8b5cf6' as SafeColor,
                actions: [
                    {
                        id: 'create-assessment',
                        label: 'Create Assessment',
                        icon: { name: 'PlusIcon', weight: 'regular' },
                        handler: () => NavigationActions.createAssessment()
                    },
                ],
            },
        ],
    },
    {
        id: 'students',
        labelKey: 'navigation.teacher.groups.students',
        items: [
            {
                id: 'student-list',
                labelKey: 'navigation.teacher.items.studentList',
                href: '/teacher/students',
                icon: { name: 'UsersIcon', weight: 'duotone' },
                color: '#06b6d4' as SafeColor,
                badge: {
                    value: 142,
                    variant: 'outline',
                    color: '#06b6d4' as SafeColor,
                },
            },
            {
                id: 'grades',
                labelKey: 'navigation.teacher.items.grades',
                href: '/teacher/grades',
                icon: { name: 'StarIcon', weight: 'duotone' },
                color: '#f59e0b' as SafeColor,
                actions: [
                    {
                        id: 'export-grades',
                        label: 'Export Grades',
                        icon: { name: 'DownloadIcon', weight: 'regular' },
                        handler: () => NavigationActions.exportGrades()
                    },
                ],
            },
            {
                id: 'attendance',
                labelKey: 'navigation.teacher.items.attendance',
                href: '/teacher/attendance',
                icon: { name: 'CheckCircleIcon', weight: 'duotone' },
                color: '#10b981' as SafeColor,
            },
        ],
    },
    {
        id: 'communication',
        labelKey: 'navigation.teacher.groups.communication',
        items: [
            {
                id: 'messages',
                labelKey: 'navigation.teacher.items.messages',
                href: '/teacher/messages',
                icon: { name: 'ChatIcon', weight: 'duotone' },
                color: '#ec4899' as SafeColor,
                badge: {
                    value: 5,
                    variant: 'default',
                    color: '#ef4444' as SafeColor,
                },
            },
            {
                id: 'announcements',
                labelKey: 'navigation.teacher.items.announcements',
                href: '/teacher/announcements',
                icon: { name: 'SpeakerIcon', weight: 'duotone' },
                color: '#f59e0b' as SafeColor,
            },
        ],
    },
];