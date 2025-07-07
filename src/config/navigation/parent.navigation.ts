// src/config/navigation/parent.navigation.ts

import type { NavigationGroup, SafeColor } from './types';
import { NavigationActions } from "@/lib/navigation/navigation-actions";

/**
 * Parent navigation configuration with child monitoring and communication features.
 */
export const parentNavigation: NavigationGroup[] = [
    {
        id: 'dashboard',
        labelKey: 'navigation.parent.groups.dashboard',
        items: [
            {
                id: 'overview',
                labelKey: 'navigation.parent.items.overview',
                href: '/parent',
                icon: { name: 'WindowsLogoIcon', weight: 'duotone' },
            },
            {
                id: 'my-children',
                labelKey: 'navigation.parent.items.myChildren',
                href: '/parent/children',
                icon: { name: 'UsersIcon', weight: 'duotone' },
                color: '#3b82f6' as SafeColor,
                badge: {
                    value: 2,
                    variant: 'outline',
                    color: '#3b82f6' as SafeColor,
                },
            },
        ],
    },
    {
        id: 'academic-tracking',
        labelKey: 'navigation.parent.groups.academicTracking',
        items: [
            {
                id: 'grades',
                labelKey: 'navigation.parent.items.grades',
                icon: { name: 'StarIcon', weight: 'duotone' },
                color: '#f59e0b' as SafeColor,
                dotColor: '#ef4444' as SafeColor,
                children: [
                    {
                        id: 'current-grades',
                        labelKey: 'navigation.parent.items.currentGrades',
                        href: '/parent/grades/current',
                        icon: { name: 'ChartBarIcon', weight: 'duotone' },
                        badge: {
                            value: 'Updated',
                            variant: 'default',
                            color: '#10b981' as SafeColor,
                        },
                    },
                    {
                        id: 'report-cards',
                        labelKey: 'navigation.parent.items.reportCards',
                        href: '/parent/report-cards',
                        icon: { name: 'FileTextIcon', weight: 'duotone' },
                        badge: {
                            value: 'New',
                            variant: 'default',
                            color: '#f59e0b' as SafeColor,
                        },
                    },
                ],
            },
            {
                id: 'attendance',
                labelKey: 'navigation.parent.items.attendance',
                href: '/parent/attendance',
                icon: { name: 'CheckCircleIcon', weight: 'duotone' },
                color: '#10b981' as SafeColor,
                actions: [
                    {
                        id: 'view-attendance-report',
                        label: 'View Attendance Report',
                        icon: { name: 'FileTextIcon', weight: 'regular' },
                        handler: () => NavigationActions.viewAttendanceReport()
                    },
                ],
            },
            {
                id: 'assignments',
                labelKey: 'navigation.parent.items.assignments',
                href: '/parent/assignments',
                icon: { name: 'ClipboardIcon', weight: 'duotone' },
                color: '#8b5cf6' as SafeColor,
                badge: {
                    value: 5,
                    variant: 'default',
                    color: '#ef4444' as SafeColor,
                },
            },
        ],
    },
    {
        id: 'communication',
        labelKey: 'navigation.parent.groups.communication',
        items: [
            {
                id: 'messages',
                labelKey: 'navigation.parent.items.messages',
                href: '/parent/messages',
                icon: { name: 'ChatIcon', weight: 'duotone' },
                color: '#ec4899' as SafeColor,
                badge: {
                    value: 3,
                    variant: 'default',
                    color: '#ef4444' as SafeColor,
                },
            },
            {
                id: 'teacher-meetings',
                labelKey: 'navigation.parent.items.teacherMeetings',
                href: '/parent/meetings',
                icon: { name: 'CalendarIcon', weight: 'duotone' },
                color: '#06b6d4' as SafeColor,
                actions: [
                    {
                        id: 'schedule-meeting',
                        label: 'Schedule Meeting',
                        icon: { name: 'PlusIcon', weight: 'regular' },
                        handler: () => NavigationActions.scheduleMeeting()
                    },
                ],
            },
            {
                id: 'announcements',
                labelKey: 'navigation.parent.items.announcements',
                href: '/parent/announcements',
                icon: { name: 'SpeakerIcon', weight: 'duotone' },
                color: '#f59e0b' as SafeColor,
            },
        ],
    },
    {
        id: 'school-info',
        labelKey: 'navigation.parent.groups.schoolInfo',
        items: [
            {
                id: 'events',
                labelKey: 'navigation.parent.items.events',
                href: '/parent/events',
                icon: { name: 'CalendarEventIcon', weight: 'duotone' },
                color: '#10b981' as SafeColor,
                badge: {
                    value: 'Upcoming',
                    variant: 'outline',
                    color: '#10b981' as SafeColor,
                },
            },
            {
                id: 'school-calendar',
                labelKey: 'navigation.parent.items.schoolCalendar',
                href: '/parent/calendar',
                icon: { name: 'CalendarIcon', weight: 'duotone' },
                color: '#3b82f6' as SafeColor,
            },
            {
                id: 'resources',
                labelKey: 'navigation.parent.items.resources',
                href: '/parent/resources',
                icon: { name: 'LibraryIcon', weight: 'duotone' },
                color: '#06b6d4' as SafeColor,
            },
        ],
    },
    {
        id: 'settings',
        labelKey: 'navigation.parent.groups.settings',
        items: [
            {
                id: 'notifications',
                labelKey: 'navigation.parent.items.notifications',
                href: '/parent/notifications',
                icon: { name: 'BellIcon', weight: 'duotone' },
                color: '#f59e0b' as SafeColor,
            },
            {
                id: 'profile',
                labelKey: 'navigation.parent.items.profile',
                href: '/parent/profile',
                icon: { name: 'UserIcon', weight: 'duotone' },
                color: '#6b7280' as SafeColor,
            },
        ],
    },
];