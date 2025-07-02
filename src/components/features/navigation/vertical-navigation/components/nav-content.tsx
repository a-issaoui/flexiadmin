import React, { memo, useState } from 'react';
import {
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
} from '@/components/ui/sidebar';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useTranslations } from 'next-intl';
import type { NavigationConfig, NavigationItem } from '@/types/navigation.types';
import NavActions from '@/components/features/navigation/vertical-navigation/components/nav-actions';
import NavRecursiveItem from '@/components/features/navigation/vertical-navigation/components/nav-recursive-item';
import { Icon } from '@/components/common/icon';
import { cn } from '@/lib/utils';
import { getTranslatedText } from '@/lib/translation';

export type NavContentProps = {
    data: NavigationConfig[];
    currentPath: string;
    onMenuClick: (item: NavigationItem, event?: React.MouseEvent) => void;
};

const GroupRenderer: React.FC<{
    group: NavigationConfig;
    currentPath: string;
    onMenuClick: (item: NavigationItem, event?: React.MouseEvent) => void;
}> = ({ group, currentPath, onMenuClick }) => {
    const t = useTranslations(); // Remove hardcoded namespace
    const [isOpen, setIsOpen] = useState(group.defaultOpen ?? true);

    const labelContent = (
        <span className="flex items-center w-full gap-1">
            {group.icon && (
                <Icon {...group.icon} size={12} weight={group.icon.weight ?? 'regular'} className="flex-shrink-0" />
            )}
            <span className="flex-1 truncate text-start text-xs " style={{ color: group.color }}>
                {getTranslatedText(t, group, 'label', 'group')}
            </span>
            {group.actions && (
                <div className="flex-shrink-0">
                    <NavActions actions={group.actions} size="sm" sideOffset={20} />
                </div>
            )}
            {group.collapsible && (
                <Icon
                    name="CaretRightIcon"
                    size={12}
                    className={cn('transition-transform flex-shrink-0',
                        isOpen
                            ? // if open, rotate 90deg in LTR, -90deg in RTL
                            'ltr:rotate-90 rtl:rotate-90'
                            : // if closed, no rotation in LTR, 180deg flip in RTL
                            'ltr:rotate-0 rtl:rotate-180'

                    )}
                />

            )}
        </span>
    );

    const childrenContent = (
        <SidebarGroupContent>
            <SidebarMenu>
                {group.children.map((item) => (
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
                    {group.label && (
                        <SidebarGroupLabel asChild>
                            <CollapsibleTrigger className="w-full">{labelContent}</CollapsibleTrigger>
                        </SidebarGroupLabel>
                    )}
                    <CollapsibleContent>{childrenContent}</CollapsibleContent>
                </SidebarGroup>
            </Collapsible>
        );
    }

    return (
        <SidebarGroup>
            {group.label && <SidebarGroupLabel>{labelContent}</SidebarGroupLabel>}
            {childrenContent}
        </SidebarGroup>
    );
};

const NavContentComponent: React.FC<NavContentProps> = ({ data, currentPath, onMenuClick }) => {
    return (
        <SidebarContent>
            {data.map((group) => (
                <GroupRenderer key={group.id} group={group} currentPath={currentPath} onMenuClick={onMenuClick} />
            ))}
        </SidebarContent>
    );
};

NavContentComponent.displayName = 'NavContent';

export const NavContent = memo(NavContentComponent);