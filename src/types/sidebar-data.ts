import type { IconProps } from "@/components/shared/icon";

import {BadgeVariant,BadgeShape} from "@/components/ui/badge";

export interface SidebarBadge {
    count?: string | number;
    color?: string;
    variant?: BadgeVariant;
    shape?: BadgeShape;
}

// Menu Actions
export interface MenuAction {
    id: string;
    label: string;
    icon?: IconProps;
    customHandler?: string;
    tooltip?: string;
}

// Submenu Item
export interface SbSubMenu {
    id?: string;
    title: string;
    url: string;
    icon?: IconProps;
    color?: string;
    badge?: SidebarBadge;
    isActive?: boolean
    actions?: MenuAction[];
    tooltip?: string;
}

// Main Menu Item
export interface SbMenu {
    id?: string;
    title: string;
    icon?: IconProps;
    color?: string;
    dotColor?: string;
    url?: string;
    badge?: SidebarBadge;
    submenu?: SbSubMenu[];
    actions?: MenuAction[];
    isActive?: boolean
    tooltip?: string;
    defaultExpanded?: boolean;
}

// Menu Group
export interface SbGroup {
    id?: string;
    title?: string;
    icon?: IconProps;
    color?: string;
    collapsible?: boolean;
    defaultOpen?: boolean;
    menu: SbMenu[];
    actions?: MenuAction[];
}

// Full Sidebar Data Type - Fixed the type name
export type TypeSidebarData = SbGroup[];