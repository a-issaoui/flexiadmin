// navigation.types.ts
import type { IconProps } from "@/components/common/icon";
import { BadgeVariant, BadgeShape } from "@/components/ui/badge";

export interface NavigationItem {
    id: string;
    label?: string;
    href?: string;
    icon?: IconProps;
    color?: string;
    dotColor?: string;
    isActive?: boolean;
    tooltip?: string;
    defaultExpanded?: boolean;
    badge?: NavigationBadge;
    children?: NavigationItem[];
    actions?: NavigationAction[];
    namespace?: 'menu' | 'route' | string; // Allow custom namespaces
}

export interface NavigationConfig {
    id: string;
    label?: string;
    color?: string;
    icon?: IconProps;
    collapsible?: boolean;
    defaultOpen?: boolean;
    actions?: NavigationAction[];
    children: NavigationItem[];
    namespace?: 'menu' | 'route' | string; // Add namespace support for groups
}

export interface NavigationBadge {
    value?: string | number;
    color?: string;
    variant?: BadgeVariant;
    shape?: BadgeShape;
}

export interface NavigationAction {
    id: string;
    label: string;
    icon?: IconProps;
    handler: () => void | Promise<void>;
}