import React, {memo, useEffect, useMemo, useState, useCallback} from 'react';
import Link from 'next/link';
import {ChevronRight, MoreHorizontal} from 'lucide-react';
import {
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    useSidebar
} from '@/components/ui/sidebar';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger
} from '@/components/ui/collapsible';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {Badge} from '@/components/ui/badge';
import {cn} from '@/lib/utils';
import {Icon} from '@/components/shared/icon';
import type {TypeSidebarData, SbGroup, SbMenu, SbSubMenu, MenuAction, SidebarBadge} from '@/types/sidebar-data';

interface AppSidebarContentProps {
    data: TypeSidebarData;
    currentPath?: string;
    onMenuClick?: (url: string, item: SbMenu | SbSubMenu) => void;
    onActionClick?: (action: MenuAction, context?: { group?: SbGroup; menu?: SbMenu; submenu?: SbSubMenu }) => void;
}

const PulsingDot = memo<{ color: string }>(({color}) => (
    <span className="relative inline-flex h-1.5 w-1.5 -translate-y-1 ml-1 mt-1 flex-shrink-0">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
              style={{backgroundColor: color}}/>
        <span className="relative inline-flex rounded-full h-1.5 w-1.5" style={{backgroundColor: color}}/>
    </span>
));
PulsingDot.displayName = 'PulsingDot';

const SidebarBadgeComponent = memo<{ badge: SidebarBadge }>(({badge}) => {
    const {count, color, variant = 'default', shape = 'default'} = badge;
    if (!count && count !== 0) return null;
    return <Badge variant={variant} shape={shape} color={color} className="flex-shrink-0">{count}</Badge>;
});
SidebarBadgeComponent.displayName = 'SidebarBadgeComponent';

const InlineActions = memo<{
    actions: MenuAction[];
    onActionClick?: (action: MenuAction, context?: any) => void;
    context?: any;
    size?: 'sm' | 'md';
}>(({actions, onActionClick, context, size = 'md'}) => {
    const [isOpen, setIsOpen] = useState(false);
    if (!actions?.length) return null;
    const iconSize = size === 'sm' ? 'h-3 w-3' : 'h-4 w-4';
    const buttonSize = size === 'sm' ? 'h-5 w-5' : 'h-6 w-6';

    const handleActionClick = useCallback((action: MenuAction) => {
        onActionClick?.(action, context);
        setIsOpen(false);
    }, [onActionClick, context]);

    const handleTriggerClick = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        setIsOpen(prev => !prev);
    }, []);

    return (
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
                <div
                    className={cn('rounded-sm flex items-center justify-center hover:bg-accent/50 transition-colors flex-shrink-0 cursor-pointer', buttonSize)}
                    onClick={handleTriggerClick}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => (['Enter', ' '].includes(e.key) && handleTriggerClick(e as any))}
                >
                    <MoreHorizontal
                        className={cn(iconSize, 'transition-transform duration-200', isOpen && 'rotate-90')}/>
                    <span className="sr-only">More actions</span>
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="right" align="start">
                {actions.map(action => (
                    <DropdownMenuItem key={action.id} onClick={() => handleActionClick(action)}
                                      className="flex items-center gap-2">
                        {action.icon && <Icon {...action.icon} size={action.icon.size || 16}
                                              weight={action.icon.weight || 'regular'} className="flex-shrink-0"/>}
                        {action.label}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
});
InlineActions.displayName = 'InlineActions';

const SubmenuComponent = memo<{
    submenu: SbSubMenu[];
    currentPath?: string;
    onMenuClick?: (url: string, item: SbSubMenu) => void;
    onActionClick?: (action: MenuAction, context?: any) => void;
    parentMenu?: SbMenu;
}>(({submenu, currentPath, onMenuClick, onActionClick, parentMenu}) => (
    <SidebarMenuSub>
        {submenu.map(subItem => {
            const isActive = currentPath === subItem.url || subItem.isActive;
            return (
                <SidebarMenuSubItem key={subItem.id || subItem.url} >
                    <SidebarMenuSubButton asChild isActive={isActive}>
                        <Link href={subItem.url} className="flex items-center gap-2 w-full"
                              onClick={() => onMenuClick?.(subItem.url, subItem)}>
                            {subItem.icon && <Icon {...subItem.icon} size={subItem.icon.size || 16}
                                                   weight={subItem.icon.weight || 'regular'}
                                                   className="flex-shrink-0"/>}
                            <span className="flex-1 truncate flex items-center min-w-0 " style={{color: subItem.color}}>
                                {subItem.title}
                            </span>
                            {subItem.badge && <SidebarBadgeComponent badge={subItem.badge}/>}
                            {subItem.actions && <InlineActions actions={subItem.actions} onActionClick={onActionClick}
                                                               context={{submenu: subItem, menu: parentMenu}}
                                                               size="md"/>}
                        </Link>
                    </SidebarMenuSubButton>
                </SidebarMenuSubItem>
            );
        })}
    </SidebarMenuSub>
));
SubmenuComponent.displayName = 'SubmenuComponent';

const MenuItemComponent = memo<{
    menuItem: SbMenu;
    currentPath?: string;
    onMenuClick?: (url: string, item: SbMenu) => void;
    onActionClick?: (action: MenuAction, context?: any) => void;
    group?: SbGroup;
}>(({menuItem, currentPath, onMenuClick, onActionClick, group}) => {
    const {state} = useSidebar();
    const hasSubmenu = !!menuItem.submenu?.length;
    const hasActiveSubmenu = hasSubmenu && menuItem.submenu.some(s => s.isActive || currentPath === s.url);

    // Initialize state - prioritize defaultExpanded, then check for active submenu
    const [isOpen, setIsOpen] = useState(() => {
        if (menuItem.defaultExpanded !== undefined) return menuItem.defaultExpanded;
        return hasActiveSubmenu;
    });

    const isActive = currentPath === menuItem.url || menuItem.isActive;

    const handleClick = useCallback(() => {
        if (hasSubmenu) {
            setIsOpen(prev => !prev);
        } else {
            onMenuClick?.(menuItem.url, menuItem);
        }
    }, [hasSubmenu, menuItem.url, onMenuClick]);

    const handleLinkClick = useCallback(() => {
        if (menuItem.url) {
            onMenuClick?.(menuItem.url, menuItem);
        }
    }, [menuItem.url, onMenuClick]);

    // Check if any submenu has a badge with actual count for collapsed state indicator
    const hasSubmenuBadges = hasSubmenu && menuItem.submenu.some(sub =>
        sub.badge && (sub.badge.count !== undefined && sub.badge.count !== null && sub.badge.count !== '')
    );

    const MenuContent = (
        <>
            {menuItem.icon && (
                state === 'collapsed' ? (
                    // Collapsed state - centered icon with potential badge dot
                    <>
                        <Icon
                            {...menuItem.icon}
                            size={menuItem.icon.size || 20}
                            weight={menuItem.icon.weight || 'regular'}
                        />
                        {hasSubmenuBadges && (
                            <span className="absolute -top-0.5 -right-0.5">
                    <PulsingDot color={menuItem.dotColor || '#10b981'}/>
                </span>
                        )}
                    </>
                ) : (
                    // Expanded state - regular icon
                    <Icon
                        {...menuItem.icon}
                        size={menuItem.icon.size || 20}
                        weight={menuItem.icon.weight || 'regular'}
                        className="flex-shrink-0"
                    />
                )
            )}
            <span className="flex-1 truncate flex items-center min-w-0" style={{color: menuItem.color}}>
            <span className="truncate">{menuItem.title}</span>
                {/* Show pulsing dot only when expanded and submenu has badges */}
                {state !== 'collapsed' && hasSubmenuBadges && (
                    <PulsingDot color={menuItem.dotColor || '#10b981'}/>
                )}
        </span>
            {menuItem.badge && <SidebarBadgeComponent badge={menuItem.badge}/>}
            {menuItem.actions && <InlineActions actions={menuItem.actions} onActionClick={onActionClick}
                                                context={{menu: menuItem, group}} size="md"/>}
            {hasSubmenu &&
                <ChevronRight className={cn('h-4 w-4 transition-transform flex-shrink-0', isOpen && 'rotate-90')}/>}
        </>
    );

    return hasSubmenu ? (
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                    <SidebarMenuButton isActive={isActive} onClick={handleClick}
                                       tooltip={state === 'collapsed' ? menuItem.tooltip || menuItem.title : undefined}
                                       className="w-full">
                        {MenuContent}
                    </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                    <SubmenuComponent submenu={menuItem.submenu!} currentPath={currentPath} onMenuClick={onMenuClick}
                                      onActionClick={onActionClick} parentMenu={menuItem}/>
                </CollapsibleContent>
            </SidebarMenuItem>
        </Collapsible>
    ) : (
        <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive}
                               tooltip={state === 'collapsed' ? menuItem.tooltip || menuItem.title : undefined}
                               className="w-full">
                <Link href={menuItem.url} onClick={handleLinkClick} className="w-full flex items-center gap-2">
                    {MenuContent}
                </Link>
            </SidebarMenuButton>
        </SidebarMenuItem>
    );
});
MenuItemComponent.displayName = 'MenuItemComponent';

const SidebarGroupComponent = memo<{
    group: SbGroup;
    currentPath?: string;
    onMenuClick?: (url: string, item: SbMenu | SbSubMenu) => void;
    onActionClick?: (action: MenuAction, context?: any) => void;
}>(({group, currentPath, onMenuClick, onActionClick}) => {
    const [isOpen, setIsOpen] = useState(group.defaultOpen !== false);
    const GroupHeader = (
        <span className="flex items-center w-full" style={{color: group.color}}>
            {group.icon && <Icon {...group.icon} size={group.icon.size || 16} weight={group.icon.weight || 'regular'}
                                 className="mr-1 flex-shrink-0"/>}
            <span className="flex-1 truncate">{group.title}</span>
            {group.actions &&
                <InlineActions actions={group.actions} onActionClick={onActionClick} context={{group}} size="sm"/>}
            {group.collapsible &&
                <ChevronRight className={cn('h-4 w-4 transition-transform flex-shrink-0', isOpen && 'rotate-90')}/>}
        </span>
    );

    const menuItems = useMemo(() => group.menu.map(item => (
        <MenuItemComponent key={item.id || item.title} menuItem={item} currentPath={currentPath}
                           onMenuClick={onMenuClick} onActionClick={onActionClick} group={group}/>
    )), [group.menu, currentPath, onMenuClick, onActionClick, group]);

    return group.collapsible ? (
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <SidebarGroup>
                {group.title && (
                    <CollapsibleTrigger asChild>
                        <SidebarGroupLabel>
                         {GroupHeader}
                        </SidebarGroupLabel>
                    </CollapsibleTrigger>
                )}
                <CollapsibleContent>
                    <SidebarGroupContent><SidebarMenu>{menuItems}</SidebarMenu></SidebarGroupContent>
                </CollapsibleContent>
            </SidebarGroup>
        </Collapsible>
    ) : (
        <SidebarGroup >
            {group.title && <SidebarGroupLabel
            >{GroupHeader}</SidebarGroupLabel>}
            <SidebarGroupContent><SidebarMenu>{menuItems}</SidebarMenu></SidebarGroupContent>
        </SidebarGroup>
    );
});
SidebarGroupComponent.displayName = 'SidebarGroupComponent';

const AppSidebarContent: React.FC<AppSidebarContentProps> = memo(({data, currentPath, onMenuClick, onActionClick}) => (
    <SidebarContent>
        {useMemo(() => data.map((group, i) => (
            <SidebarGroupComponent key={group.id || i} group={group} currentPath={currentPath} onMenuClick={onMenuClick}
                                   onActionClick={onActionClick}/>
        )), [data, currentPath, onMenuClick, onActionClick])}
    </SidebarContent>
));
AppSidebarContent.displayName = 'AppSidebarContent';

export default AppSidebarContent;