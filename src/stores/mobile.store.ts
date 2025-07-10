// FlexiAdmin Mobile Store
// SSR-friendly mobile state management with cookie persistence

import { useEffect, useMemo } from 'react';
import { create } from 'zustand';
import { 
  MOBILE_CONSTANTS,
  setMobileDataClient, 
  type MobileData 
} from '@/lib/cookies/mobile';

// Debug logging for mobile store (development only)
const DEBUG_MOBILE = process.env.NODE_ENV === 'development';
const log = (message: string, data?: unknown) => {
  if (DEBUG_MOBILE) {
    console.log(`📱 [MobileStore] ${message}`, data);
  }
};

// Global media query listener management
let globalMediaQuery: MediaQueryList | null = null;
let globalListenerCount = 0;
let currentGlobalBreakpoint = 0;

export interface MobileState {
  isMobile: boolean;
  breakpoint: number;
  isHydrated: boolean;
  userAgent?: string;
}

export interface MobileActions {
  setIsMobile: (isMobile: boolean) => void;
  setBreakpoint: (breakpoint: number) => void;
  setUserAgent: (userAgent: string) => void;
  setHydrated: (hydrated: boolean) => void;
  reset: () => void;
}

type MobileStore = MobileState & MobileActions;

// Initial state
const initialState: MobileState = {
  isMobile: false,
  breakpoint: MOBILE_CONSTANTS.MOBILE_BREAKPOINT,
  isHydrated: false,
};

// Create the store with SSR-friendly cookie persistence
export const useMobile = create<MobileStore>()((set, get) => {
  // Helper function to save to cookie
  const saveToCookie = (state: MobileState) => {
    if (typeof window !== 'undefined') {
      const mobileData: MobileData = {
        isMobile: state.isMobile,
        breakpoint: state.breakpoint,
        userAgent: state.userAgent,
      };
      log('💾 Saving to cookie', mobileData);
      setMobileDataClient(mobileData);
    }
  };

  return {
    ...initialState,
    
    setIsMobile: (isMobile: boolean) => {
      const currentState = get();
      if (currentState.isMobile === isMobile) {
        // Only log if DEBUG_MOBILE is enabled and value is changing
        if (DEBUG_MOBILE) {
          log('⏭️ setIsMobile skipped - same value');
        }
        return;
      }
      
      const newState = { ...currentState, isMobile };
      if (DEBUG_MOBILE) {
        log(`🔄 setIsMobile updating: ${currentState.isMobile} → ${isMobile}`);
      }
      set(newState);
      saveToCookie(newState);
    },
    
    setBreakpoint: (breakpoint: number) => {
      const currentState = get();
      if (currentState.breakpoint === breakpoint) {
        // Only log if DEBUG_MOBILE is enabled and value is changing
        if (DEBUG_MOBILE) {
          log('⏭️ setBreakpoint skipped - same value');
        }
        return;
      }
      
      const newState = { ...currentState, breakpoint };
      if (DEBUG_MOBILE) {
        log(`🔄 setBreakpoint updating: ${currentState.breakpoint} → ${breakpoint}`);
      }
      set(newState);
      saveToCookie(newState);
    },
    
    setUserAgent: (userAgent: string) => {
      const currentState = get();
      if (currentState.userAgent === userAgent) return;
      
      const newState = { ...currentState, userAgent };
      set(newState);
      saveToCookie(newState);
    },
    
    setHydrated: (hydrated: boolean) => {
      if (DEBUG_MOBILE) {
        log(`🔄 setHydrated: ${hydrated}`);
      }
      set({ isHydrated: hydrated });
    },
    
    reset: () => {
      set(initialState);
      saveToCookie(initialState);
    },
  };
});


// Individual selectors to avoid object creation
export const useIsMobileValue = () => useMobile((state) => state.isMobile);
export const useBreakpointValue = () => useMobile((state) => state.breakpoint);
export const useIsHydratedValue = () => useMobile((state) => state.isHydrated);

// Actions selectors - cached to avoid recreation
export const useSetIsMobile = () => useMobile((state) => state.setIsMobile);
export const useSetBreakpoint = () => useMobile((state) => state.setBreakpoint);
export const useSetUserAgent = () => useMobile((state) => state.setUserAgent);
export const useSetHydrated = () => useMobile((state) => state.setHydrated);

// Compatibility selectors - but these create objects so avoid them
export const useMobileState = () => {
  log('🔍 useMobileState called - AVOID THIS');
  return {
    isMobile: useIsMobileValue(),
    breakpoint: useBreakpointValue(),
    isHydrated: useIsHydratedValue(),
  };
};

export const useMobileActions = () => {
  log('🔍 useMobileActions called - AVOID THIS');
  return {
    setIsMobile: useSetIsMobile(),
    setBreakpoint: useSetBreakpoint(),
    setUserAgent: useSetUserAgent(),
    setHydrated: useSetHydrated(),
    reset: useMobile((state) => state.reset),
  };
};

// Global media query handler
const handleGlobalMediaQueryChange = (e: MediaQueryListEvent) => {
  if (DEBUG_MOBILE) {
    log(`📱 Global media query changed: ${e.matches}`);
  }
  // Update the store directly
  useMobile.getState().setIsMobile(e.matches);
};

// Hook that handles custom breakpoint and returns just the mobile state
export const useIsMobile = (customBreakpoint?: number) => {
  const isMobile = useIsMobileValue();
  const breakpoint = useBreakpointValue();
  const isHydrated = useIsHydratedValue();
  const setBreakpoint = useSetBreakpoint();
  const setIsMobileValue = useSetIsMobile();
  
  // Memoize the effective breakpoint to avoid recalculation
  const effectiveBreakpoint = useMemo(() => {
    return customBreakpoint || breakpoint;
  }, [customBreakpoint, breakpoint]);
  
  // Handle custom breakpoint changes
  useEffect(() => {
    if (customBreakpoint && customBreakpoint !== breakpoint) {
      setBreakpoint(customBreakpoint);
    }
  }, [customBreakpoint, breakpoint, setBreakpoint]);
  
  // Set up global media query listener (singleton pattern)
  useEffect(() => {
    if (!isHydrated || typeof window === 'undefined') return;
    
    globalListenerCount++;
    
    // Only create a new listener if we don't have one or the breakpoint changed
    if (!globalMediaQuery || currentGlobalBreakpoint !== effectiveBreakpoint) {
      // Clean up existing listener
      if (globalMediaQuery) {
        globalMediaQuery.removeEventListener('change', handleGlobalMediaQueryChange);
      }
      
      // Create new listener
      globalMediaQuery = window.matchMedia(`(max-width: ${effectiveBreakpoint - 1}px)`);
      currentGlobalBreakpoint = effectiveBreakpoint;
      
      if (DEBUG_MOBILE) {
        log(`📱 Setting up global media query listener for breakpoint: ${effectiveBreakpoint}px`);
      }
      
      // Set initial value from media query only if different
      const initialIsMobile = globalMediaQuery.matches;
      if (initialIsMobile !== isMobile) {
        if (DEBUG_MOBILE) {
          log(`📱 Updating isMobile from ${isMobile} to ${initialIsMobile}`);
        }
        setIsMobileValue(initialIsMobile);
      }
      
      // Listen for changes
      globalMediaQuery.addEventListener('change', handleGlobalMediaQueryChange);
    }
    
    return () => {
      globalListenerCount--;
      
      // Clean up listener when no more components are using it
      if (globalListenerCount <= 0 && globalMediaQuery) {
        if (DEBUG_MOBILE) {
          log(`📱 Cleaning up global media query listener`);
        }
        globalMediaQuery.removeEventListener('change', handleGlobalMediaQueryChange);
        globalMediaQuery = null;
        currentGlobalBreakpoint = 0;
        globalListenerCount = 0;
      }
    };
  }, [isHydrated, effectiveBreakpoint, isMobile, setIsMobileValue]);
  
  return isMobile;
};

// Separate hook for hydration status
export const useIsMobileHydrated = () => useIsHydratedValue();

// Export types
export type { MobileStore };