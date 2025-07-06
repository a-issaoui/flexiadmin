"use client"
import React from 'react';
import { NavContent } from '@/components/features/navigation/vertical-navigation/components/nav-content'
import { usePathname } from "next/navigation";
import { Sidebar, SidebarFooter, SidebarHeader, SidebarRail } from "@/components/ui/sidebar";
import { NavOrganization } from "@/components/features/navigation/vertical-navigation/components/nav-organization";
import { OrganisationData } from "@/data/organisation-data";
import { NavUser } from "@/components/features/navigation/vertical-navigation/components/nav-user";
import { UserData } from "@/data/user-data";
import useMenuHandler from "@/hooks/use-menu-handler"
import { useRoleNavigation } from "@/hooks/use-navigation";
import { useLayoutStore } from '@/stores/layout.store';
import type { UserPermissions } from '@/config/navigation/types';

export type VerticalNavigationProps = {
    rtl: boolean;
    role: string;                       // Which role's navigation to display
    userPermissions?: UserPermissions;  // Optional permissions for filtering
}

/**
 * Main vertical navigation component.
 *
 * This component is now much simpler because it uses role-specific navigation hooks
 * that handle all the complexity of building navigation data, applying translations,
 * and filtering permissions.
 */
export default function VerticalNavigation({ rtl, role, userPermissions }: VerticalNavigationProps) {
    const pathname = usePathname();
    const { handleMenuClick } = useMenuHandler();

    // Get the current sidebar variant from the store
    const sidebarVariant = useLayoutStore(state => state.sidebar.sidebarVariant);

    // Get the navigation data for the specified role
    const navigationGroups = useRoleNavigation(role, userPermissions);

    const side: 'left' | 'right' = rtl ? 'right' : 'left';

    return (
        <Sidebar
            variant={sidebarVariant} // Use the dynamic variant from the store
            side={side}
            collapsible="icon"
        >
            <SidebarHeader>
                <NavOrganization organisation={OrganisationData} />
            </SidebarHeader>

            {/*
                The NavContent component now receives processed navigation data.
                No more complex configuration objects or translation helpers needed.
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