'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import {
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Icon } from '@/components/common/icon';
import { useIsMobileWithCookies } from '@/hooks/use-mobile';

const UserInfo = React.memo(({ user, initials }: { user: any; initials: string }) => (
    <div className="flex items-center gap-2 px-1 py-1.5 rtl:flex-row-reverse text-sm text-left rtl:text-right">
        <Avatar className="h-8 w-8 rounded-lg shrink-0">
            <AvatarImage src={user.imageUrl} alt={user.name || ''} />
            <AvatarFallback className="rounded-lg bg-gray-200">{initials}</AvatarFallback>
        </Avatar>
        <div className="grid flex-1 min-w-0 leading-tight">
      <span className="truncate font-medium" title={user.name}>
        {user.name}
      </span>
            <span className="truncate text-xs text-muted-foreground" title={user.email}>
        {user.email}
      </span>
        </div>
    </div>
));
UserInfo.displayName = 'UserInfo';

const MenuItems = React.memo(() => {
    const t = useTranslations('UserDropdown');
    const base = "flex items-center gap-2 rtl:flex-row-reverse";

    return (
        <>
            <DropdownMenuGroup>
                <DropdownMenuItem className={base}>
                    <Icon name="UsersIcon" className="h-4 w-4 shrink-0" />
                    <span>{t('account')}</span>
                </DropdownMenuItem>
                <DropdownMenuItem className={base}>
                    <Icon name="CalendarIcon" className="h-4 w-4 shrink-0" />
                    <span>{t('billing')}</span>
                </DropdownMenuItem>
                <DropdownMenuItem className={base}>
                    <Icon name="BellIcon" className="h-4 w-4 shrink-0" />
                    <span>{t('notifications')}</span>
                </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem className={`${base} text-destructive focus:text-destructive`}>
                <Icon name="SignOutIcon" className="h-4 w-4 shrink-0" />
                <span>{t('logout')}</span>
            </DropdownMenuItem>
        </>
    );
});
MenuItems.displayName = 'MenuItems';

export function UserDropdown({
                             user,
                             side,
                             align,
                             sideOffset = 4,
                             alignOffset,
                             collisionPadding,
                             isMobileSSR = false,
                         }: {
    user: any;
    side?: 'top' | 'right' | 'bottom' | 'left';
    align?: 'start' | 'center' | 'end';
    sideOffset?: number;
    alignOffset?: number;
    collisionPadding?: number;
    isMobileSSR?: boolean;
}) {
    const { isMobile } = useIsMobileWithCookies();
    const t = useTranslations('UserDropdown');

    if (!user) return null;

    const nameForInitials = user.name || t('guestNamePlaceholder');
    const initials = React.useMemo(
        () =>
            nameForInitials
                .split(' ')
                .filter(Boolean)
                .slice(0, 2)
                .map((w) => w[0].toUpperCase())
                .join(''),
        [nameForInitials]
    );

    return (
        <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={side ?? (isMobileSSR || isMobile ? 'bottom' : 'right')}
            align={align ?? 'end'}
            sideOffset={sideOffset}
            alignOffset={alignOffset}
            collisionPadding={collisionPadding}
        >
            <DropdownMenuLabel className="p-0 font-normal">
                <UserInfo user={{ ...user, name: nameForInitials }} initials={initials} />
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <MenuItems />
        </DropdownMenuContent>
    );
}
