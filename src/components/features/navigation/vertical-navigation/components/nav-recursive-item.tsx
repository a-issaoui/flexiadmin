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

const NavRecursiveItem: React.FC<NavRecursiveItemProps> = ({
                                                               item,
                                                               currentPath,
                                                               onMenuClick,
                                                               level
                                                           }) => {
    const { state } = useSidebar();
    const hasChildren = !!item.children?.length;
    const isSubmenu = level > 0;
    const isCollapsed = state === 'collapsed';

    const isActive = useMemo(() => {
        const checkActive = (navItem: ProcessedNavigationItem): boolean => {
            if (navItem.href === currentPath) return true;
            return navItem.children?.some(checkActive) ?? false;
        };
        return checkActive(item);
    }, [item, currentPath]);

    const hasDescendantBadges = useMemo(() => {
        if (!hasChildren) return false;
        const checkDescendantBadges = (navItem: ProcessedNavigationItem): boolean => {
            if (navItem.badge?.value !== undefined && navItem.badge?.value !== null && navItem.badge?.value !== '') {
                return true;
            }
            if (navItem.children?.length) {
                return navItem.children.some(checkDescendantBadges);
            }
            return false;
        };
        return item.children?.some(checkDescendantBadges) ?? false;
    }, [hasChildren, item.children]);

    const shouldShowPulsingDot = useMemo(() => {
        return hasChildren && hasDescendantBadges && isCollapsed;
    }, [hasChildren, hasDescendantBadges, isCollapsed]);

    const [isOpen, setIsOpen] = useState(item.defaultExpanded ?? isActive);

    const handleTriggerClick = useCallback(
        (e: React.MouseEvent) => {
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

    // 🎯 FIXED: Proper icon centering with consistent sizing
    const renderIcon = () => {
        if (!item.icon) return null;

        return (
            <div className={cn(
                // ✅ CRITICAL: Consistent container sizing for all states
                "relative flex items-center justify-center shrink-0",
                // ✅ Fixed size container that doesn't change between states
                "w-5 h-5",
                // ✅ Ensure submenu icons are slightly smaller but still centered
                isSubmenu && "w-4 h-4"
            )}>
                <Icon
                    {...item.icon}
                    // ✅ CRITICAL: Consistent icon sizing
                    size={isSubmenu ? 14 : 16}
                    className={cn(
                        // ✅ Remove any margin/padding that could offset centering
                        "shrink-0",
                        // ✅ Ensure icon fills container properly
                        "w-full h-full",
                        item.disabled && "opacity-50"
                    )}
                    color={item.disabled ? undefined : (sanitizeColor(item.icon.color) || "currentColor")}
                />

                {/* ✅ FIXED: Pulsing dot positioned relative to icon container */}
                {shouldShowPulsingDot && (
                    <div className="absolute -top-2 -end-1.25">
                        <NavPulsingDot color={item.dotColor || '#10b981'} size="sm" />
                    </div>
                )}
            </div>
        );
    };

    // 🎯 FIXED: Proper content rendering that handles collapsed state
    const renderMenuContent = () => (
        <>
            {/* ✅ Icon with proper centering */}
            {renderIcon()}

            {/* ✅ CRITICAL: Content that disappears completely in collapsed state */}
            <div className={cn(
                "flex items-center justify-between flex-1 min-w-0",
                // ✅ Hide content in collapsed state, not just make transparent
                isCollapsed && "sr-only"
            )}>
                {/* Label and indicator */}
                <span className={cn(
                    "flex items-center flex-1 min-w-0",
                    item.disabled && "opacity-50"
                )}>
                    <span
                        className="truncate"
                        style={{
                            color: item.disabled ? undefined : sanitizeColor(item.color)
                        }}
                    >
                        {item.label}
                    </span>

                    {/* Expanded indicator for non-collapsed state */}
                    {hasChildren && hasDescendantBadges && !isCollapsed && !isOpen && (
                        <span className="ms-1 mb-3">
                            <NavPulsingDot color={item.dotColor || '#10b981'} size="sm" />
                        </span>
                    )}
                </span>

                {/* Right side content */}
                <div className="flex items-center gap-1 ml-2">
                    {/* Badge */}
                    {item.badge && <NavBadge badge={item.badge} />}

                    {/* Actions */}
                    {item.actions && (
                        <NavActions
                            actions={item.actions}
                            size="md"
                            sideOffset={hasChildren ? 44 : 20}
                        />
                    )}

                    {/* Expand indicator */}
                    {hasChildren && (
                        <Icon
                            name="CaretRightIcon"
                            size={14}
                            className={cn(
                                'transition-transform shrink-0',
                                item.disabled && "opacity-50",
                                isOpen
                                    ? 'rotate-90'
                                    : 'rotate-0'
                            )}
                            color={item.disabled ? undefined : (sanitizeColor(item.color) || "currentColor")}
                        />
                    )}
                </div>
            </div>
        </>
    );

    // ✅ CRITICAL: Proper button styling for collapsed state
    const buttonProps = {
        isActive,
        tooltip: isCollapsed ? item.label : undefined,
        className: cn(
            // ✅ Ensure consistent width and centering
            "w-full relative",
            // ✅ CRITICAL: Proper centering in collapsed state
            isCollapsed && [
                "justify-center", // Center content horizontally
                "px-0",           // Remove horizontal padding
                "h-8",            // Fixed height for consistency
            ],
            // ✅ Normal spacing for expanded state
            !isCollapsed && "justify-start px-2",
            // ✅ Disabled state
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
                    {/* ✅ Only render children in expanded sidebar */}
                    {!isCollapsed && (
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
                    )}
                </ItemContainer>
            </Collapsible>
        );
    }

    // Leaf items
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
                    className="w-full flex items-center"
                    aria-disabled={item.disabled}
                    style={{
                        color: item.disabled ? undefined : sanitizeColor(item.color)
                    }}
                >
                    {renderMenuContent()}
                </Link>
            </SidebarMenuButton>
        </ItemContainer>
    );
};

export default memo(NavRecursiveItem);