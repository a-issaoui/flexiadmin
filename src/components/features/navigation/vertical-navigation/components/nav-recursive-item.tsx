// src/components/features/navigation/vertical-navigation/components/nav-recursive-item.tsx

import React, { memo, useState, useCallback, useMemo } from 'react';
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
import NavPulsingDot from '@/components/features/navigation/vertical-navigation/components/nav-pulsing-dot';
import NavBadge from '@/components/features/navigation/vertical-navigation/components/nav-badge';
import NavActions from '@/components/features/navigation/vertical-navigation/components/nav-actions';
import { sanitizeColor } from '@/lib/color-validation';

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
    const { state } = useSidebar();
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
     * For expanded sidebar, show a small indicator if children have badges
     * but the menu is collapsed (closed, not sidebar collapsed)
     */
    const [isOpen, setIsOpen] = useState(item.defaultExpanded ?? isActive);
    const shouldShowExpandedIndicator = useMemo(() => {
        return hasChildren && hasDescendantBadges && state !== 'collapsed' && !isOpen;
    }, [hasChildren, hasDescendantBadges, state, isOpen]);



    const handleTriggerClick = useCallback(
        (e: React.MouseEvent) => {
            // Don't do anything if the item is disabled
            if (item.disabled) {
                e.preventDefault();
                e.stopPropagation();
                return;
            }

            if (hasChildren) {
                setIsOpen((prev) => !prev);
            } else if (item.href) {
                onMenuClick(item, e);
            }
        },
        [hasChildren, item, onMenuClick]
    );

    const renderMenuContent = () => (
        <>
            {/* Enhanced icon with pulsing dot logic */}
            {item.icon && (
                <div className="relative">
                    <Icon
                        {...item.icon}
                        size={isSubmenu ? 16 : 18}
                        className={cn(
                            "flex-shrink-0",
                            item.disabled && "opacity-50"
                        )}
                        color={item.disabled ? undefined : (sanitizeColor(item.icon.color) || "currentColor")}
                  />
                    {/* CORRECTED: Only show pulsing dot for collapsed sidebar with child badges */}
                    {shouldShowPulsingDot && (
                        <div className="absolute -top-2 -end-0.5">
                            <NavPulsingDot color={item.dotColor || '#10b981'}/>
                        </div>
                    )}
                </div>
            )}

            {/* Enhanced label with expanded indicator logic */}
            <span className="flex-1 truncate flex items-center min-w-0">
                <span
                    className={cn("truncate", item.disabled && "opacity-50")}
                    style={{
                        color: item.disabled ? undefined : sanitizeColor(item.color)
                    }}
                >
                    {item.label}
                </span>
                {/* CORRECTED: Show small indicator for expanded sidebar when menu is closed but has child badges */}
                {shouldShowExpandedIndicator && (
                    <span className="ms-1 mb-1">
                        <NavPulsingDot color={item.dotColor || '#10b981'} />
                    </span>
                )}
            </span>

            {/* Badge - only for this specific item, not related to children */}
            {item.badge && <NavBadge badge={item.badge} />}

            {/* Actions support */}
            {item.actions && (
                <NavActions
                    actions={item.actions}
                    size="md"
                    sideOffset={hasChildren ? 44 : 20}
                />
            )}

            {/* Enhanced expand indicator with custom color */}
            {hasChildren && (
                <Icon
                    name="CaretRightIcon"
                    className={cn(
                        'transition-transform flex-shrink-0',
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

    const buttonProps = {
        isActive,
        tooltip: state === 'collapsed' ? item.label : undefined,
        className: cn(
            'w-full',
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
                        onMenuClick(item, e);
                    }}
                    className="w-full flex items-center gap-2"
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