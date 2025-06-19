// src/data/sidebar-data.ts
import { getUrlById } from '@/lib/routes';
import type { TypeSidebarData } from '@/types/sidebar-data';

export const sidebarData: TypeSidebarData = [
    {
        id: 'group-dashboard',
        title: 'Dashboard',
        collapsible:true,
        actions: [
            {
                id:'refresh',
                label: 'refresh',
                icon: { name: 'ArrowsClockwise' , weight: 'duotone'},
                customHandler: 'refresh',
            }
        ],
        menu: [
            {
                id: 'dashboard',
                icon: { name: 'WindowsLogoIcon', weight: 'duotone' },
                url: getUrlById('dashboard','admin'),
            },
        ],
    },
    {
        id: 'group-users',
        title: 'Users Management',
        menu: [
            {
                id: 'users',
                icon: { name: 'UsersIcon', weight: 'duotone' },
                url: getUrlById('users'),
            },
            {
                id: 'roles&permissions',
                title: 'Role & permissions',
                icon: { name: 'ShieldIcon' , weight: 'duotone' },
                submenu: [
                    {
                        id: 'roles',
                        url: getUrlById('roles'),
                        icon: { name: 'DetectiveIcon' , weight: 'duotone' },
                    },
                    {
                        id: 'permissions',
                        url: getUrlById('permissions'),
                        icon: { name: 'ListChecksIcon' , weight: 'duotone' },
                    },
                ],
            },
        ],
    },
    {
        id: 'group-settings',
        title: 'Settings',
        menu: [
            {
                id: 'settings',
                icon: { name: 'GearIcon' , weight: 'duotone', color:'red' },
                url: getUrlById('settings'),
                actions: [
                    {
                        id:'refresh',
                        label: 'refresh',
                        icon: { name: 'ArrowsClockwise' , weight: 'duotone'},
                        customHandler: 'refresh',
                    }
                    ]
            },
        ],
    },
];
