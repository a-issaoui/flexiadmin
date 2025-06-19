"use client"

import * as React from "react";
import { useTranslations } from 'next-intl';
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar";
import {
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Icon } from "@/components/shared/icon";
import { useIsMobileWithCookies } from "@/hooks/use-mobile";

const UserInfo = React.memo(({ user, initials }) => (
    <div className="flex items-center rtl:flex-row-reverse gap-2 px-1 py-1.5 text-left rtl:text-right text-sm">
        <Avatar className="h-8 w-8 rounded-lg shrink-0">
            <AvatarImage src={user.imageUrl} alt={user.name || ''} />
            <AvatarFallback className="rounded-lg bg-gray-200">
                {initials}
            </AvatarFallback>
        </Avatar>
        <div className="grid flex-1 text-left rtl:text-right text-sm leading-tight min-w-0">
            <span className="truncate font-medium" title={user.name || ''}>
                {user.name || ''}
            </span>
            <span className="truncate text-xs text-muted-foreground" title={user.email || ''}>
                {user.email || ''}
            </span>
        </div>
    </div>
));

UserInfo.displayName = 'UserInfo';

const MenuItems = React.memo(() => {
    const t = useTranslations('UserDropdown');

    // Base classes for menu items to ensure flex behavior and RTL ordering
    const menuItemClasses = "flex items-center gap-2 rtl:flex-row-reverse";

    return (
        <>
            <DropdownMenuGroup>
                <DropdownMenuItem className={menuItemClasses}>
                    <Icon name="UsersIcon" className="h-4 w-4 shrink-0" />
                    <span>{t('account')}</span>
                </DropdownMenuItem>
                <DropdownMenuItem className={menuItemClasses}>
                    <Icon name="CalendarIcon" className="h-4 w-4 shrink-0" />
                    <span>{t('billing')}</span>
                </DropdownMenuItem>
                <DropdownMenuItem className={menuItemClasses}>
                    <Icon name="BellIcon" className="h-4 w-4 shrink-0" />
                    <span>{t('notifications')}</span>
                </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            {/* For the "Log out" item, text-destructive and focus:text-destructive are specific styling */}
            <DropdownMenuItem className={`${menuItemClasses} text-destructive focus:text-destructive`}>
                <Icon name="SignOutIcon" className="h-4 w-4 shrink-0" />
                <span>{t('logout')}</span>
            </DropdownMenuItem>
        </>
    );
});

MenuItems.displayName = 'MenuItems';

interface UserMenuProps {
    user: any;
    side?: "top" | "right" | "bottom" | "left";
    align?: "start" | "center" | "end";
    sideOffset?: number;
    alignOffset?: number;
    collisionPadding?: number;
    isMobileSSR?: boolean; // Added SSR mobile state
}

export function UserMenu({
                             user,
                             side,
                             align,
                             sideOffset = 4,
                             alignOffset,
                             collisionPadding,
                             isMobileSSR = false, // Default to false if not provided
                         }: UserMenuProps) {
    const { isMobile } = useIsMobileWithCookies();
    const t = useTranslations('UserDropdown');

    // Use SSR mobile state as fallback, then client-side detection
    const effectiveIsMobile = isMobileSSR || isMobile;

    const initials = React.useMemo(() => {
        const nameForInitials = user?.name || t('guestNamePlaceholder');
        return nameForInitials
            .split(' ')
            .filter(Boolean)
            .slice(0, 2)
            .map(word => word[0].toUpperCase())
            .join('');
    }, [user?.name, t]);

    if (!user) return null;

    const userNameToDisplay = user.name || t('guestNamePlaceholder');

    return (
        <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={side ?? (effectiveIsMobile ? "bottom" : "right")}
            align={align ?? "end"}
            sideOffset={sideOffset}
            alignOffset={alignOffset}
            collisionPadding={collisionPadding}
        >
            <DropdownMenuLabel className="p-0 font-normal">
                <UserInfo user={{ ...user, name: userNameToDisplay }} initials={initials} />
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            <MenuItems />
        </DropdownMenuContent>
    );
}