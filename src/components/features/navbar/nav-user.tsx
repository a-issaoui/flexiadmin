'use client';

import * as React from 'react';
import {
    DropdownMenu,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { UserDropdown } from '@/components/common/user-dropdown';
import { useNavbar } from '@/components/features/navbar/app-navbar';

export function NavUser({ user }: { user: any }) {
    const { activeDropdown, setActiveDropdown } = useNavbar();
    const [imageLoaded, setImageLoaded] = React.useState(false);
    const [imageError, setImageError] = React.useState(false);
    const isMenuOpen = activeDropdown === 'user';

    React.useEffect(() => {
        if (user?.imageUrl) {
            const img = new Image();
            img.onload = () => setImageLoaded(true);
            img.onerror = () => setImageError(true);
            img.src = user.imageUrl;
        }
    }, [user?.imageUrl]);

    const initials = React.useMemo(
        () =>
            user.name
                ?.split(' ')
                .filter(Boolean)
                .slice(0, 2)
                .map((w) => w[0]?.toUpperCase())
                .join('') || 'US',
        [user?.name]
    );

    if (!user) return null;

    return (
        <DropdownMenu open={isMenuOpen} onOpenChange={(open) => setActiveDropdown(open ? 'user' : null)}>
            <DropdownMenuTrigger
                className="rounded-full cursor-pointer ms-4 min-w-[44px] min-h-[44px] touch-manipulation select-none focus:outline-none"
                aria-label={`User menu for ${user.name || 'User'}`}
            >
                <div className="group relative size-10 bg-muted rounded-full border-2 border-green-500 flex items-center justify-center hover:bg-accent/80 hover:border-green-400 hover:scale-105 transition">
                    <Avatar className="size-8">
                        <AvatarImage
                            src={user.imageUrl}
                            alt={user.name || 'User Avatar'}
                            loading="lazy"
                            onLoad={() => setImageLoaded(true)}
                            onError={() => setImageError(true)}
                            className={cn("object-cover", !imageLoaded && "opacity-0 scale-95", imageLoaded && "opacity-100")}
                        />
                        <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">
                            {initials}
                        </AvatarFallback>
                    </Avatar>
                    <span
                        className="absolute bottom-0 end-0 block h-3 w-3 rounded-full border-2 border-white bg-green-500 shadow-md"
                        aria-label="Online"
                        title="Online"
                    />
                </div>
            </DropdownMenuTrigger>
            <UserDropdown user={user} side="bottom" align="end" sideOffset={12} alignOffset={-2} collisionPadding={10} />
        </DropdownMenu>
    );
}
