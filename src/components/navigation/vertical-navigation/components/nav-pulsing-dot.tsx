// src/components/features/navigation/vertical-navigation/components/nav-pulsing-dot.tsx

import React, { memo } from 'react';
import { sanitizeColor, getSafeColor } from '@/lib/color-validation';
type NavPulsingDotProps = {
    color?: string;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
};

/**
 * Enhanced pulsing dot component for indicating activity in collapsed navigation items.
 *
 * This component should only be used to indicate that collapsed parent items
 * have children with badges or important updates.
 */
const NavPulsingDot: React.FC<NavPulsingDotProps> = ({
                                                         color = '#10b981', // Default green color
                                                         size = 'sm',
                                                         className
                                                     }) => {
    const sizeClasses = {
        sm: 'h-1.5 w-1.5',
        md: 'h-2 w-2',
        lg: 'h-2.5 w-2.5'
    };

    const pulseSize = {
        sm: 'h-1.5 w-1.5',
        md: 'h-2 w-2',
        lg: 'h-2.5 w-2.5'
    };
    // Validate the color with a fallback
    const safeColor = getSafeColor(color, '#10b981');
    return (
        <span className={`relative inline-flex ${sizeClasses[size]} ${className || ''}`}>
            <span
                className={`animate-ping absolute inline-flex ${pulseSize[size]} rounded-full opacity-75`}
                style={{backgroundColor: safeColor}}
                aria-hidden="true"
            />
            <span
                className={`relative inline-flex rounded-full ${sizeClasses[size]}`}
                style={{backgroundColor: safeColor}}
                aria-label="Activity indicator"
            />
        </span>
    );
};

NavPulsingDot.displayName = 'NavPulsingDot';

export default memo(NavPulsingDot);