// src/app/(protected)/admin/layout.tsx

import { cookies, headers } from 'next/headers';
import { VerticalNavigation } from '@/components/features/navigation/vertical-navigation';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppNavbar } from '@/components/features/navbar/app-navbar';
import { getIsMobileFromCookies } from '@/hooks/use-mobile';
import { PageHeader } from '@/components/common/page-header';
import { cn } from '@/lib/utils';
import React from 'react';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const rtl = false

    const cookieStore = await cookies();
    const headersList = await headers();

    const sidebarState = cookieStore.get('sidebar_state')?.value;
    const sidebarOpen = sidebarState === 'true';

    const cookieHeader = headersList.get('cookie') || '';
    const isMobileSSR = getIsMobileFromCookies(cookieHeader);

    return (
        <SidebarProvider defaultOpen={sidebarOpen}>
            <div
                className={cn(
                    'layout-grid-bg flex h-screen w-full overflow-hidden'
                )}
            >
                <VerticalNavigation
                    rtl={rtl}
                    role="admin"
                    userPermissions={undefined} // Add real permissions logic later
                />

                <SidebarInset className="flex flex-1 flex-col min-w-0">
                    <div className="w-full px-4 sm:px-6 lg:px-8">
                        <AppNavbar rtl={rtl} isMobileSSR={isMobileSSR} />
                    </div>

                    <main className="flex-1 overflow-auto px-4 py-4 sm:px-6 lg:px-8">
                        <PageHeader rtl={rtl} showBreadcrumb />
                        {children}
                    </main>
                </SidebarInset>
            </div>
        </SidebarProvider>
    );
}
