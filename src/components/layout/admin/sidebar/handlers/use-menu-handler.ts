// handlers/use-menu-handler.ts
import { useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import type { SbMenu, SbSubMenu } from "@/types/sidebar-data";

export default function useMenuHandler() {
    const router = useRouter();
    const pathname = usePathname();

    const handleMenuClick = useCallback(
        (url: string, item: SbMenu | SbSubMenu, event?: React.MouseEvent) => {
            console.log("Navigating to:", url, "Item:", item);

            // Don't navigate if URL is invalid
            if (!url || url === '#') {
                console.log("Invalid URL, skipping sidebarData");
                event?.preventDefault();
                event?.stopPropagation();
                return;
            }

            // Normalize paths for comparison
            const normalizePath = (path: string) => path.replace(/\/$/, '') || '/';
            const normalizedUrl = normalizePath(url.split('?')[0].split('#')[0]);
            const normalizedCurrentPath = normalizePath(pathname || '');

            // Check if we're already on this page
            if (normalizedUrl === normalizedCurrentPath) {
                console.log("Already on this page, preventing sidebarData");
                event?.preventDefault();
                event?.stopPropagation();
                return;
            }

            console.log("Proceeding with sidebarData");
            router.push(url);
        },
        [router, pathname]
    );

    return {
        handleMenuClick,
    };
}