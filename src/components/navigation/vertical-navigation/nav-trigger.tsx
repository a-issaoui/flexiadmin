// src/components/features/navbar/NavTrigger.tsx
'use client';

import React, { useCallback, useMemo, useEffect, useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Icon } from '@/components/common/icon';
import { useSidebar } from '@/components/ui/sidebar';
import { useIsMobile, useIsMobileHydrated } from '@/stores/mobile.store';
import { useRTL } from '@/providers/rtl-provider';
import { useSidebar as useSidebarStore } from '@/stores/sidebar.store';

type SidebarTriggerProps = {
    className?: string;
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
};

export default function NavTrigger({
                                           className,
                                           onClick,
                                       }: SidebarTriggerProps) {
    const { toggleSidebar, open, openMobile, collapsible } = useSidebar();
    const { side } = useSidebarStore();
    const isMobile = useIsMobile();
    const isHydrated = useIsMobileHydrated();

    // Automatically detect RTL - no props needed!
    const { isRTL, direction } = useRTL();

    const [mounted, setMounted] = useState(false);
    const hasLoggedMount = useRef(false);
    const hasLoggedRotation = useRef(false);
    const hasLoggedState = useRef(false);

    useEffect(() => {
        setMounted(true);
        
        // Prevent duplicate logging in strict mode
        if (!hasLoggedMount.current && process.env.NODE_ENV === 'development') {
            hasLoggedMount.current = true;
            console.log('🔧 RTL NavTrigger mounted:', {
                isRTL,
                direction,
                open,
                openMobile,
                isMobile,
                isHydrated
            });
        }
    }, [isRTL, direction, open, openMobile, isMobile, isHydrated]);

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
            if (isMobile) {
                if (process.env.NODE_ENV === 'development' && !hasLoggedState.current) {
                    hasLoggedState.current = true;
                    console.log('🎯 SSR mobile state: using closed');
                }
                return false;
            } else {
                if (process.env.NODE_ENV === 'development' && !hasLoggedState.current) {
                    hasLoggedState.current = true;
                    console.log('🎯 SSR desktop state: using open:', open);
                }
                return open;
            }
        }

        if (!isHydrated) {
            const result = isMobile ? false : open;
            if (process.env.NODE_ENV === 'development' && !hasLoggedState.current) {
                hasLoggedState.current = true;
                console.log('🎯 Pre-hydration state:', { isMobile, open, result });
            }
            return result;
        }

        const result = isMobile ? openMobile : open;
        if (process.env.NODE_ENV === 'development' && !hasLoggedState.current) {
            hasLoggedState.current = true;
            console.log('🎯 Post-hydration definitive state:', {
                isMobile,
                openMobile,
                open,
                result
            });
        }
        return result;
    }, [mounted, isHydrated, isMobile, openMobile, open]);

    const ariaLabel = useMemo(() => {
        const action = isOpen ? 'Close' : 'Open';
        const deviceType = (mounted && isHydrated && isMobile) ? ' (mobile)' : '';
        return `${action} sidebar${deviceType}`;
    }, [isOpen, mounted, isHydrated, isMobile]);

    // Enhanced RTL-aware icon rotation - automatically detects direction
    const iconRotation = useMemo(() => {
        // Base rotation logic based on automatically detected RTL
        const shouldRotate = isRTL ? !isOpen : isOpen;

        const rotation = shouldRotate ? 'rotate-180' : 'rotate-0';

        // Only log rotation calculation once to avoid duplicates
        if (process.env.NODE_ENV === 'development' && !hasLoggedRotation.current) {
            hasLoggedRotation.current = true;
            console.log('🔄 Auto RTL Icon rotation:', {
                isRTL,
                direction,
                isOpen,
                shouldRotate,
                rotation,
                phase: !mounted ? 'SSR' : !isHydrated ? 'pre-hydration' : 'post-hydration',
                isMobile
            });
        }

        return rotation;
    }, [isOpen, isRTL, direction, mounted, isHydrated, isMobile]);

    const shouldUseMobileStyles = (mounted && isHydrated && isMobile);

    // Hide trigger when sidebar is not collapsible
    if (collapsible === 'none') {
        return null;
    }

    // Calculate positioning based on sidebar side and mobile state
    const getPositioning = () => {
        if (shouldUseMobileStyles) {
            // On mobile, position based on sidebar side
            return side === 'left' 
                ? 'right-[16px]'
                : 'left-[16px]';
        } else {
            // On desktop, position based on sidebar side
            return side === 'left' 
                ? 'right-[16px]'
                : 'left-[16px]';
        }
    };

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
            data-mobile-ssr={isMobile}
            data-hydrated={isHydrated}
            data-mounted={mounted}
            className={cn(
                'size-8 relative overflow-hidden group cursor-pointer touch-manipulation select-none hover:bg-accent/80 hover:text-accent-foreground transition-all duration-200 ease-out',
                // Half-outside positioning
                getPositioning(),
                // Enhanced styling for the half-outside effect
                'rounded-lgborder-2 border-border bg-background shadow-lg',
                // RTL-specific classes (automatically applied when isRTL=true)
                '',
                // LTR-specific classes (automatically applied when isRTL=false)
                '',
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