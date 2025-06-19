'use client'
import { usePathname } from "next/navigation"
// UI Components
import { Sidebar, SidebarHeader, SidebarFooter, SidebarRail } from "@/components/ui/sidebar"
import { OrgSidebar } from "@/components/layout/admin/sidebar/org-sidebar"
import { UserSidebar } from "@/components/layout/admin/sidebar/user-sidebar"

// The refactored Presentational Component from the previous step
import { AppSidebarContent } from "@/components/layout/admin/sidebar/components/app-sidebar-content"

// Data
import { OrganisationData } from "@/data/organisation-data"
import { UserData } from "@/data/user-data"
import { sidebarData } from "@/data/sidebar-data"

// Handlers & Hooks
import useActionHandler from "./handlers/use-action-handler"
import useMenuHandler from "./handlers/use-menu-handler"
import { useSidebarData } from "@/hooks/use-sidebar-data"

interface AppSidebarClientProps {
    rtl: boolean
}

export default function AppSidebar({ rtl }: AppSidebarClientProps) {
    const pathname = usePathname()

    // Process the raw data to get stable, SSR-safe IDs
    const processedData = useSidebarData(sidebarData)

    // Call the handlers
    const { handleMenuClick } = useMenuHandler()
    const { handleActionClick } = useActionHandler()

    const side: 'left' | 'right' = rtl ? 'right' : 'left';

    return (
        <Sidebar
            variant="sidebar"
            side={side}
            collapsible="icon" // This is key for mobile - use 'offcanvas' instead of 'icon'
        >
            <SidebarHeader>
                <OrgSidebar organisation={OrganisationData} />
            </SidebarHeader>

            <AppSidebarContent
                data={processedData}
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