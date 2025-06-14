// src/app/admin/layout.tsx

import { cookies } from 'next/headers';
import AppSidebar from '@/components/layout/admin/sidebar/app-sidebar';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';

export  default async function AdminLayout({ children }: { children: React.ReactNode }) {
    // Get sidebar state from cookie
    let sidebarOpen = true;
    try {
        const cookieStore = await cookies();
        sidebarOpen = cookieStore.get('sidebar_state')?.value === 'true';
    } catch (error) {
        console.error('Failed to read sidebar state:', error);
    }

    return (
        <SidebarProvider
            defaultOpen={sidebarOpen}

        >
            <AppSidebar />
            <SidebarInset className="flex min-w-0 flex-1 flex-col">
                <main className="flex-1 m-2 overflow-hidden">
                    {children}
                </main>
            </SidebarInset>
        </SidebarProvider>
    );
}
