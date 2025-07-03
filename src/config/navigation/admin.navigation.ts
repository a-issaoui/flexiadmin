import type { NavigationConfig } from '@/types/navigation.types';
import { gethrefById } from '../routes';

export const adminNavigation: NavigationConfig[] = [
    {
        id: 'group-dashboard',
        label: 'Dashboard',
        children: [
            {
                id: 'dashboard',
                icon: { name: 'WindowsLogoIcon', weight: 'duotone' },
                href: gethrefById('dashboard', 'admin'),
                namespace: 'routes',
            },
        ],
    },
    {
        id: 'group-users',
        label: 'Users',
        children: [
            {
                id: 'users',
                icon: { name: 'UsersIcon', weight: 'duotone' },
                href: gethrefById('users'),
                namespace: 'routes',
            },
            {
                id: 'roles&permissions',
                icon: { name: 'ShieldIcon', weight: 'duotone' },
                namespace: 'sidebar.menu',
                children: [
                    {
                        id: 'roles',
                        href: gethrefById('roles'),
                        icon: { name: 'DetectiveIcon', weight: 'duotone' },
                        namespace: 'routes',
                    },
                    {
                        id: 'permissions',
                        href: gethrefById('permissions'),
                        icon: { name: 'ListChecksIcon', weight: 'duotone' },
                        namespace: 'routes',
                    },
                ],
            },
        ],
    },
    {
        id: 'group-settings',
        label: 'Settings',
        children: [
            {
                id: 'settings',
                icon: { name: 'GearIcon', weight: 'duotone' },
                href: gethrefById('settings'),
                namespace: 'routes',
            },
        ],
    },
];