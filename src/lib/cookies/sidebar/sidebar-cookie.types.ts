import { SidebarSide, SidebarVariant, SidebarCollapsible } from '@/config/sidebar.config';

export interface SidebarData {
    open: boolean;
    openMobile: boolean;
    side: SidebarSide;
    variant: SidebarVariant;
    collapsible: SidebarCollapsible;
}

export const COOKIE_NAME = 'flexiadmin-sidebar';
export const COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year