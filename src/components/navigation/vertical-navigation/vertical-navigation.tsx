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
import type { UserPermissions } from '@/config/navigation/types';

export type VerticalNavigationProps = {
    role: string;                       // Which role's navigation to display
    userPermissions?: UserPermissions;  // Optional permissions for filtering
}

/**
 * Main vertical navigation component with automatic RTL detection.
 * No need to pass RTL props - it detects direction automatically!
 */
export default function VerticalNavigation({ role, userPermissions }: VerticalNavigationProps) {
    const pathname = usePathname();
    const { handleMenuClick } = useMenuHandler();
    const { isRTL } = useRTL(); // Automatically detect RTL

    // Get the navigation data for the specified role
    const navigationGroups = useRoleNavigation(role, userPermissions);

    // Automatically determine sidebar side based on RTL
    const side: 'left' | 'right' = isRTL ? 'right' : 'left';

    return (
        <Sidebar
            variant="sidebar"
            side={side}
            collapsible="icon"
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