// data/sidebar-data.ts
import type { TypeSidebarData } from '@/types/sidebar-data';

export const sidebarData: TypeSidebarData = [
    {
        id: 'group-dashboard',
        title: 'Dashboard',
        color: '#1e40af',
        icon: { name: 'RocketIcon', size: 16, weight: 'regular' },
        defaultOpen: true,
        actions: [
            {
                id: 'refresh-all-dashboard',
                label: 'Refresh All',
                icon: { name: 'RocketIcon', size: 16, weight: 'regular' },
                tooltip: 'Reload all dashboard data',
                customHandler: 'refreshAllDashboards'
            },
            {
                id: 'export-dashboard-data',
                label: 'Export Data',
                icon: { name: 'Download', size: 16, weight: 'regular' },
                tooltip: 'Export dashboard as CSV',
                customHandler: 'exportDashboardData'
            }
        ],
        menu: [
            {
                id: 'menu-overview',
                title: 'Overview',
                icon: { name: 'HouseLineIcon', size: 20, weight: 'regular', color: '#1f2937' },
                url: '/admin/overview',
                color: '#1f2937',
                badge: { count: 5, color: '#fb0000', variant: 'outline', shape: 'circular' },
                tooltip: 'Dashboard overview',
                actions: [
                    {
                        id: 'refresh-overview',
                        label: 'Refresh',
                        icon: { name: 'RocketIcon', size: 16, weight: 'regular' },
                        customHandler: 'refreshOverview'
                    }
                ]
            },
            {
                id: 'menu-reports',
                title: 'Reports',
                icon: { name: 'ChargingStationIcon', size: 20, weight: 'regular' },
                url: '/admin/reports',
                dotColor: '#f4a907',
                tooltip: 'View reports',
                submenu: [
                    {
                        id: 'submenu-daily',
                        title: 'Daily Report',
                        url: '/admin/reports/daily',
                        icon: { name: 'Calendar', size: 18, weight: 'regular', color: '#2563eb' },
                        color: '#2563eb',
                        badge: { count: '2', color: '#0651e6', variant: 'outline', shape: 'circular' },
                        tooltip: 'Daily insights'
                    },
                    {
                        id: 'submenu-weekly',
                        title: 'Weekly Report',
                        url: '/admin/reports/weekly',
                        icon: { name: 'CalendarCheck', size: 18, weight: 'regular', color: '#16a34a' },
                        color: '#16a34a',
                        badge: { count: '1', color: '#000000', variant: 'ghost', shape: 'default' },
                        tooltip: 'Weekly performance'
                    }
                ]
            }
        ]
    },
    {
        id: 'group-management',
        title: 'Management',
        color: '#7c3aed',
        icon: { name: 'Download', size: 16, weight: 'regular' },
        collapsible: true,
        defaultOpen: true,
        actions: [
            {
                id: 'invite-user',
                label: 'Invite User',
                icon: { name: 'UserPlus', size: 16, weight: 'regular' },
                tooltip: 'Send invitation link',
                customHandler: 'openInviteModal'
            }
        ],
        menu: [
            {
                id: 'menu-users',
                title: 'Users',
                icon: { name: 'Users', size: 20, weight: 'regular', color: '#f4a907' },
                url: '/admin/users',
                color: '#0651e6',
                badge: { count: '99+', color: '#0651e6', variant: 'default', shape: 'circular' },
                tooltip: 'Manage users',
                actions: [
                    {
                        id: 'add-user',
                        label: 'Add User',
                        icon: { name: 'UserPlus', size: 16, weight: 'regular' },
                        customHandler: 'openUserForm'
                    }
                ]
            },
            {
                id: 'menu-teams',
                title: 'Teams',
                icon: { name: 'Users', size: 20, weight: 'regular', color: '#ea580c' },
                url: '/admin/teams',
                color: '#ea580c',
                badge: { count: 'New', color: '#fb0000', variant: 'outline', shape: 'default' },
                tooltip: 'Manage team roles and permissions'
            },
            {
                id: 'menu-settings',
                title: 'Settings',
                icon: { name: 'GearIcon', size: 20, weight: 'regular', color: '#6b7280' },
                url: '/admin/settings',
                color: '#6b7280',
                tooltip: 'Platform configuration',
                actions: [
                    {
                        id: 'reset-settings',
                        label: 'Reset Settings',
                        icon: { name: 'SidebarIcon', size: 16, weight: 'regular' },
                        customHandler: 'resetAllSettings'
                    }
                ]
            }
        ]
    },
    {
        id: 'group-management2',
        title: 'Advanced Management',
        color: '#dc2626',
        collapsible: true,
        defaultOpen: true,
        menu: [
            {
                id: 'menu-analytics',
                title: 'Analytics',
                icon: { name: 'FileTextIcon', size: 20, weight: 'regular', color: '#dc2626' },
                url: '/admin/analytics',
                color: '#dc2626',
                badge: { count: 8, color: '#2cbf0b', variant: 'default', shape: 'default' },
                tooltip: 'View analytics dashboard',
                actions: [
                    {
                        id: 'export-analytics',
                        label: 'Export Data',
                        icon: { name: 'Download', size: 16, weight: 'regular' },
                        customHandler: 'exportAnalytics'
                    }
                ]
            },
            {
                id: 'menu-security',
                title: 'Security',
                icon: { name: 'Shield', size: 20, weight: 'regular', color: '#059669' },
                url: '/admin/security',
                color: '#059669',
                badge: { count: 'Beta', color: '#0dc0e8', variant: 'outline', shape: 'default' },
                tooltip: 'Security settings and logs'
            },
            {
                id: 'menu-advanced-settings',
                title: 'Advanced Settings',
                icon: { name: 'Code', size: 20, weight: 'regular', color: '#7c3aed' },
                url: '/admin/advanced-settings',
                color: '#7c3aed',
                tooltip: 'Advanced configuration options',
                actions: [
                    {
                        id: 'backup-settings',
                        label: 'Backup Settings',
                        icon: { name: 'Archive', size: 16, weight: 'regular' },
                        customHandler: 'backupSettings'
                    }
                ],
                submenu: [
                    {
                        id: 'submenu-api-config',
                        title: 'API Configuration',
                        url: '/admin/advanced-settings/api',
                        icon: { name: 'Code', size: 18, weight: 'regular', color: '#2563eb' },
                        color: '#2563eb',
                        badge: { count: '3', color: '#e1a60f', variant: 'outline', shape: 'circular' },
                        tooltip: 'Configure API endpoints'
                    },
                    {
                        id: 'submenu-webhooks',
                        title: 'Webhooks',
                        url: '/admin/advanced-settings/webhooks',
                        icon: { name: 'HoodieIcon', size: 18, weight: 'regular', color: '#dc2626' },
                        color: '#dc2626',
                        badge: { count: '1', color: '#dc2626', variant: 'ghost', shape: 'circular' },
                        tooltip: 'Manage webhook endpoints',
                        actions: [
                            {
                                id: 'test-webhooks',
                                label: 'Test Webhooks',
                                icon: { name: 'TestTube', size: 16, weight: 'regular' },
                                customHandler: 'testWebhooks'
                            }
                        ]
                    }
                ]
            }
        ]
    },
    {
        // Group without title - will render as ungrouped items
        menu: [
            {
                id: 'menu-quick-overview',
                title: 'Quick Overview',
                icon: { name: 'BellZIcon', size: 20, weight: 'regular', color: '#dc0b48' },
                url: '/admin/quick-overview',
                color: '#dc0b48',
                badge: { count: 5, color: '#dc0b48', variant: 'default', shape: 'circular' },
                tooltip: 'Quick overview dashboard',
                actions: [
                    {
                        id: 'refresh-quick',
                        label: 'Quick Refresh',
                        icon: { name: 'UsersIcon', size: 16, weight: 'regular' },
                        customHandler: 'refreshQuick'
                    }
                ]
            },
            {
                id: 'menu-notifications',
                title: 'Notifications',
                icon: { name: 'Bell', size: 20, weight: 'regular', color: '#f4a907' },
                url: '/admin/notifications',
                color: '#0735f4',
                dotColor: '#dc0b48',
                tooltip: 'Manage notifications',
                submenu: [
                    {
                        id: 'submenu-email-notifications',
                        title: 'Email Notifications',
                        url: '/admin/notifications/email',
                        icon: { name: 'MessengerLogoIcon', size: 18, weight: 'regular', color: '#2563eb' },
                        color: '#2563eb',
                         tooltip: 'Configure email notifications'
                    },
                    {
                        id: 'submenu-push-notifications',
                        title: 'Push Notifications',
                        url: '/admin',
                        icon: { name: 'DeviceMobileIcon', size: 18, weight: 'regular', color: '#dc0b48' },
                        color: '#16a34a',
                        tooltip: 'Configure push notifications'
                    }
                ]
            }
        ]
    }
];