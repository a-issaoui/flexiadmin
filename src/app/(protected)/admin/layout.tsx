// src/app/admin/layout.tsx
import {cookies, headers} from 'next/headers';
import {VerticalNavigation} from "@/components/features/navigation/vertical-navigation";
import {SidebarProvider, SidebarInset} from '@/components/ui/sidebar';
import {AppNavbar} from "@/components/features/navbar/app-navbar";
import {isRTL} from "@/stores/locale.store";
import {getIsMobileFromCookies} from "@/hooks/use-mobile";
import React from "react";

export default async function AdminLayout({children}: { children: React.ReactNode }) {
    const rtl = await isRTL();

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

        console.log('🏗️ AdminLayout SSR:', {sidebarOpen, isMobileSSR, rtl});
    } catch (error) {
        console.error('Cookie state fetch failed:', error);
    }

    return (
        <SidebarProvider defaultOpen={sidebarOpen}>
            <div className="flex h-screen w-full overflow-hidden">
                <VerticalNavigation rtl={rtl}/>
                <SidebarInset className="flex flex-1 flex-col min-w-0">
                    <div className="w-full px-4 sm:px-6 lg:px-8">
                        <AppNavbar rtl={rtl} isMobileSSR={isMobileSSR}/>
                    </div>
                    <main className="flex-1 overflow-auto px-4 py-4 sm:px-6 lg:px-8">
                        {children}
                    </main>
                </SidebarInset>
            </div>
        </SidebarProvider>
    );
}