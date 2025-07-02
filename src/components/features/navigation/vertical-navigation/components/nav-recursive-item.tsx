import React, { memo, useState, useCallback, useMemo } from 'react';
import Link from 'next/link';
import {
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubItem, useSidebar,
} from '@/components/ui/sidebar';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';
import { Icon } from '@/components/common/icon';
import { useTranslations } from 'next-intl';
import type { NavigationItem } from '@/types/navigation.types';
import NavPulsingDot from '@/components/features/navigation/vertical-navigation/components/nav-pulsing-dot';
import NavBadge from '@/components/features/navigation/vertical-navigation/components/nav-badge';
import NavActions from '@/components/features/navigation/vertical-navigation/components/nav-actions';
import {getTooltipText, getTranslatedText} from '@/lib/translation';


interface NavRecursiveItemProps {
    item: NavigationItem;
    currentPath: string;
    onMenuClick: (item: NavigationItem, event?: React.MouseEvent) => void;
    level: number;
}

const NavRecursiveItem: React.FC<NavRecursiveItemProps> = ({ item, currentPath, onMenuClick, level }) => {
    const t = useTranslations();
    const { state } = useSidebar();
    const hasChildren = !!item.children?.length;
    const isSubmenu = level > 0;

    const isActive = useMemo(() => {
        const checkActive = (navItem: NavigationItem): boolean => {
            if (navItem.href === currentPath) return true;
            return navItem.children?.some(checkActive) ?? false;
        };
        return checkActive(item);
    }, [item, currentPath]);

    const hasChildrenWithBadges = useMemo(
        () =>
            hasChildren &&
            item.children?.some((child) => child.badge?.value !== null && child.badge?.value !== undefined),
        [hasChildren, item.children]
    );

    const [isOpen, setIsOpen] = useState(item.defaultExpanded ?? isActive);

    const handleTriggerClick = useCallback(
        (e: React.MouseEvent) => {
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
            {item.icon && (
                <div className="relative">
                    <Icon
                        {...item.icon}
                        size={isSubmenu ? 16 : 20}
                        weight={item.icon.weight ?? 'regular'}
                        className="flex-shrink-0"
                    />
                    {state === 'collapsed' && hasChildrenWithBadges && (
                        <div className="absolute -top-2 -right-0.5">
                            <NavPulsingDot color={item.dotColor} />
                        </div>
                    )}
                </div>
            )}

            <span className="flex-1 truncate flex items-center min-w-0">
                <span className="truncate" style={{ color: item.color }}>
                    {getTranslatedText(t, item, 'label', 'item')}
                </span>
                {state !== 'collapsed' && hasChildrenWithBadges && (
                    <span className="ml-1.5">
                        <NavPulsingDot color={item.dotColor} />
                    </span>
                )}
            </span>

            {item.badge && <NavBadge badge={item.badge} />}
            {item.actions && <NavActions actions={item.actions} size="md" sideOffset={hasChildren ? 44 : 20} />}
            {hasChildren && (
                <Icon
                    name="CaretRightIcon"
                    className={cn(
                        'transition-transform flex-shrink-0',
                        isOpen
                            ? // if open, rotate 90deg in LTR, -90deg in RTL
                            'ltr:rotate-90 rtl:rotate-90'
                            : // if closed, no rotation in LTR, 180deg flip in RTL
                            'ltr:rotate-0 rtl:rotate-180'
                    )}
                />
            )}
        </>
    );

    const buttonProps = {
        isActive,
        tooltip:
            state === 'collapsed'
                ? getTooltipText(t, item)
                : undefined,
        className: 'w-full',
    };

    const ItemContainer = isSubmenu ? SidebarMenuSubItem : SidebarMenuItem;

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

    return (
        <ItemContainer>
            <SidebarMenuButton asChild {...buttonProps}>
                <Link
                    href={item.href ?? '#'}
                    onClick={(e) => onMenuClick(item, e)}
                    className="w-full flex items-center gap-2"
                >
                    {renderMenuContent()}
                </Link>
            </SidebarMenuButton>
        </ItemContainer>
    );
};

NavRecursiveItem.displayName = 'NavRecursiveItem';

export default memo(NavRecursiveItem);