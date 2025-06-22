// src/hooks/use-menu-handler.ts
"use client"
import { useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import type { NavigationItem } from "@/types/navigation.types";

export default function useMenuHandler() {
    const router = useRouter();
    const pathname = usePathname();

    const handleMenuClick = useCallback(
        (item: NavigationItem, event?: React.MouseEvent) => {
            const url = item.href;

            // Don't navigate if URL is invalid
            if (!url || url === '#') {
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
                event?.preventDefault();
                event?.stopPropagation();
                return;
            }

            router.push(url);
        },
        [router, pathname]
    );

    return {
        handleMenuClick,
    };
}