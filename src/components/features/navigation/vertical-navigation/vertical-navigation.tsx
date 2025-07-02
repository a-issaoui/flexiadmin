"use client"
import React from 'react';
import { NavContent } from '@/components/features/navigation/vertical-navigation/components/nav-content'
import { usePathname } from "next/navigation";
import {Sidebar, SidebarFooter, SidebarHeader, SidebarRail} from "@/components/ui/sidebar";
import { NavOrganization } from "@/components/features/navigation/vertical-navigation/components/nav-organization";
import { OrganisationData } from "@/data/organisation-data";
import { NavUser } from "@/components/features/navigation/vertical-navigation/components/nav-user";
import { adminNavigation } from "@/config/navigation/admin.navigation";
import { UserData } from "@/data/user-data";
import useMenuHandler from "@/hooks/use-menu-handler"

export type VerticalNavigationProps = {
    rtl: boolean
}

export default function VerticalNavigation({ rtl }: VerticalNavigationProps) {
    const pathname = usePathname()

    // Call the handlers
    const { handleMenuClick } = useMenuHandler()

    const side: 'left' | 'right' = rtl ? 'right' : 'left';

    return (
        <Sidebar
            variant="sidebar"
            side={side}
            collapsible="icon"
        >
            <SidebarHeader>
                <NavOrganization organisation={OrganisationData} />
            </SidebarHeader>

            <NavContent
                data={adminNavigation}
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