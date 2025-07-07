// src/components/features/navbar/NavTrigger.tsx
'use client';

import React, { useCallback, useMemo, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Icon } from '@/components/common/icon';
import { useSidebar } from '@/components/ui/sidebar';
import { useIsMobileWithCookies } from '@/hooks/use-mobile';
import { useRTL } from '@/providers/rtl-provider';

type SidebarTriggerProps = {
    className?: string;
    isMobileSSR?: boolean;
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
};

export default function NavTrigger({
                                           className,
                                           onClick,
                                           isMobileSSR = false,
                                       }: SidebarTriggerProps) {
    const { toggleSidebar, open, openMobile } = useSidebar();
    const { isMobile, isHydrated } = useIsMobileWithCookies();

    // Automatically detect RTL - no props needed!
    const { isRTL, direction } = useRTL();

    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        console.log('🔧 RTL NavTrigger mounted:', {
            isRTL,
            direction,
            open,
            openMobile,
            isMobile,
            isHydrated,
            isMobileSSR
        });
    }, []);

    const handleClick = useCallback(
        (e: React.MouseEvent<HTMLButtonElement>) => {
            e.preventDefault();
            e.stopPropagation();

            if (navigator?.vibrate) navigator.vibrate(1);
            onClick?.(e);
            toggleSidebar();
        },
        [onClick, toggleSidebar]
    );

    // Perfect state selection using SSR mobile detection
    const isOpen = useMemo(() => {
        if (!mounted) {
            if (isMobileSSR) {
                console.log('🎯 SSR mobile state: using closed');
                return false;
            } else {
                console.log('🎯 SSR desktop state: using open:', open);
                return open;
            }
        }

        if (!isHydrated) {
            const result = isMobileSSR ? false : open;
            console.log('🎯 Pre-hydration state:', { isMobileSSR, open, result });
            return result;
        }

        const result = isMobile ? openMobile : open;
        console.log('🎯 Post-hydration definitive state:', {
            isMobile,
            openMobile,
            open,
            result
        });
        return result;
    }, [mounted, isHydrated, isMobile, openMobile, open, isMobileSSR]);

    const ariaLabel = useMemo(() => {
        const action = isOpen ? 'Close' : 'Open';
        const deviceType = isMobileSSR || (mounted && isHydrated && isMobile) ? ' (mobile)' : '';
        return `${action} sidebar${deviceType}`;
    }, [isOpen, mounted, isHydrated, isMobile, isMobileSSR]);

    // Enhanced RTL-aware icon rotation - automatically detects direction
    const iconRotation = useMemo(() => {
        // Base rotation logic based on automatically detected RTL
        const shouldRotate = isRTL ? !isOpen : isOpen;

        const rotation = shouldRotate ? 'rotate-180' : 'rotate-0';

        console.log('🔄 Auto RTL Icon rotation:', {
            isRTL,
            direction,
            isOpen,
            shouldRotate,
            rotation,
            phase: !mounted ? 'SSR' : !isHydrated ? 'pre-hydration' : 'post-hydration',
            isMobileSSR
        });

        return rotation;
    }, [isOpen, isRTL, direction, mounted, isHydrated, isMobileSSR]);

    const shouldUseMobileStyles = isMobileSSR || (mounted && isHydrated && isMobile);

    return (
        <Button
            dir={direction} // Automatically set from RTL context
            data-sidebar="trigger"
            data-slot="sidebar-trigger"
            variant="outline"
            size="icon"
            onClick={handleClick}
            aria-label={ariaLabel}
            aria-expanded={isOpen}
            data-state={isOpen ? 'open' : 'closed'}
            data-direction={direction}
            data-rtl={isRTL}
            data-mobile={shouldUseMobileStyles}
            data-mobile-ssr={isMobileSSR}
            data-hydrated={isHydrated}
            data-mounted={mounted}
            className={cn(
                'size-8 relative overflow-hidden group cursor-pointer touch-manipulation select-none hover:bg-accent/80 hover:text-accent-foreground transition-all duration-200 ease-out',
                // RTL-specific classes (automatically applied when isRTL=true)
                '',
                // LTR-specific classes (automatically applied when isRTL=false)
                '',
                isRTL,
                className
            )}
        >
            <Icon
                name="ArrowLineRightIcon"
                className={cn(
                    'transition-transform duration-200 ease-out',
                    iconRotation
                )}
                size={shouldUseMobileStyles ? 18 : 16}
                aria-hidden="true"
            />
            <span className="sr-only">
                {isOpen ? 'Collapse' : 'Expand'} navigation sidebar
            </span>
        </Button>
    );
}