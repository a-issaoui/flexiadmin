// src/components/features/navigation/vertical-navigation/vertical-navigation.tsx

"use client"
import React from 'react';
import { NavContent } from '@/components/navigation/vertical-navigation/components/nav-content'
import { usePathname } from "next/navigation";
import { Sidebar, SidebarFooter, SidebarHeader, SidebarRail } from "@/components/ui/sidebar";
import { NavOrganization } from "@/components/navigation/vertical-navigation/components/nav-organization";
import { OrganisationData } from "@/data/organisation-data";
import { NavUser } from "@/components/navigation/vertical-navigation/components/nav-user";
import { UserData } from "@/data/user-data";
import useMenuHandler from "@/hooks/use-menu-handler"
import { useRoleNavigation } from "@/hooks/use-navigation";
import { useRTL } from "@/providers/rtl-provider";
import { useSidebar } from "@/stores/sidebar.store";

import type { UserPermissions } from '@/config/navigation/types';

export type VerticalNavigationProps = {
    role: string;                       // Which role's navigation to display
    userPermissions?: UserPermissions;  // Optional permissions for filtering
}

/**
 * Main vertical navigation component integrated with sidebar store.
 */
export default function VerticalNavigation({ role }: VerticalNavigationProps) {
    const pathname = usePathname();
    const { handleMenuClick } = useMenuHandler();
    const { isRTL } = useRTL();
    
    // Use sidebar store for state management
    const { side, variant, collapsible, setSide } = useSidebar();

    // Get the navigation data for the specified role
    const navigationGroups = useRoleNavigation(role);

    // Auto-adjust sidebar side based on RTL if needed
    React.useEffect(() => {
        const preferredSide: 'left' | 'right' = isRTL ? 'right' : 'left';
        if (side !== preferredSide) {
            setSide(preferredSide);
        }
    }, [isRTL, side, setSide]);

    return (
        <Sidebar
            variant={variant}
            side={side}
            collapsible={collapsible}
            id="navigation"
            role="navigation"
            aria-label="Main navigation"
        >
            <SidebarHeader>
                <NavOrganization organisation={OrganisationData} />
            </SidebarHeader>

            {/*
                The NavContent component now receives processed navigation data.
                No RTL props needed - components detect direction automatically.
            */}
            <NavContent
                navigationGroups={navigationGroups}
                currentPath={pathname}
                onMenuClick={handleMenuClick}
            />

            <SidebarFooter>
                <NavUser user={UserData} />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
}