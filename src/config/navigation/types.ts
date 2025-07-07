// src/config/navigation/types.ts

import type { IconProps } from "@/components/common/icon";
import type { SafeColor } from '@/lib/color-validation';

// Export SafeColor for other files to use
export type { SafeColor };

// Badge types
export type BadgeVariant = "default" | "outline" | "ghost";
export type BadgeShape = "default" | "square" | "circular";

/**
 * Navigation badge configuration
 */
export interface NavigationBadge {
    value?: string | number;
    color?: SafeColor;
    variant?: BadgeVariant;
    shape?: BadgeShape;
}

/**
 * Navigation action configuration for dropdown menus and quick actions
 */
export interface NavigationAction {
    id: string;
    label: string;
    icon?: IconProps;
    handler: () => void | Promise<void>;
}

/**
 * A single navigation item - enhanced with all the features you need
 */
export interface NavigationItem {
    id: string;                         // Unique identifier for this item
    labelKey: string;                   // Translation key for the display text
    href?: string;                      // Direct URL - no complex generation needed
    icon?: IconProps;                   // Full icon configuration with proper typing
    color?: SafeColor;                     // Custom color for the item (CSS color value)
    dotColor?: SafeColor;                  // Color for the pulsing dot indicator
    badge?: NavigationBadge;            // Badge configuration
    actions?: NavigationAction[];       // Dropdown actions for this item
    children?: NavigationItem[];        // Child navigation items
    defaultExpanded?: boolean;          // Whether children start expanded

    // Future permission properties (optional for now)
    requiredPermissions?: string[];     // Permissions needed to see this item
    permissionMode?: 'any' | 'all';    // Whether user needs any or all permissions
    fallbackBehavior?: 'hide' | 'disable' | 'show';  // What to do without permissions
    disabled?: boolean;                 // Whether the item is currently disabled
}

/**
 * A group of related navigation items with enhanced configuration
 */
export interface NavigationGroup {
    id: string;                         // Unique identifier for this group
    labelKey: string;                   // Translation key for group heading
    color?: SafeColor;                     // Custom color for the group header
    icon?: IconProps;                   // Optional icon for the group header
    items: NavigationItem[];            // Items within this group
    collapsible?: boolean;              // Whether the group can be collapsed
    defaultOpen?: boolean;              // Whether group starts expanded
    actions?: NavigationAction[];       // Actions available for the entire group

    // Future permission properties
    requiredPermissions?: string[];     // Permissions needed to see this entire group
}

/**
 * Processed navigation item with resolved translations and enhanced features
 */
export interface ProcessedNavigationItem {
    id: string;
    label: string;                      // Resolved translation
    href?: string;
    icon?: IconProps;                   // Full icon configuration
    color?: SafeColor;                     // Custom color for styling
    dotColor?: SafeColor;                  // Color for pulsing dot
    badge?: NavigationBadge;            // Badge with resolved translations
    actions?: NavigationAction[];       // Available actions
    children?: ProcessedNavigationItem[];
    defaultExpanded?: boolean;
    disabled?: boolean;
    isActive?: boolean;                 // Computed active state
}

/**
 * Processed navigation group with resolved translations and enhanced features
 */
export interface ProcessedNavigationGroup {
    id: string;
    label: string;                      // Resolved translation
    color?: SafeColor;                     // Custom color for group
    icon?: IconProps;                   // Group icon
    items: ProcessedNavigationItem[];
    collapsible?: boolean;
    defaultOpen?: boolean;
    actions?: NavigationAction[];       // Group-level actions
}

/**
 * User permissions interface for future permission system
 */
export interface UserPermissions {
    roles: string[];                    // User's assigned roles
    permissions: string[];              // Specific permissions user has
    hasPermission: (permission: string) => boolean;
    hasAnyPermission: (permissions: string[]) => boolean;
    hasAllPermissions: (permissions: string[]) => boolean;
}