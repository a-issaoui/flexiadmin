// src/app/(protected)/admin/layout.tsx

import { VerticalNavigation } from "@/components/navigation/vertical-navigation";
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppNavbar } from "@/components/features/navbar/app-navbar";
import { PageHeader } from "@/components/common/page-header";
import { SidebarHydrator } from "@/components/hydration/sidebar-hydrator";
import { LayoutSettingsSheet } from "@/components/layout/layout-settings-sheet";
import { getSidebarDataSSR } from "@/lib/cookies/sidebar/sidebar-cookie.server";
import { sidebarConfig } from "@/config/sidebar.config";
import React from "react";

// Force dynamic rendering for admin dashboard
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    let sidebarData;

    try {
        // Read sidebar state from SSR-friendly cookies
        sidebarData = await getSidebarDataSSR();
    } catch (error) {
        console.error('Cookie state fetch failed:', error);
        // Use centralized default values from config
        sidebarData = {
            open: sidebarConfig.defaultOpen,
            openMobile: sidebarConfig.defaultOpenMobile,
            side: sidebarConfig.defaultSide,
            variant: sidebarConfig.defaultVariant,
            collapsible: sidebarConfig.defaultCollapsible,
        };
    }

    // Note: RTL is now handled automatically by RTLProvider in root layout
    // No need to pass RTL props to any component!

    return (
        <SidebarProvider defaultOpen={sidebarData.open}>
            <SidebarHydrator initialData={sidebarData} />
            <VerticalNavigation
                role="admin"
                userPermissions={undefined}
            />
            <SidebarInset >
                <div className="w-full px-4 sm:px-6 lg:px-8">
                    <AppNavbar />
                </div>
                <main className="flex-1 overflow-auto px-4 sm:px-6 lg:px-8">
                    <PageHeader showBreadcrumb={true} />
                    {children}
                </main>
            </SidebarInset>
            <LayoutSettingsSheet />
        </SidebarProvider>
    );
}