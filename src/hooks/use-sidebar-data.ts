import { useMemo } from 'react';
import type { TypeSidebarData } from '@/types/sidebar-data';

/**
 * A hook to process the raw sidebar data, ensuring every navigatable
 * and structural item has a stable, unique ID for use as a React key.
 * This prevents SSR hydration issues and performance problems.
 * @param data The raw sidebar data array.
 * @returns A memoized, fully processed version of the sidebar data.
 */
export function useSidebarData(data: TypeSidebarData): TypeSidebarData {
    return useMemo(() => {
        let counter = 0;
        const addStableIds = (items: any[], prefix: string): any[] => {
            return items.map(item => {
                const newItem = { ...item, id: item.id ?? `${prefix}-${counter++}` };
                if (newItem.menu) {
                    newItem.menu = addStableIds(newItem.menu, 'menu');
                }
                if (newItem.submenu) {
                    newItem.submenu = addStableIds(newItem.submenu, 'submenu');
                }
                if (newItem.actions) {
                    newItem.actions = addStableIds(newItem.actions, 'action');
                }
                return newItem;
            });
        };
        return addStableIds(data, 'group');
    }, [data]);
}