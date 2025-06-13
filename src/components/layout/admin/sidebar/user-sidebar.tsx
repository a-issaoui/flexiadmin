// ============================================================================
// src/components/layout/admin/sidebar/user-sidebar.tsx
// ============================================================================

'use client'

import * as React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
    DropdownMenu,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar'
import { cn } from '@/lib/utils'
import type { TypeUserData } from '@/types/user-data'
import { UserMenu } from '@/components/shared/user-menu'

interface UserSidebarProps {
    user: TypeUserData
}

export function UserSidebar({ user }: UserSidebarProps) {
    const initials = React.useMemo(() => {
        return user.name
            .split(' ')
            .filter(Boolean)
            .slice(0, 2)
            .map((word) => word[0]?.toUpperCase() || '')
            .join('')
    }, [user.name])

    const avatarUrl = user.avatar || user.imageUrl || ''

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                        >
                            <div className="relative">
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src={avatarUrl} alt={user.name} />
                                    <AvatarFallback>{initials}</AvatarFallback>
                                </Avatar>
                                <div
                                    className={cn(
                                        'absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-background',
                                        user.status.toLowerCase() === 'active'
                                            ? 'bg-green-500'
                                            : 'bg-gray-400'
                                    )}
                                />
                            </div>
                            <div className="flex flex-col text-left leading-none min-w-0 flex-1">
                                <span className="font-medium text-sm truncate">{user.name}</span>
                                <span className="text-xs text-muted-foreground truncate">{user.email}</span>
                            </div>
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>

                    <UserMenu user={user} />
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    )
}
