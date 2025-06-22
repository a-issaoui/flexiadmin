import React, { memo } from 'react';

type NavPulsingDotProps = {
    color?: string;
};

const NavPulsingDot: React.FC<NavPulsingDotProps> = ({ color = '#10b981' }) => (
    <span className="relative inline-flex h-1.5 w-1.5 flex-shrink-0">
    <span
        className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
        style={{ backgroundColor: color }}
    />
    <span
        className="relative inline-flex rounded-full h-1.5 w-1.5"
        style={{ backgroundColor: color }}
    />
  </span>
);

NavPulsingDot.displayName = 'PulsingDot';

export default memo(NavPulsingDot);
