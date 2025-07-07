import React, { memo, useCallback, useState } from 'react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTranslations } from 'next-intl';
import { Icon } from '@/components/common/icon';
import { cn } from '@/lib/utils';
import type { NavigationAction } from '@/types/navigation.types';

type NavActionsProps = {
    actions: NavigationAction[];
    size?: 'sm' | 'md';
    sideOffset?: number;
};

const NavActions: React.FC<NavActionsProps> = ({ actions, size = 'md', sideOffset = 20 }) => {
    const t = useTranslations('actions');
    const [isOpen, setIsOpen] = useState(false);

    const handleActionClick = useCallback(
        (e: React.MouseEvent, action: NavigationAction) => {
            e.stopPropagation();
            e.preventDefault();
            action.handler();
        },
        []
    );

    if (!actions?.length) return null;

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
                        buttonSize
                    )}
                >
                    <Icon
                        name="DotsThreeOutlineIcon"
                        className={cn(iconSize, 'transition-transform flex-shrink-0', isOpen && 'rotate-90')}
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
                        {t(action.id, { defaultValue: action.label })}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

NavActions.displayName = 'NavActions';

export default memo(NavActions);
