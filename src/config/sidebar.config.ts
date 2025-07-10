// Sidebar Configuration
// Centralized sidebar settings and default values

export type SidebarSide = 'left' | 'right';
export type SidebarVariant = 'sidebar' | 'floating' | 'inset';
export type SidebarCollapsible = 'offcanvas' | 'icon' | 'none';

export interface SidebarConfig {
  // Default states
  defaultOpen: boolean;
  defaultOpenMobile: boolean;
  
  // Default layout properties
  defaultSide: SidebarSide;
  defaultVariant: SidebarVariant;
  defaultCollapsible: SidebarCollapsible;
  
  // Default responsive state
  defaultIsMobile: boolean;
  
  // Width constants
  width: string;
  widthMobile: string;
  widthIcon: string;
  
  // Breakpoints
  mobileBreakpoint: number; // px
  
  // Animation
  animationDuration: number; // ms
  
  // Persistence
  enablePersistence: boolean;
  cookieName: string;
}

// Default sidebar configuration
export const sidebarConfig: SidebarConfig = {
  // Default states
  defaultOpen: true,
  defaultOpenMobile: false,
  
  // Default layout properties
  defaultSide: 'left',
  defaultVariant: 'sidebar',
  defaultCollapsible: 'offcanvas',
  
  // Default responsive state
  defaultIsMobile: false,
  
  // Width constants (medium size)
  width: '16rem',        // 256px
  widthMobile: '18rem',  // 288px
  widthIcon: '3rem',     // 48px
  
  // Breakpoints
  mobileBreakpoint: 768, // px
  
  // Animation
  animationDuration: 300, // ms
  
  // Persistence
  enablePersistence: true,
  cookieName: 'flexiadmin-sidebar',
};

// Export constants for backward compatibility
export const SIDEBAR_WIDTH = sidebarConfig.width;
export const SIDEBAR_WIDTH_MOBILE = sidebarConfig.widthMobile;
export const SIDEBAR_WIDTH_ICON = sidebarConfig.widthIcon;
export const SIDEBAR_MOBILE_BREAKPOINT = sidebarConfig.mobileBreakpoint;
export const SIDEBAR_ANIMATION_DURATION = sidebarConfig.animationDuration;

// Utility functions
export const getSidebarWidth = (isMobile: boolean, isCollapsed: boolean = false): string => {
  if (isMobile) return sidebarConfig.widthMobile;
  if (isCollapsed) return sidebarConfig.widthIcon;
  return sidebarConfig.width;
};

export const getSidebarClasses = ({
  open,
  openMobile,
  side,
  variant,
  collapsible,
  isMobile,
}: {
  open: boolean;
  openMobile: boolean;
  side: SidebarSide;
  variant: SidebarVariant;
  collapsible: SidebarCollapsible;
  isMobile: boolean;
}): string => {
  const classes = [];
  
  // Base classes
  classes.push('sidebar');
  
  // Side
  classes.push(`sidebar-${side}`);
  
  // Variant
  classes.push(`sidebar-${variant}`);
  
  // Collapsible
  classes.push(`sidebar-${collapsible}`);
  
  // State classes
  if (open || (isMobile && openMobile)) {
    classes.push('sidebar-open');
  } else {
    classes.push('sidebar-closed');
  }
  
  if (isMobile) {
    classes.push('sidebar-mobile');
  }
  
  return classes.join(' ');
};

// Types are already exported above
