// src/components/features/navigation/vertical-navigation/components/nav-recursive-item.tsx

import React, { memo, useState, useCallback, useMemo, useEffect } from 'react';
import Link from 'next/link';
import {
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubItem,
    useSidebar,
} from '@/components/ui/sidebar';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';
import { Icon } from '@/components/common/icon';
import type { ProcessedNavigationItem } from '@/config/navigation/types';
import NavPulsingDot from '@/components/navigation/vertical-navigation/components/nav-pulsing-dot';
import NavBadge from '@/components/navigation/vertical-navigation/components/nav-badge';
import NavActions from '@/components/navigation/vertical-navigation/components/nav-actions';
import { sanitizeColor } from '@/lib/utils/color-utils';
import { useNavigationStore } from '@/stores/navigation.store';
import { useIsMobile } from "@/stores/mobile.store";

interface NavRecursiveItemProps {
    item: ProcessedNavigationItem;
    currentPath: string;
    onMenuClick: (item: ProcessedNavigationItem, event?: React.MouseEvent) => void;
    level: number;
}

/**
 * Enhanced navigation item component with correct pulsing dot logic
 */
const NavRecursiveItem: React.FC<NavRecursiveItemProps> = ({
                                                               item,
                                                               currentPath,
                                                               onMenuClick,
                                                               level
                                                           }) => {
    const { state,collapsible } = useSidebar();
    const hasChildren = !!item.children?.length;
    const isSubmenu = level > 0;

    // Enhanced active state calculation
    const isActive = useMemo(() => {
        const checkActive = (navItem: ProcessedNavigationItem): boolean => {
            if (navItem.href === currentPath) return true;
            return navItem.children?.some(checkActive) ?? false;
        };
        return checkActive(item);
    }, [item, currentPath]);

    /**
     * CORRECTED LOGIC: Pulsing dots should only show for collapsible parent items
     * when their children (or nested children) have badges.
     *
     * This function recursively checks if any descendant has a badge.
     */
    const hasDescendantBadges = useMemo(() => {
        if (!hasChildren) return false;

        const checkDescendantBadges = (navItem: ProcessedNavigationItem): boolean => {
            // Check if this item has a badge
            if (navItem.badge?.value !== undefined && navItem.badge?.value !== null && navItem.badge?.value !== '') {
                return true;
            }

            // Recursively check children
            if (navItem.children?.length) {
                return navItem.children.some(checkDescendantBadges);
            }

            return false;
        };

        return item.children?.some(checkDescendantBadges) ?? false;
    }, [hasChildren, item.children]);

    /**
     * Determine if pulsing dot should be shown.
     * Only show for:
     * 1. Items that have children (collapsible items)
     * 2. When those children (or their descendants) have badges
     * 3. When sidebar is collapsed (so badges aren't visible)
     */
    const shouldShowPulsingDot = useMemo(() => {
        return hasChildren && hasDescendantBadges && state === 'collapsed';
    }, [hasChildren, hasDescendantBadges, state]);

    /**
     * Enhanced menu state management with persistence
     */
    const { expandedItems, setItemExpanded } = useNavigationStore();
    
    // Check if any descendant is active to determine initial open state
    const hasActiveDescendant = useMemo(() => {
        if (!hasChildren) return false;
        
        const checkActiveDescendant = (navItem: ProcessedNavigationItem): boolean => {
            if (navItem.href === currentPath) return true;
            return navItem.children?.some(checkActiveDescendant) ?? false;
        };
        
        return item.children?.some(checkActiveDescendant) ?? false;
    }, [hasChildren, item.children, currentPath]);
    
    // Determine if item should be open (from store, defaultExpanded, or has active descendant)
    const shouldBeOpen = expandedItems[item.id] ?? item.defaultExpanded ?? hasActiveDescendant ?? false;
    const [isOpen, setIsOpen] = useState(shouldBeOpen);
    
    // Sync with store when shouldBeOpen changes
    useEffect(() => {
        if (shouldBeOpen !== isOpen) {
            setIsOpen(shouldBeOpen);
        }
    }, [shouldBeOpen, isOpen]);
    
    // Update store when active descendant is detected
    useEffect(() => {
        if (hasActiveDescendant && !expandedItems[item.id]) {
            setItemExpanded(item.id, true);
        }
    }, [hasActiveDescendant, item.id, expandedItems, setItemExpanded]);
    
    const shouldShowExpandedIndicator = useMemo(() => {
        return hasChildren && hasDescendantBadges && state !== 'collapsed' && !isOpen;
    }, [hasChildren, hasDescendantBadges, state, isOpen]);

    const isMobile = useIsMobile()

    const handleTriggerClick = useCallback(
        (e: React.MouseEvent) => {
            // Don't do anything if the item is disabled
            if (item.disabled) {
                e.preventDefault();
                e.stopPropagation();
                return;
            }

            if (hasChildren) {
                const newOpenState = !isOpen;
                setIsOpen(newOpenState);
                setItemExpanded(item.id, newOpenState);
            } else if (item.href) {
                onMenuClick(item, e);
            }
        },
        [hasChildren, item, onMenuClick, isOpen, setItemExpanded]
    );
    // Dynamic sizing based on nesting level for better visual hierarchy
    const getIconSize = () => {
        if (level === 0) return 20; // Main level
        if (level === 1) return 18; // First submenu
        if (level === 2) return 16; // Second submenu
        return 12; // Deeper levels
    };
    
    const getGapSize = () => {
        if (level === 0) return 'gap-2.5'; // Main level
        if (level === 1) return 'gap-2'; // First submenu
        if (level === 2) return 'gap-1.5'; // Second submenu
        return 'gap-1'; // Deeper levels
    };
    
    const getMinHeight = () => {
        if (level === 0) return 'min-h-[36px]'; // Main level
        if (level === 1) return 'min-h-[32px]'; // First submenu - smaller
        if (level === 2) return 'min-h-[30px]'; // Second submenu - even smaller
        return 'min-h-[28px]'; // Deeper levels - smallest
    };
    
    const getTextSize = () => {
        if (level === 0) return 'text-sm'; // Main level
        if (level === 1) return 'text-xs'; // First submenu
        return 'text-xs'; // Deeper levels
    };

    const renderMenuContent = () => {
        // COLLAPSED SIDEBAR MODE — show icon only
        if (state === 'collapsed' && collapsible != 'none' && !isMobile) {
            return (
                <div className="relative flex items-center justify-center w-full">
                    <Icon
                        {...item.icon}
                        name={item.icon?.name as "HouseIcon"}
                        size={getIconSize() || 20}
                        className={cn("flex-shrink-0", item.disabled && "opacity-50")}
                        color={item.disabled ? undefined : (sanitizeColor(item.icon?.color) || "currentColor")}
                    />
                    {shouldShowPulsingDot && (
                        <div className="absolute -top-2 end-0.5">
                            <NavPulsingDot color={item.dotColor || '#10b981'} size={level > 0 ? 'sm' : 'md'} />
                        </div>
                    )}
                </div>
            );
        }

        // EXPANDED SIDEBAR MODE — show full content
        return (
            <>
                {/* Icon */}
                {item.icon && (
                    <div className="relative">
                        <Icon
                            {...item.icon}
                            size={getIconSize()}
                            className={cn("flex-shrink-0", item.disabled && "opacity-50")}
                            color={item.disabled ? undefined : (sanitizeColor(item.icon.color) || "currentColor")}
                        />
                        {shouldShowPulsingDot && (
                            <div className="absolute -top-1.5 -end-0.5">
                                <NavPulsingDot color={item.dotColor || '#10b981'} size={level > 0 ? 'sm' : 'md'} />
                            </div>
                        )}
                    </div>
                )}

                {/* Label and pulsing dot indicator */}
                <span className="flex-1 truncate flex items-center min-w-0">
                <span
                    className={cn("truncate", getTextSize(), item.disabled && "opacity-50")}
                    style={{
                        color: item.disabled ? undefined : sanitizeColor(item.color),
                    }}
                >
                    {item.label}
                </span>
                    {shouldShowExpandedIndicator && (
                        <span className="ms-1">
                        <NavPulsingDot color={item.dotColor || '#10b981'} size={level > 0 ? 'sm' : 'md'} />
                    </span>
                    )}
            </span>

                {/* Badge */}
                {item.badge && <NavBadge badge={item.badge} level={level} />}

                {/* Actions */}
                {item.actions && (
                    <NavActions
                        actions={item.actions}
                        size={level > 0 ? "sm" : "md"}
                        sideOffset={hasChildren ? 44 : 20}
                    />
                )}

                {/* Expand icon */}
                {hasChildren && (
                    <Icon
                        name="CaretRightIcon"
                        size={level > 0 ? 12 : 14}
                        className={cn(
                            'transition-transform duration-200 flex-shrink-0',
                            item.disabled && "opacity-50",
                            isOpen
                                ? 'ltr:rotate-90 rtl:rotate-90'
                                : 'ltr:rotate-0 rtl:rotate-180'
                        )}
                        color={item.disabled ? undefined : (sanitizeColor(item.color) || "currentColor")}
                    />
                )}
            </>
        );
    };

    const buttonProps = {
        isActive,
        tooltip: state === 'collapsed' ? item.label : undefined,
        className: cn(
            'w-full',
            getGapSize(),
            getMinHeight(),
            // Enhanced mobile touch targets
            isMobile && level > 0 && 'min-h-[40px]',

            item.disabled && 'cursor-not-allowed opacity-50'
        ),
        disabled: item.disabled,
    };

    const ItemContainer = isSubmenu ? SidebarMenuSubItem : SidebarMenuItem;

    // Parent items with children
    if (hasChildren) {
        return (
            <Collapsible open={isOpen} onOpenChange={setIsOpen} asChild>
                <ItemContainer>
                    <CollapsibleTrigger asChild>
                        <SidebarMenuButton {...buttonProps} onClick={handleTriggerClick}>
                            {renderMenuContent()}
                        </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                        <SidebarMenuSub>
                            {(item.children ?? []).map((child) => (
                                <NavRecursiveItem
                                    key={child.id}
                                    item={child}
                                    currentPath={currentPath}
                                    onMenuClick={onMenuClick}
                                    level={level + 1}
                                />
                            ))}
                        </SidebarMenuSub>
                    </CollapsibleContent>
                </ItemContainer>
            </Collapsible>
        );
    }

    // Leaf items that navigate to pages - these should NEVER show pulsing dots
    return (
        <ItemContainer>
            <SidebarMenuButton asChild {...buttonProps}>
                <Link
                    href={item.href ?? '#'}
                    onClick={(e) => {
                        if (item.disabled) {
                            e.preventDefault();
                            e.stopPropagation();
                            return;
                        }
                        e.preventDefault();
                        onMenuClick(item, e);
                    }}
                    className={cn(
                        'w-full flex items-center',
                        getGapSize(),
                        getMinHeight(),
                        // Enhanced mobile touch targets
                        isMobile && level > 0 && 'min-h-[40px]'
                    )}
                    aria-disabled={item.disabled}
                    style={{
                        // Apply custom color to the entire link if specified
                        color: item.disabled ? undefined : sanitizeColor(item.color)
                    }}
                >
                    {renderMenuContent()}
                </Link>
            </SidebarMenuButton>
        </ItemContainer>
    );
};

NavRecursiveItem.displayName = 'NavRecursiveItem';

export default memo(NavRecursiveItem);