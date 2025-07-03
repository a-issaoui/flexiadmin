import React, { memo } from 'react';
import { Badge } from '@/components/ui/badge';
import type { NavigationBadge } from '@/types/navigation.types';

type Props = {
    badge: NavigationBadge;
};

const NavBadge: React.FC<Props> = ({ badge }) => {
    const { value, color ='#10b981', variant = 'default', shape = 'default' } = badge;

    if (value === null || value === undefined) return null;

    return (
        <Badge variant={variant} shape={shape} color={color} className="flex-shrink-0">
            {value}
        </Badge>
    );
};

NavBadge.displayName = 'NavBadge';

export default memo(NavBadge);
