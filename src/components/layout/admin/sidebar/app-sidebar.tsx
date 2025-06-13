"use client"
import { Sidebar, SidebarHeader, SidebarFooter, SidebarRail } from "@/components/ui/sidebar"
import AppSidebarContent from "@/components/layout/admin/sidebar/components/app-sidebar-content"
import { OrgSidebar } from "@/components/layout/admin/sidebar/org-sidebar"
import { UserSidebar } from "@/components/layout/admin/sidebar/user-sidebar"
import { OrganisationData } from "@/data/organisation-data"
import { UserData } from "@/data/user-data"
import { sidebarData } from "@/data/sidebar-data"
import type { SbMenu, SbSubMenu, MenuAction, SbGroup } from "@/types/sidebar-data"
import { useRouter, usePathname } from "next/navigation"
import { useCallback } from "react"

export default function AppSidebar() {
    const router = useRouter()
    const pathname = usePathname()

    // Handle menu navigation
    const handleMenuClick = useCallback((url: string, item: SbMenu | SbSubMenu) => {
        console.log('Navigating to:', url, 'Item:', item)
        router.push(url)
    }, [router])

    // Handle action clicks
    const handleActionClick = useCallback((
        action: MenuAction,
        context?: { group?: SbGroup; menu?: SbMenu; submenu?: SbSubMenu }
    ) => {
        console.log('Action clicked:', action, 'Context:', context)

        // Handle custom actions based on customHandler
        switch (action.customHandler) {
            case 'refreshAllDashboards':
                // Implement refresh all dashboards logic
                console.log('Refreshing all dashboards...')
                break

            case 'exportDashboardData':
                // Implement export dashboard data logic
                console.log('Exporting dashboard data...')
                break

            case 'refreshOverview':
                // Implement refresh overview logic
                console.log('Refreshing overview...')
                break

            case 'openInviteModal':
                // Implement invite user modal logic
                console.log('Opening invite modal...')
                break

            case 'openUserForm':
                // Implement add user form logic
                console.log('Opening user form...')
                break

            case 'resetAllSettings':
                // Implement reset settings logic
                console.log('Resetting all settings...')
                break

            default:
                console.log('Unhandled action:', action.customHandler)
        }
    }, [])

    return (
        <Sidebar
            variant="sidebar"
            side="left"
            collapsible="icon"
        >
            <SidebarHeader>
                <OrgSidebar organisation={OrganisationData} />
            </SidebarHeader>

            <AppSidebarContent
                data={sidebarData}
                currentPath={pathname}
                onMenuClick={handleMenuClick}
                onActionClick={handleActionClick}
            />

            <SidebarFooter>
                <UserSidebar user={UserData} />
            </SidebarFooter>

            <SidebarRail />
        </Sidebar>
    )
}