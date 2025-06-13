// ============================================================================
// src/components/shared/sidebar/user-menu.tsx
// ============================================================================

'use client'

import { LogOut, User as UserIcon, Settings } from 'lucide-react'
import { useTranslations } from 'next-intl'
import * as React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import type { TypeUserData } from '@/types/user-data'

interface UserDropdownContentProps {
    user: TypeUserData
}

export function UserMenu({ user }: UserDropdownContentProps) {
    const t = useTranslations('common')

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
        <DropdownMenuContent className="w-56" align="end" side="right" sideOffset={8}>
            <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-sm">
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={avatarUrl} alt={user.name} />
                        <AvatarFallback>{initials}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col leading-none min-w-0">
                        <span className="font-medium truncate">{user.name}</span>
                        <span className="text-xs text-muted-foreground truncate">{user.email}</span>
                    </div>
                </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            <DropdownMenuItem className="cursor-pointer gap-2">
                <UserIcon className="h-4 w-4" />
                <span>{t('profile')}</span>
            </DropdownMenuItem>

            <DropdownMenuItem className="cursor-pointer gap-2">
                <Settings className="h-4 w-4" />
                <span>{t('preferences')}</span>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem className="cursor-pointer gap-2 text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/20">
                <LogOut className="h-4 w-4" />
                <span>{t('logout')}</span>
            </DropdownMenuItem>
        </DropdownMenuContent>
    )
}
