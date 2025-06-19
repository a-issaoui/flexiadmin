import React, {memo, useState, useCallback, useMemo} from 'react';
import Link from 'next/link';
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
import {Collapsible, CollapsibleContent, CollapsibleTrigger} from '@/components/ui/collapsible';
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from '@/components/ui/dropdown-menu';
import {Badge} from '@/components/ui/badge';
import {cn} from '@/lib/utils';
import {Icon} from '@/components/shared/icon';
import {useTranslations} from 'next-intl';
import type {TypeSidebarData, SbGroup, SbMenu, SbSubMenu, MenuAction, SidebarBadge} from '@/types/sidebar-data';

// Props for the main presentational component
interface AppSidebarContentProps {
    data: TypeSidebarData; // Expects pre-processed data
    currentPath?: string;
    onMenuClick: (url: string, item: SbMenu | SbSubMenu, event?: React.MouseEvent) => void;
    onActionClick: (action: MenuAction, context?: { group?: SbGroup; menu?: SbMenu; submenu?: SbSubMenu }) => void;
}

// --- Helper Sub-Components (largely unchanged but simplified) ---
//Badge
const SidebarBadgeComponent = memo<{ badge: SidebarBadge }>(({badge}) => {
    const {count, color, variant = 'default', shape = 'default'} = badge;
    if (count === null || count === undefined) return null;
    return <Badge variant={variant} shape={shape} color={color} className="flex-shrink-0">{count}</Badge>;
});
SidebarBadgeComponent.displayName = 'SidebarBadgeComponent';

//PulsingDot
const PulsingDot = memo<{ color?: string }>(({color = '#10b981'}) => (
    <span className="relative inline-flex h-1.5 w-1.5 -translate-y-2 ml-1 mt-1 flex-shrink-0">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
              style={{backgroundColor: color}}/>
        <span className="relative inline-flex rounded-full h-1.5 w-1.5" style={{backgroundColor: color}}/>
    </span>
));
PulsingDot.displayName = 'PulsingDot';

//InlineActions
const InlineActions = memo<{
    actions: MenuAction[];
    onActionClick: (action: MenuAction, context?: any) => void;
    context?: any;
    size?: 'sm' | 'md';
    sideOffset?: number;
}>(({ actions, onActionClick, context, size = 'md', sideOffset = 20 }) => {
    const t = useTranslations('actions');
    const [isOpen, setIsOpen] = useState(false);

    if (!actions?.length) return null;

    const handleActionClick = useCallback(
        (e: React.MouseEvent, action: MenuAction) => {
            e.stopPropagation();
            e.preventDefault();
            onActionClick(action, context);
        },
        [onActionClick, context]
    );

    const iconSize = size === 'sm' ? 'h-3 w-3' : 'h-4 w-4';
    const buttonSize = size === 'sm' ? 'h-5 w-5' : 'h-6 w-6';

    return (
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger
                asChild
                onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                }}
            >
                <div
                    role="button"
                    tabIndex={0}
                    className={cn(
                        'rounded-sm flex items-center justify-center hover:bg-accent/50 transition-colors flex-shrink-0 cursor-pointer',
                        'focus:outline-none focus:ring-0 focus-visible:ring-0',
                        buttonSize
                    )}
                >

                    <Icon
                        name="DotsThreeOutlineIcon"
                        className={cn(
                            iconSize,
                            'transition-transform flex-shrink-0',
                            isOpen && 'rotate-90'
                        )}
                        weight="duotone"
                    />
                    <span className="sr-only">More actions</span>
                </div>
            </DropdownMenuTrigger>

            <DropdownMenuContent side="right" align="start" sideOffset={sideOffset}>
                {actions.map((action) => (
                    <DropdownMenuItem
                        key={action.id}
                        onClick={(e) => handleActionClick(e, action)}
                        className="flex items-center gap-2"
                    >
                        {action.icon && (
                            <Icon
                                {...action.icon}
                                size={action.icon.size ?? 16}
                                weight={action.icon.weight ?? 'regular'}
                                className="flex-shrink-0"
                            />
                        )}
                        {t(`${action.id}`, { defaultValue: action.label })}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
});
InlineActions.displayName = 'InlineActions';

//Submenu
const SubmenuComponent = memo<{
    submenu: SbSubMenu[];
    currentPath?: string;
    onMenuClick: (url: string, item: SbSubMenu, event?: React.MouseEvent) => void;
    onActionClick: (action: MenuAction, context?: any) => void;
    parentMenu: SbMenu;
}>(({ submenu, currentPath, onMenuClick, onActionClick, parentMenu }) => {
    const t = useTranslations('sidebar');

    return (
        <SidebarMenuSub>
            {submenu.map((subItem) => {
                const isActive = currentPath === subItem.url || subItem.isActive;

                return (
                    <SidebarMenuSubItem key={subItem.id}>
                        <SidebarMenuSubButton asChild isActive={isActive}>
                            <Link
                                href={subItem.url}
                                className="flex items-center gap-2 w-full"
                                onClick={(e) => onMenuClick(subItem.url, subItem, e)}
                            >
                <span>
                  {subItem.icon && (
                      <Icon
                          {...subItem.icon}
                          size={subItem.icon.size ?? 16}
                          weight={subItem.icon.weight ?? 'regular'}
                          color={subItem.icon.color ?? 'currentColor'}
                          className="flex-shrink-0"
                      />
                  )}
                </span>
                                <span className="flex-1 truncate" style={{ color: subItem.color }}>
                  {t(`route.${subItem.id}.title`, { defaultValue: subItem.title })}
                </span>
                                {subItem.badge && <SidebarBadgeComponent badge={subItem.badge} />}
                                {subItem.actions && (
                                    <InlineActions
                                        actions={subItem.actions}
                                        onActionClick={onActionClick}
                                        context={{ submenu: subItem, menu: parentMenu }}
                                        size="md"
                                        sideOffset={44}
                                    />
                                )}
                            </Link>
                        </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                );
            })}
        </SidebarMenuSub>
    );
});
SubmenuComponent.displayName = 'SubmenuComponent';



//Menu
const MenuItemComponent = memo<{
    menuItem: SbMenu;
    currentPath?: string;
    onMenuClick: (url: string, item: SbMenu, event?: React.MouseEvent) => void;
    onActionClick: (action: MenuAction, context?: any) => void;
    group: SbGroup;
}>(({menuItem, currentPath, onMenuClick, onActionClick, group}) => {
    const {state} = useSidebar();
    const hasSubmenu = !!menuItem.submenu?.length;
    const isActive = !hasSubmenu && (currentPath === menuItem.url || menuItem.isActive);
    const hasActiveSubmenu = useMemo(() => hasSubmenu && menuItem.submenu!.some(s => s.isActive || currentPath === s.url), [hasSubmenu, menuItem.submenu, currentPath]);
    const hasSubmenuBadges = useMemo(() => hasSubmenu && menuItem.submenu!.some(sub => sub.badge?.count), [hasSubmenu, menuItem.submenu]);
    const t = useTranslations('sidebar');
    const [isOpen, setIsOpen] = useState(menuItem.defaultExpanded ?? hasActiveSubmenu);

    const handleTriggerClick = useCallback((e: React.MouseEvent) => {
        if (hasSubmenu) {
            setIsOpen(prev => !prev);
        } else {
            onMenuClick(menuItem.url, menuItem, e);
        }
    }, [hasSubmenu, menuItem, onMenuClick]);

    const renderMenuContent = () => (
        <>
            {menuItem.icon && (
                <div className="relative">
                    <Icon {...menuItem.icon} size={menuItem.icon.size ?? 20} weight={menuItem.icon.weight ?? 'regular'}
                          className="flex-shrink-0"/>
                    {state === 'collapsed' && hasSubmenuBadges &&
                        <span className="absolute -top-0.5 -right-0.5"><PulsingDot color={menuItem.dotColor}/></span>}
                </div>
            )}
            <span className="flex-1 truncate flex items-center min-w-0" style={{color: menuItem.color}}>
                <span className="truncate">
                  <span className="truncate">
                  {hasSubmenu
                   ? t(`menu.${menuItem.id}`, {defaultValue: menuItem.title})
                   : t(`route.${menuItem.id}.title`, {defaultValue: menuItem.title})}
                  </span>

                </span>
                {state !== 'collapsed' && hasSubmenuBadges && <PulsingDot color={menuItem.dotColor}/>}
            </span>
            {menuItem.badge && <SidebarBadgeComponent badge={menuItem.badge}/>}
            {menuItem.actions && <InlineActions actions={menuItem.actions} onActionClick={onActionClick}
                                                context={{menu: menuItem, group}} size="md"
                                                sideOffset={hasSubmenu ? 44 : 20}/>}
            {hasSubmenu &&
                <Icon name="CaretRightIcon" className={cn(' transition-transform flex-shrink-0', isOpen && 'rotate-90')}  />}
        </>
    );

    const buttonProps = {
        isActive: isActive || (hasSubmenu && hasActiveSubmenu),
        tooltip: state === 'collapsed' ? menuItem.tooltip || menuItem.title : undefined,
        className: "w-full"
    };

    if (hasSubmenu) {
        return (
            <Collapsible open={isOpen} onOpenChange={setIsOpen}>
                <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                        <SidebarMenuButton {...buttonProps}
                                           onClick={handleTriggerClick}>{renderMenuContent()}</SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                        <SubmenuComponent submenu={menuItem.submenu!} currentPath={currentPath}
                                          onMenuClick={onMenuClick} onActionClick={onActionClick}
                                          parentMenu={menuItem}/>
                    </CollapsibleContent>
                </SidebarMenuItem>
            </Collapsible>
        );
    }

    return (
        <SidebarMenuItem>
            <SidebarMenuButton asChild {...buttonProps}>
                <Link href={menuItem.url} onClick={(e) => onMenuClick(menuItem.url, menuItem, e)}
                      className="w-full flex items-center gap-2">
                    {renderMenuContent()}
                </Link>
            </SidebarMenuButton>
        </SidebarMenuItem>
    );
});
MenuItemComponent.displayName = 'MenuItemComponent';


//Group
const SidebarGroupComponent = memo<{
    group: SbGroup;
    currentPath?: string;
    onMenuClick: (url: string, item: SbMenu | SbSubMenu, event?: React.MouseEvent) => void;
    onActionClick: (action: MenuAction, context?: any) => void;
}>(({group, currentPath, onMenuClick, onActionClick}) => {
    const [isOpen, setIsOpen] = useState(group.defaultOpen !== false);
    const t = useTranslations('sidebar.group');
    const renderGroupHeader = () => (
        <span className="flex items-center w-full" style={{color: group.color}}>
            {group.icon && <Icon {...group.icon} size={group.icon.size ?? 16} weight={group.icon.weight ?? 'regular'}
                                 className="mr-1 flex-shrink-0"/>}
            <span className="flex-1 truncate">{t(`${group.id}`, {defaultValue: group.title})}</span>
            {group.actions &&
                <InlineActions actions={group.actions} onActionClick={onActionClick} context={{group}} size="sm"
                               sideOffset={group.collapsible ? 35 : 20}/>}
            {group.collapsible &&
                <Icon name="CaretRightIcon" className={cn('h-3 w-3 transition-transform flex-shrink-0', isOpen && 'rotate-90')}/>}
        </span>
    );

    const groupContent = (
        <SidebarGroupContent>
            <SidebarMenu>
                {group.menu.map(item => <MenuItemComponent key={item.id} menuItem={item} currentPath={currentPath}
                                                           onMenuClick={onMenuClick} onActionClick={onActionClick}
                                                           group={group}/>)}
            </SidebarMenu>
        </SidebarGroupContent>
    );

    if (group.collapsible) {
        return (
            <Collapsible open={isOpen} onOpenChange={setIsOpen}>
                <SidebarGroup>
                    {group.title && <CollapsibleTrigger
                        asChild><SidebarGroupLabel>{renderGroupHeader()}</SidebarGroupLabel></CollapsibleTrigger>}
                    <CollapsibleContent>{groupContent}</CollapsibleContent>
                </SidebarGroup>
            </Collapsible>
        );
    }

    return (
        <SidebarGroup>
            {group.title && <SidebarGroupLabel>{renderGroupHeader()}</SidebarGroupLabel>}
            {groupContent}
        </SidebarGroup>
    );
});
SidebarGroupComponent.displayName = 'SidebarGroupComponent';


// --- Main Presentational Component ---

export const AppSidebarContent: React.FC<AppSidebarContentProps> = memo(({
                                                                             data,
                                                                             currentPath,
                                                                             onMenuClick,
                                                                             onActionClick
                                                                         }) => {
    return (
        <SidebarContent>
            {data.map(group => (
                <SidebarGroupComponent
                    key={group.id}
                    group={group}
                    currentPath={currentPath}
                    onMenuClick={onMenuClick}
                    onActionClick={onActionClick}
                />
            ))}
        </SidebarContent>
    );
});
AppSidebarContent.displayName = 'AppSidebarContent';