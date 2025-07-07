// src/app/(protected)/admin/layout.tsx

import {cookies, headers} from 'next/headers';
import {VerticalNavigation} from "@/components/features/navigation/vertical-navigation";
import {SidebarProvider, SidebarInset} from '@/components/ui/sidebar';
import {AppNavbar} from "@/components/features/navbar/app-navbar";

import {getIsMobileFromCookies} from "@/hooks/use-mobile";
import {PageHeader} from "@/components/common/page-header";
import React from "react";

export default async function AdminLayout({children}: { children: React.ReactNode }) {
    const rtl = false;

    let sidebarOpen = true;
    let isMobileSSR = false;

    try {
        const cookieStore = await cookies();
        const headersList = await headers();

        // Read sidebar state
        const sidebarState = cookieStore.get('sidebar_state')?.value;
        sidebarOpen = sidebarState === 'true';

        // Read mobile state from cookies
        const cookieHeader = headersList.get('cookie') || '';
        isMobileSSR = getIsMobileFromCookies(cookieHeader);
    } catch (error) {
        console.error('Cookie state fetch failed:', error);
    }

    // TODO: When you implement authentication, get user permissions here
    // const userPermissions = await getUserPermissions();

    return (
        <SidebarProvider defaultOpen={sidebarOpen}>
            <div className="flex h-screen w-full overflow-hidden">
                {/* Use role-specific navigation - simple and direct */}
                <VerticalNavigation
                    rtl={rtl}
                    role="admin"
                    userPermissions={undefined} // Will be filled in when permissions are implemented
                />
                <SidebarInset className="flex flex-1 flex-col min-w-0">
                    <div className="w-full px-4 sm:px-6 lg:px-8">
                        <AppNavbar rtl={rtl} isMobileSSR={isMobileSSR}/>
                    </div>
                    <main className="flex-1 overflow-auto px-4 py-4 sm:px-6 lg:px-8">
                        <PageHeader
                            rtl={rtl}
                            showBreadcrumb={true}
                        />
                        {children}
                    </main>
                </SidebarInset>
            </div>
        </SidebarProvider>
    );
}