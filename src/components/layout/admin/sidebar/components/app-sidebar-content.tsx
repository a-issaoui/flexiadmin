import React from 'react'
import { ChevronRight, MoreHorizontal } from 'lucide-react'
import {
    SidebarContent,
    SidebarGroup,
    SidebarGroupAction,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuAction,
    SidebarMenuBadge,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    useSidebar
} from "@/components/ui/sidebar"
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { Icon } from "@/components/shared/icon"
import type { TypeSidebarData, SbGroup, SbMenu, SbSubMenu, MenuAction, SidebarBadge } from "@/types/sidebar-data"

interface AppSidebarContentProps {
    data: TypeSidebarData
    currentPath?: string
    onMenuClick?: (url: string, item: SbMenu | SbSubMenu) => void
    onActionClick?: (action: MenuAction, context?: { group?: SbGroup; menu?: SbMenu; submenu?: SbSubMenu }) => void
}

// Badge Component
const SidebarBadgeComponent: React.FC<{ badge: SidebarBadge }> = ({ badge }) => {
    const getBadgeClasses = () => {
        const baseClasses = "inline-flex items-center justify-center text-xs font-medium"

        const colorClasses = {
            red: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
            blue: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
            green: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
            yellow: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
            purple: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
            orange: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
            gray: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
            pink: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200",
        }

        const variantClasses = {
            default: "",
            outline: "border",
            ghost: "bg-transparent"
        }

        return cn(
            baseClasses,
            colorClasses[badge.color || 'gray'],
            variantClasses[badge.variant || 'default']
        )
    }

    return (
        <SidebarMenuBadge className={getBadgeClasses()}>
            {badge.count}
        </SidebarMenuBadge>
    )
}

// Menu Actions Dropdown
const MenuActionsDropdown: React.FC<{
    actions: MenuAction[]
    onActionClick?: (action: MenuAction, context?: never) => void
    context?: never
}> = ({ actions, onActionClick, context }) => {
    if (!actions || actions.length === 0) return null

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <SidebarMenuAction showOnHover>
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">More actions</span>
                </SidebarMenuAction>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="right" align="start">
                {actions.map((action) => (
                    <DropdownMenuItem
                        key={action.id}
                        onClick={() => onActionClick?.(action, context)}
                        className="flex items-center gap-2"
                    >
                        {action.icon && (
                            <Icon
                                name={action.icon.name}
                                size={action.icon.size || 16}
                                weight={action.icon.weight || 'regular'}
                                color={action.icon.color}
                            />
                        )}
                        {action.label}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

// Submenu Component
const SubmenuComponent: React.FC<{
    submenu: SbSubMenu[]
    currentPath?: string
    onMenuClick?: (url: string, item: SbSubMenu) => void
    onActionClick?: (action: MenuAction, context?: never) => void
    parentMenu?: SbMenu
}> = ({ submenu, currentPath, onMenuClick, onActionClick, parentMenu }) => {
    return (
        <SidebarMenuSub>
            {submenu.map((subItem) => {
                const isActive = currentPath === subItem.url || subItem.isActive

                return (
                    <SidebarMenuSubItem key={subItem.id || subItem.url}>
                        <SidebarMenuSubButton
                            asChild
                            isActive={isActive}
                            onClick={() => onMenuClick?.(subItem.url, subItem)}
                        >
                            <a href={subItem.url} className="flex items-center gap-2">
                                {subItem.icon && (
                                    <Icon
                                        name={subItem.icon.name}
                                        size={subItem.icon.size || 16}
                                        weight={subItem.icon.weight || 'regular'}
                                        color= {subItem.icon.color }
                                    />
                                )}
                                <span style={{ color: subItem.color }}>{subItem.title}</span>
                                {subItem.badge && <SidebarBadgeComponent badge={subItem.badge} />}
                            </a>
                        </SidebarMenuSubButton>
                        {subItem.actions && (
                            <MenuActionsDropdown
                                actions={subItem.actions}
                                onActionClick={onActionClick}
                                context={{ submenu: subItem, menu: parentMenu }}
                            />
                        )}
                    </SidebarMenuSubItem>
                )
            })}
        </SidebarMenuSub>
    )
}

// Main Menu Item Component
const MenuItemComponent: React.FC<{
    menuItem: SbMenu
    currentPath?: string
    onMenuClick?: (url: string, item: SbMenu) => void
    onActionClick?: (action: MenuAction, context?: any) => void
    group?: SbGroup
}> = ({ menuItem, currentPath, onMenuClick, onActionClick, group }) => {
    const { state } = useSidebar()
    const hasSubmenu = menuItem.submenu && menuItem.submenu.length > 0
    const isActive = currentPath === menuItem.url || menuItem.isActive
    const [isOpen, setIsOpen] = React.useState(menuItem.defaultExpanded || false)

    const handleClick = () => {
        if (hasSubmenu) {
            setIsOpen(!isOpen)
        } else if (menuItem.url) {
            onMenuClick?.(menuItem.url, menuItem)
        }
    }

    const MenuContent = () => (
        <>
            {menuItem.icon && (
                <Icon
                    name={menuItem.icon.name}
                    size={menuItem.icon.size || 20}
                    weight={menuItem.icon.weight || 'regular'}
                    color={menuItem.icon.color }
                />
            )}
            <span className="flex-1" style={{ color: menuItem.color }}>{menuItem.title}</span>
            {menuItem.dotColor && (
                <div
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: menuItem.dotColor }}
                />
            )}
            {menuItem.badge && <SidebarBadgeComponent badge={menuItem.badge} />}
            {hasSubmenu && (
                <ChevronRight
                    className={cn(
                        "h-4 w-4 transition-transform",
                        isOpen && "rotate-90"
                    )}
                />
            )}
        </>
    )

    if (hasSubmenu) {
        return (
            <Collapsible open={isOpen} onOpenChange={setIsOpen}>
                <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                        <SidebarMenuButton
                            isActive={isActive}
                            onClick={handleClick}
                            tooltip={state === "collapsed" ? menuItem.tooltip || menuItem.title : undefined}
                        >
                            <MenuContent />
                        </SidebarMenuButton>
                    </CollapsibleTrigger>
                    {menuItem.actions && (
                        <MenuActionsDropdown
                            actions={menuItem.actions}
                            onActionClick={onActionClick}
                            context={{ menu: menuItem, group }}
                        />
                    )}
                    <CollapsibleContent>
                        <SubmenuComponent
                            submenu={menuItem.submenu}
                            currentPath={currentPath}
                            onMenuClick={onMenuClick}
                            onActionClick={onActionClick}
                            parentMenu={menuItem}
                        />
                    </CollapsibleContent>
                </SidebarMenuItem>
            </Collapsible>
        )
    }

    return (
        <SidebarMenuItem>
            <SidebarMenuButton
                asChild
                isActive={isActive}
                tooltip={state === "collapsed" ? menuItem.tooltip || menuItem.title : undefined}
            >
                <a href={menuItem.url} onClick={() => menuItem.url && onMenuClick?.(menuItem.url, menuItem)}>
                    <MenuContent />
                </a>
            </SidebarMenuButton>
            {menuItem.actions && (
                <MenuActionsDropdown
                    actions={menuItem.actions}
                    onActionClick={onActionClick}
                    context={{ menu: menuItem, group }}
                />
            )}
        </SidebarMenuItem>
    )
}

// Group Actions Component
const GroupActionsComponent: React.FC<{
    actions: MenuAction[]
    onActionClick?: (action: MenuAction, context?: never) => void
    group?: SbGroup
}> = ({ actions, onActionClick, group }) => {
    if (!actions || actions.length === 0) return null

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <SidebarGroupAction>
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Group actions</span>
                </SidebarGroupAction>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="right" align="start">
                {actions.map((action) => (
                    <DropdownMenuItem
                        key={action.id}
                        onClick={() => onActionClick?.(action, { group })}
                        className="flex items-center gap-2"
                    >
                        {action.icon && (
                            <Icon
                                name={action.icon.name}
                                size={action.icon.size || 16}
                                weight={action.icon.weight || 'regular'}
                                color={action.icon.color}
                            />
                        )}
                        {action.label}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

// Main Sidebar Group Component
const SidebarGroupComponent: React.FC<{
    group: SbGroup
    currentPath?: string
    onMenuClick?: (url: string, item: SbMenu | SbSubMenu) => void
    onActionClick?: (action: MenuAction, context?: any) => void
}> = ({ group, currentPath, onMenuClick, onActionClick }) => {
    const [isOpen, setIsOpen] = React.useState(group.defaultOpen !== false)

    if (group.collapsible) {
        return (
            <Collapsible open={isOpen} onOpenChange={setIsOpen}>
                <SidebarGroup>
                    {group.title && (
                        <CollapsibleTrigger asChild>
                            <SidebarGroupLabel className="flex items-center justify-between cursor-pointer">

                                <span style={{ color: group.color }}>
                                       {group.icon && (
                                           <Icon
                                               name={group.icon.name}
                                               size={group.icon.size || 16}
                                               weight={group.icon.weight || 'regular'}
                                               color={group.icon.color}
                                               className="mr-1"
                                           />
                                       )}
                                    {group.title}</span>
                                <ChevronRight
                                    className={cn(
                                        "h-4 w-4 transition-transform",
                                        isOpen && "rotate-90"
                                    )}
                                />
                            </SidebarGroupLabel>
                        </CollapsibleTrigger>
                    )}
                    {group.actions && (
                        <GroupActionsComponent
                            actions={group.actions}
                            onActionClick={onActionClick}
                            group={group}
                        />
                    )}
                    <CollapsibleContent>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {group.menu.map((menuItem) => (
                                    <MenuItemComponent
                                        key={menuItem.id || menuItem.title}
                                        menuItem={menuItem}
                                        currentPath={currentPath}
                                        onMenuClick={onMenuClick}
                                        onActionClick={onActionClick}
                                        group={group}
                                    />
                                ))}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </CollapsibleContent>
                </SidebarGroup>
            </Collapsible>
        )
    }

    return (
        <SidebarGroup>
            {group.title && (
                <SidebarGroupLabel style={{ color: group.color }}>
                    {group.icon && (
                        <Icon
                            name={group.icon.name}
                            size={group.icon.size || 16}
                            weight={group.icon.weight || 'regular'}
                            color={group.icon.color}
                            className="mr-1"
                        />
                    )}
                    {group.title}
                </SidebarGroupLabel>
            )}
            {group.actions && (
                <GroupActionsComponent
                    actions={group.actions}
                    onActionClick={onActionClick}
                    group={group}
                />
            )}
            <SidebarGroupContent>
                <SidebarMenu>
                    {group.menu.map((menuItem) => (
                        <MenuItemComponent
                            key={menuItem.id || menuItem.title}
                            menuItem={menuItem}
                            currentPath={currentPath}
                            onMenuClick={onMenuClick}
                            onActionClick={onActionClick}
                            group={group}
                        />
                    ))}
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    )
}

// Main AppSidebarContent Component
const AppSidebarContent: React.FC<AppSidebarContentProps> = ({
                                                                 data,
                                                                 currentPath,
                                                                 onMenuClick,
                                                                 onActionClick
                                                             }) => {
    return (
        <SidebarContent>
            {data.map((group, index) => (
                <React.Fragment key={group.id || index}>
                    <SidebarGroupComponent
                        group={group}
                        currentPath={currentPath}
                        onMenuClick={onMenuClick}
                        onActionClick={onActionClick}
                    />

                </React.Fragment>
            ))}
        </SidebarContent>
    )
}

export default AppSidebarContent