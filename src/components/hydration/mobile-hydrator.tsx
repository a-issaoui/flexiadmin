'use client';

import { useEffect, useRef } from 'react';
import { useSetIsMobile, useSetBreakpoint, useSetUserAgent, useSetHydrated } from '@/stores/mobile.store';
import { setMobileDataClient, getMobileDataClient } from '@/lib/cookies/mobile';

// Debug logging for mobile hydrator (development only)
const DEBUG_MOBILE_HYDRATOR = process.env.NODE_ENV === 'development';
const log = (message: string, data?: unknown) => {
  if (DEBUG_MOBILE_HYDRATOR) {
    console.log(`📱💧 [MobileHydrator] ${message}`, data);
  }
};

interface MobileHydratorProps {
  initialData?: {
    isMobile: boolean;
    breakpoint: number;
    userAgent?: string;
  };
  userAgent?: string;
}

export function MobileHydrator({ initialData, userAgent }: MobileHydratorProps) {
  const setIsMobile = useSetIsMobile();
  const setBreakpoint = useSetBreakpoint();
  const setUserAgent = useSetUserAgent();
  const setHydrated = useSetHydrated();
  
  // Use ref to ensure the effect only runs once per component instance
  const hasHydrated = useRef(false);
  
  useEffect(() => {
    // Prevent duplicate hydration in strict mode
    if (hasHydrated.current) {
      log('⏭️ Skipping duplicate hydration');
      return;
    }
    hasHydrated.current = true;
    
    log('💧 MobileHydrator useEffect triggered', { initialData, userAgent });
    
    // Check if cookie exists
    const existingCookie = getMobileDataClient();
    log('🔍 Existing cookie data', existingCookie);
    
    // If initial data is provided, use it and ensure cookie is saved
    if (initialData) {
      log('📦 Using initial SSR data', initialData);
      setIsMobile(initialData.isMobile);
      setBreakpoint(initialData.breakpoint);
      if (initialData.userAgent) {
        setUserAgent(initialData.userAgent);
      }
      
      // Only save cookie if data differs from existing
      if (!existingCookie || 
          existingCookie.isMobile !== initialData.isMobile ||
          existingCookie.breakpoint !== initialData.breakpoint ||
          existingCookie.userAgent !== initialData.userAgent) {
        log('💾 Saving cookie with initial data');
        setMobileDataClient({
          isMobile: initialData.isMobile,
          breakpoint: initialData.breakpoint,
          userAgent: initialData.userAgent,
        });
      }
    } else {
      log('🔄 No initial data, using fallback');
      // Otherwise, try to get from cookie with user agent fallback
      // We'll use client-side mobile detection if no initial data
      const mobileData = {
        isMobile: false,
        breakpoint: 768,
        userAgent,
      };
      log('📋 Using fallback mobile data', mobileData);
      setIsMobile(mobileData.isMobile);
      setBreakpoint(mobileData.breakpoint);
      if (mobileData.userAgent) {
        setUserAgent(mobileData.userAgent);
      }
      
      // Save cookie if no existing data
      if (!existingCookie) {
        log('💾 Saving cookie with fallback data');
        setMobileDataClient(mobileData);
      }
    }
    
    log('✅ Setting hydrated to true');
    setHydrated(true);
  
  // We intentionally use an empty dependency array to run only once
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  return null;
}