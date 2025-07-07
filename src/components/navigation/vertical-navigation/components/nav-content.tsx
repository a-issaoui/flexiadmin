// src/components/features/navigation/vertical-navigation/components/nav-content.tsx

import React, { memo, useState } from 'react';
import {
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
} from '@/components/ui/sidebar';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import type { ProcessedNavigationGroup, ProcessedNavigationItem } from '@/config/navigation/types';
import NavRecursiveItem from '@/components/navigation/vertical-navigation/components/nav-recursive-item';
import NavActions from '@/components/navigation/vertical-navigation/components/nav-actions';
import { Icon } from '@/components/common/icon';
import { cn } from '@/lib/utils';

export type NavContentProps = {
    navigationGroups: ProcessedNavigationGroup[];
    currentPath: string;
    onMenuClick: (item: ProcessedNavigationItem, event?: React.MouseEvent) => void;
};

/**
 * Enhanced group renderer with full feature support including colors, icons, and actions
 */
const GroupRenderer: React.FC<{
    group: ProcessedNavigationGroup;
    currentPath: string;
    onMenuClick: (item: ProcessedNavigationItem, event?: React.MouseEvent) => void;
}> = ({ group, currentPath, onMenuClick }) => {
    const [isOpen, setIsOpen] = useState(group.defaultOpen ?? true);

    const labelContent = (
        <span className="flex items-center w-full gap-1">
            {/* Enhanced group icon support */}
            {group.icon && (
                <Icon
                    {...group.icon}
                    size={12}
                    className="flex-shrink-0"
                    color={group.icon.color || "currentColor"}
                />
            )}

            {/* Enhanced group label with custom color */}
            <span
                className="flex-1 truncate text-start text-xs"
                style={{ color: group.color || undefined }}
            >
                {group.label}
            </span>

            {/* Enhanced group actions support */}
            {group.actions && (
                <div className="flex-shrink-0">
                    <NavActions
                        actions={group.actions}
                        size="sm"
                        sideOffset={20}
                    />
                </div>
            )}

            {/* Enhanced collapsible indicator with custom color */}
            {group.collapsible && (
                <Icon
                    name="CaretRightIcon"
                    size={12}
                    className={cn('transition-transform flex-shrink-0',
                        isOpen
                            ? 'ltr:rotate-90 rtl:rotate-90'
                            : 'ltr:rotate-0 rtl:rotate-180'
                    )}
                    color={group.color || "currentColor"}
                />
            )}
        </span>
    );

    const childrenContent = (
        <SidebarGroupContent>
            <SidebarMenu>
                {group.items.map((item) => (
                    <NavRecursiveItem
                        key={item.id}
                        item={item}
                        currentPath={currentPath}
                        onMenuClick={onMenuClick}
                        level={0}
                    />
                ))}
            </SidebarMenu>
        </SidebarGroupContent>
    );

    if (group.collapsible) {
        return (
            <Collapsible asChild open={isOpen} onOpenChange={setIsOpen}>
                <SidebarGroup>
                    <SidebarGroupLabel asChild>
                        <CollapsibleTrigger className="w-full">{labelContent}</CollapsibleTrigger>
                    </SidebarGroupLabel>
                    <CollapsibleContent>{childrenContent}</CollapsibleContent>
                </SidebarGroup>
            </Collapsible>
        );
    }

    return (
        <SidebarGroup>
            <SidebarGroupLabel>{labelContent}</SidebarGroupLabel>
            {childrenContent}
        </SidebarGroup>
    );
};

/**
 * Enhanced navigation content component with full feature support
 */
const NavContentComponent: React.FC<NavContentProps> = ({
                                                            navigationGroups,
                                                            currentPath,
                                                            onMenuClick
                                                        }) => {
    return (
        <SidebarContent>
            {navigationGroups.map((group) => (
                <GroupRenderer
                    key={group.id}
                    group={group}
                    currentPath={currentPath}
                    onMenuClick={onMenuClick}
                />
            ))}
        </SidebarContent>
    );
};

NavContentComponent.displayName = 'NavContent';

export const NavContent = memo(NavContentComponent);