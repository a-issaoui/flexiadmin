// src/config/navigation/admin-navigation.ts

import type { NavigationGroup } from './types';
import {NavigationActions} from "@/lib/navigation-actions";
/**
 * Admin navigation demonstrating correct pulsing dot usage.
 * Pulsing dots will only appear on parent items when their children have badges.
 */
export const adminNavigation: NavigationGroup[] = [
    {
        id: 'overview',
        labelKey: 'navigation.admin.groups.overview',
        items: [
            {
                id: 'dashboard',
                labelKey: 'navigation.admin.items.dashboard',
                href: '/admin',
                icon: { name: 'WindowsLogoIcon', weight: 'duotone' },
            },
            {
                id: 'analytics',
                labelKey: 'navigation.admin.items.analytics',
                href: '/admin/analytics',
                icon: { name: 'ChartBarIcon', weight: 'duotone' },
                color: '#8b5cf6',
                // Leaf item - no pulsing dot even if we set dotColor
                actions: [
                    {
                        id: 'refresh-analytics',
                        label: 'Refresh Data',
                        icon: { name: 'ArrowClockwiseIcon', weight: 'regular' },
                        handler: () => NavigationActions.refreshAnalytics()
                    },
                ],
            },
        ],
    },
    {
        id: 'user-management',
        labelKey: 'navigation.admin.groups.userManagement',
        items: [
            {
                id: 'users',
                labelKey: 'navigation.admin.items.users',
                href: '/admin/users',
                icon: { name: 'UsersIcon', weight: 'duotone' ,color:'blue'},
                color: '#2cbf0b',
                requiredPermissions: ['users:read'],
                // Leaf item with badge - no pulsing dot since it has no children
                badge: {
                    value: 1247,
                    variant: 'outline',
                    color: '#6b7280'
                },
                actions: [
                    {
                        id: 'add-user',
                        label: 'Add User',
                        icon: { name: 'PlusIcon', weight: 'regular' },
                        handler: () => NavigationActions.addUser({ menuId: 'users' })
                    },
                ],
            },
            {
                id: 'roles&permissions',
                labelKey: 'navigation.admin.items.roles&permissions',
                icon: { name: 'ShieldIcon', weight: 'duotone' },
                color: '#f59e0b',
                // This item has children, so it CAN show pulsing dots when collapsed
                // The dot will appear because children have badges
                dotColor: '#ef4444', // Custom dot color
                defaultExpanded: false,
                children: [
                    {
                        id: 'roles',
                        labelKey: 'navigation.admin.items.roles',
                        href: '/admin/roles',
                        icon: { name: 'DetectiveIcon', weight: 'duotone' },
                        color: '#f59e0b',
                        requiredPermissions: ['roles:read'],
                        // This child has a badge - will trigger pulsing dot on parent when sidebar is collapsed
                        badge: {
                            value: 8,
                            variant: 'default',
                            shape: 'circular',
                            color: '#0735f4'
                        },
                    },
                    {
                        id: 'permissions',
                        labelKey: 'navigation.admin.items.permissions',
                        href: '/admin/permissions',
                        icon: { name: 'ListChecksIcon', weight: 'duotone' },
                        color: '#f59e0b',
                        requiredPermissions: ['permissions:read'],
                        // This child also has a badge - reinforces the pulsing dot behavior
                        badge: {
                            value: 'Updated',
                            variant: 'default',
                            color: '#2cbf0b'
                        },
                        actions: [
                            {
                                id: 'audit-permissions',
                                label: 'Audit Permissions',
                                icon: { name: 'MagnifyingGlassIcon', weight: 'regular' },
                                handler: () => NavigationActions.auditPermissions()
                            }
                        ],
                    },
                ],
            },
        ],
    },
    {
        id: 'system',
        labelKey: 'navigation.admin.groups.system',
        icon: { name: 'GearIcon', weight: 'duotone' },
        color: '#6b7280',
        items: [
            {
                id: 'settings',
                labelKey: 'navigation.admin.items.settings',
                href: '/admin/settings',
                icon: { name: 'GearIcon', weight: 'duotone' ,color:'blue'},
                color: '#6b7280',
                requiredPermissions: ['settings:write'],
                // Leaf item - no pulsing dot behavior
                actions: [
                    {
                        id: 'backup-settings',
                        label: 'Backup Settings',
                        icon: { name: 'DatabaseIcon', weight: 'regular' },
                        handler: () => NavigationActions.backupSettings()
                    },
                ],
            },
        ],
    },
];