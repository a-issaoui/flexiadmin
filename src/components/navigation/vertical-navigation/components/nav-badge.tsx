import React, { memo } from 'react';
import { Badge } from '@/components/ui/badge';
import type { NavigationBadge } from '@/config/navigation/types';

type Props = {
    badge: NavigationBadge;
    level?: number;
};

const NavBadge: React.FC<Props> = ({ badge, level = 0 }) => {
    const { value, color ='#10b981', variant = 'default', shape = 'default' } = badge;

    if (value === null || value === undefined) return null;

    // Dynamic sizing based on nesting level to match icon sizing
    const getBadgeSize = () => {
        if (level === 0) return 'text-xs px-1.5 py-0.5'; // Main level
        if (level === 1) return 'text-xs px-1 py-0.5 scale-90'; // First submenu - smaller height
        return 'text-xs px-1 py-0.5 h-3 scale-75'; // Deeper levels - smallest height
    };

    return (
        <Badge variant={variant} shape={shape} color={color} className={`flex-shrink-0 ${getBadgeSize()}`}>
            {value}
        </Badge>
    );
};

NavBadge.displayName = 'NavBadge';

export default memo(NavBadge);
