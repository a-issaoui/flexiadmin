
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
import { UserDropdown } from '@/components/common/user-dropdown';
import type { UserType } from '@/types/user.types';

export function NavUser({ user }: { user: UserType }) {
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
                            {/* Avatar with online dot */}
                            <div className="relative flex gap-3 items-center">
                                <Avatar className="h-8 w-8 rounded-full border-2 border-green-500 grayscale">
                                    <AvatarImage src={avatarUrl} alt={user.name}/>
                                    <AvatarFallback>{initials}</AvatarFallback>
                                </Avatar>
                                {/* 'end-0' is a logical property, correct for LTR/RTL */}
                                <span
                                    className="absolute bottom-0 end-0 h-2 w-2 rounded-full bg-green-500 border-1 border-white translate-1/10"/>
                            </div>

                            {/* 'text-start' and 'ms-2' are logical properties, correct for LTR/RTL */}
                            <div className="flex-1 min-w-0 text-start leading-none ms-1">
                                <span className="block text-sm font-medium truncate">{user.name}</span>
                                <span className="block text-xs text-muted-foreground truncate">{user.email}</span>
                            </div>
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <UserDropdown user={user} side="right" align="end" sideOffset={12} alignOffset={2}
                                  collisionPadding={10}/>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}
