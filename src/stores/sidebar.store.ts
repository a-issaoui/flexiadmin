// FlexiAdmin Sidebar Store
// SSR-friendly sidebar state management with cookie persistence

import { useState, useEffect } from 'react';
import { create } from 'zustand';
import { appConfig } from '@/config/app.config';
import { 
  sidebarConfig, 
  getSidebarClasses as getConfigClasses,
  getSidebarWidth as getConfigWidth,
  type SidebarSide,
  type SidebarVariant, 
  type SidebarCollapsible 
} from '@/config/sidebar.config';
import { 
  getSidebarDataClient, 
  setSidebarDataClient, 
  type SidebarData 
} from '@/lib/cookies/sidebar';

// Re-export types and constants for backward compatibility
export type { SidebarSide, SidebarVariant, SidebarCollapsible };
export const SIDEBAR_WIDTH = sidebarConfig.width;
export const SIDEBAR_WIDTH_MOBILE = sidebarConfig.widthMobile;
export const SIDEBAR_WIDTH_ICON = sidebarConfig.widthIcon;

export interface SidebarState {
  // Core states
  open: boolean;
  openMobile: boolean;
  
  // Layout properties
  side: SidebarSide;
  variant: SidebarVariant;
  collapsible: SidebarCollapsible;
}

export interface SidebarActions {
  // Basic actions
  setOpen: (open: boolean) => void;
  setOpenMobile: (open: boolean) => void;
  toggleSidebar: () => void;
  
  // Layout actions
  setSide: (side: SidebarSide) => void;
  setVariant: (variant: SidebarVariant) => void;
  setCollapsible: (collapsible: SidebarCollapsible) => void;
  
  // Utility
  reset: () => void;
}

type SidebarStore = SidebarState & SidebarActions;

// Initial state from configuration
const initialState: SidebarState = {
  open: appConfig.ui.sidebar.defaultOpen,
  openMobile: appConfig.ui.sidebar.defaultOpenMobile,
  side: appConfig.ui.sidebar.defaultSide,
  variant: appConfig.ui.sidebar.defaultVariant,
  collapsible: appConfig.ui.sidebar.defaultCollapsible,
};

// Create the store with SSR-friendly cookie persistence
export const useSidebar = create<SidebarStore>()((set, get) => {
  // Helper function to save to cookie
  const saveToCookie = (state: SidebarState) => {
    if (appConfig.ui.sidebar.enablePersistence && typeof window !== 'undefined') {
      const sidebarData: SidebarData = {
        open: state.open,
        openMobile: state.openMobile,
        side: state.side,
        variant: state.variant,
        collapsible: state.collapsible,
      };
      setSidebarDataClient(sidebarData);
    }
  };

  return {
    ...initialState,
    
    // Basic actions
    setOpen: (open: boolean) => {
      const currentState = get();
      if (currentState.open === open) return;
      
      const newState = { ...currentState, open };
      set(newState);
      saveToCookie(newState);
    },
    setOpenMobile: (open: boolean) => {
      const currentState = get();
      if (currentState.openMobile === open) return;
      
      const newState = { ...currentState, openMobile: open };
      set(newState);
      saveToCookie(newState);
    },
    toggleSidebar: () => {
      const state = get();
      // We'll handle mobile detection elsewhere
      const newState = { ...state, open: !state.open };
      set(newState);
      saveToCookie(newState);
    },
    
    // Layout actions
    setSide: (side: SidebarSide) => {
      const currentState = get();
      if (currentState.side === side) return;
      
      const newState = { ...currentState, side };
      set(newState);
      saveToCookie(newState);
    },
    setVariant: (variant: SidebarVariant) => {
      const currentState = get();
      if (currentState.variant === variant) return;
      
      const newState = { ...currentState, variant };
      set(newState);
      saveToCookie(newState);
    },
    setCollapsible: (collapsible: SidebarCollapsible) => {
      const currentState = get();
      if (currentState.collapsible === collapsible) return;
      
      const newState = { ...currentState, collapsible };
      set(newState);
      saveToCookie(newState);
    },
    
    
    // Utility
    reset: () => {
      set(initialState);
      saveToCookie(initialState);
    },
  };
});

// Hook for SSR-friendly hydration
export const useHydratedSidebar = () => {
  const store = useSidebar();
  const [hydrated, setHydrated] = useState(false);
  
  useEffect(() => {
    // Load from cookie on client hydration
    if (appConfig.ui.sidebar.enablePersistence) {
      const savedData = getSidebarDataClient();
      store.setOpen(savedData.open);
      store.setOpenMobile(savedData.openMobile);
      store.setSide(savedData.side);
      store.setVariant(savedData.variant);
      store.setCollapsible(savedData.collapsible);
    }
    setHydrated(true);
  }, [store]);
  
  return hydrated ? store : { ...initialState, ...store };
};

// Utility functions using configuration
export const getSidebarWidth = (isMobile: boolean, isCollapsed: boolean = false) => {
  return getConfigWidth(isMobile, isCollapsed);
};

export const getSidebarClasses = (state: SidebarState & { isMobile?: boolean }) => {
  return getConfigClasses({
    open: state.open,
    openMobile: state.openMobile,
    side: state.side,
    variant: state.variant,
    collapsible: state.collapsible,
    isMobile: state.isMobile || false,
  });
};

// Export constants for use in components
// SIDEBAR_WIDTH constants already exported above

// Legacy exports for backward compatibility (if needed)
export const useFlexiAdminSidebar = useSidebar;
export const useSidebarCore = () => useSidebar((state) => ({
  open: state.open,
  openMobile: state.openMobile,
  side: state.side,
  variant: state.variant,
  collapsible: state.collapsible,
  setOpen: state.setOpen,
  setOpenMobile: state.setOpenMobile,
  toggleSidebar: state.toggleSidebar,
  setSide: state.setSide,
  setVariant: state.setVariant,
  setCollapsible: state.setCollapsible,
}));

// Selector for just the layout properties
export const useSidebarLayout = () => useSidebar((state) => ({
  side: state.side,
  variant: state.variant,
  collapsible: state.collapsible,
  setSide: state.setSide,
  setVariant: state.setVariant,
  setCollapsible: state.setCollapsible,
}));

// Empty navigation hook for backward compatibility
export const useSidebarNavigation = () => ({
  activeItem: null,
  groups: [],
  openGroups: [],
  expandedItems: [],
  setActiveItem: () => {},
  toggleGroup: () => {},
  expandItem: () => {},
  collapseItem: () => {},
});

// Empty search hook for backward compatibility  
export const useSidebarSearch = () => ({
  searchQuery: '',
  showSearch: false,
  setSearchQuery: () => {},
  clearSearch: () => {},
  toggleSearch: () => {},
});

// Type exports
export type { SidebarStore };