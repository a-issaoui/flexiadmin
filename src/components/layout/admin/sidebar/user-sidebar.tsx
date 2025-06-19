'use client';

import * as React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import { UserMenu } from '@/components/shared/user-menu';
import type { TypeUserData } from '@/types/user-data';

export function UserSidebar({ user }: { user: TypeUserData }) {
    const initials = React.useMemo(
        () =>
            user.name
                .split(' ')
                .filter(Boolean)
                .slice(0, 2)
                .map((w) => w[0]?.toUpperCase() || '')
                .join(''),
        [user.name]
    );

    const avatarUrl = user.avatar || user.imageUrl || '';

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                        >
                            <div className="relative flex gap-3 items-center">
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src={avatarUrl} alt={user.name} />
                                    <AvatarFallback>{initials}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0 text-left leading-none">
                                    <span className="block text-sm font-medium truncate">{user.name}</span>
                                    <span className="block text-xs text-muted-foreground truncate">{user.email}</span>
                                </div>
                                <div
                                    className={cn(
                                        'absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-background',
                                        user.status?.toLowerCase() === 'active' ? 'bg-green-500' : 'bg-gray-400'
                                    )}
                                />
                            </div>
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <UserMenu user={user} side="right" align="end" sideOffset={12} alignOffset={2} collisionPadding={10} />
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}
