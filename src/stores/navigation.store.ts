// src/stores/navigation.store.ts
'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { appConfig } from '@/config/app.config';
import type { NavigationItem } from '@/config/navigation/types';

interface NavigationState {
  // Track which menu items are expanded
  expandedItems: Record<string, boolean>;
  
  // Actions
  setItemExpanded: (itemId: string, expanded: boolean) => void;
  toggleItem: (itemId: string) => void;
  expandParentsOfPath: (currentPath: string, navigationItems: NavigationItem[]) => void;
  reset: () => void;
}

// Helper function to check if a path or its children are active
const isPathActiveInItems = (targetPath: string, items: NavigationItem[]): boolean => {
  for (const item of items) {
    if (item.href === targetPath) return true;
    if (item.children && isPathActiveInItems(targetPath, item.children)) return true;
  }
  return false;
};

// Helper function to find and expand parent items if their children are active
const findParentItemsToExpand = (currentPath: string, items: NavigationItem[], expandedItems: Record<string, boolean> = {}): Record<string, boolean> => {
  for (const item of items) {
    if (item.children && item.children.length > 0) {
      // Check if any child or descendant is active
      if (isPathActiveInItems(currentPath, item.children)) {
        expandedItems[item.id] = true;
        // Recursively check nested children
        findParentItemsToExpand(currentPath, item.children, expandedItems);
      }
    }
  }
  return expandedItems;
};

export const useNavigationStore = create<NavigationState>()(
  persist(
    (set) => ({
      expandedItems: {},
      
      setItemExpanded: (itemId: string, expanded: boolean) => {
        set((state) => ({
          expandedItems: {
            ...state.expandedItems,
            [itemId]: expanded,
          },
        }));
      },
      
      toggleItem: (itemId: string) => {
        set((state) => ({
          expandedItems: {
            ...state.expandedItems,
            [itemId]: !state.expandedItems[itemId],
          },
        }));
      },
      
      expandParentsOfPath: (currentPath: string, navigationItems: NavigationItem[]) => {
        const expandedItems = findParentItemsToExpand(currentPath, navigationItems);
        set((state) => ({
          expandedItems: {
            ...state.expandedItems,
            ...expandedItems,
          },
        }));
      },
      
      reset: () => {
        set({ expandedItems: {} });
      },
    }),
    {
      name: `${appConfig.cookies.sidebar}-navigation`,
      partialize: (state) => ({
        expandedItems: state.expandedItems,
      }),
    }
  )
);