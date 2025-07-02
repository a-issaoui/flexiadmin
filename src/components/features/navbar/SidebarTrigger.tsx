'use client';

import React, { useCallback, useMemo, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Icon } from '@/components/common/icon';
import { useSidebar } from '@/components/ui/sidebar';
import { useIsMobileWithCookies } from '@/hooks/use-mobile';

type SidebarTriggerProps = {
    className?: string;
    rtl?: boolean;
    isMobileSSR?: boolean; // Mobile state from SSR
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
};

export default function SidebarTrigger({
                                           className,
                                           onClick,
                                           rtl = false,
                                           isMobileSSR = false, // Default to false if not provided
                                       }: SidebarTriggerProps) {
    const { toggleSidebar, open, openMobile } = useSidebar();
    const { isMobile, isHydrated } = useIsMobileWithCookies();

    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        console.log('🔧 SidebarTrigger mounted:', {
            rtl,
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
            // SSR: We now know if it's mobile from cookies!
            if (isMobileSSR) {
                // Mobile: use closed state (matches openMobile default)
                console.log('🎯 SSR mobile state: using closed');
                return false;
            } else {
                // Desktop: use actual open state from cookie
                console.log('🎯 SSR desktop state: using open:', open);
                return open;
            }
        }

        if (!isHydrated) {
            // Pre-hydration: continue with SSR assumption
            const result = isMobileSSR ? false : open;
            console.log('🎯 Pre-hydration state:', { isMobileSSR, open, result });
            return result;
        }

        // Post-hydration: Use definitive device state
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

    const iconRotation = useMemo(() => {
        const rotation = rtl
            ? (isOpen ? 'rotate-0' : 'rotate-180')
            : (isOpen ? 'rotate-180' : 'rotate-0');

        console.log('🔄 Icon rotation:', {
            rtl,
            isOpen,
            rotation,
            phase: !mounted ? 'SSR' : !isHydrated ? 'pre-hydration' : 'post-hydration',
            isMobileSSR
        });
        return rotation;
    }, [isOpen, rtl, mounted, isHydrated, isMobileSSR]);

    const shouldUseMobileStyles = isMobileSSR || (mounted && isHydrated && isMobile);

    return (
        <Button
            dir={rtl ? 'rtl' : 'ltr'}
            data-sidebar="trigger"
            data-slot="sidebar-trigger"
            variant="outline"
            size="icon"
            onClick={handleClick}
            aria-label={ariaLabel}
            aria-expanded={isOpen}
            data-state={isOpen ? 'open' : 'closed'}
            data-direction={rtl ? 'rtl' : 'ltr'}
            data-mobile={shouldUseMobileStyles}
            data-mobile-ssr={isMobileSSR}
            data-hydrated={isHydrated}
            data-mounted={mounted}
            className={cn(
                'size-8 relative overflow-hidden group cursor-pointer touch-manipulation select-none',
                'hover:bg-accent/80 hover:text-accent-foreground',
                'transition-all duration-200 ease-out',
                className
            )}
        >
            <Icon
                name="ArrowLineRight"
                className={cn(
                    'transition-transform duration-200 ease-out ',
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