// Mobile Cookie Client Utilities
import { appConfig } from '@/config/app.config';
import { MOBILE_CONSTANTS, type MobileData } from './mobile-cookie.types';

const COOKIE_NAME = appConfig.cookies.mobile;

// Debug logging for mobile cookies (development only)
const DEBUG_MOBILE_COOKIES = process.env.NODE_ENV === 'development';
const log = (message: string, data?: unknown) => {
  if (DEBUG_MOBILE_COOKIES) {
    console.log(`📱🍪 [MobileCookies] ${message}`, data);
  }
};

// Default mobile data
const DEFAULT_MOBILE_DATA: MobileData = {
  isMobile: false,
  breakpoint: MOBILE_CONSTANTS.MOBILE_BREAKPOINT,
};

// Client-side cookie utilities
export const getMobileDataClient = (): MobileData => {
  log('🔍 getMobileDataClient called');
  if (typeof window === 'undefined') {
    log('⚠️ Window undefined, returning default data');
    return DEFAULT_MOBILE_DATA;
  }
  
  try {
    const cookies = document.cookie.split(';').reduce((acc, cookie) => {
      const [key, value] = cookie.trim().split('=');
      if (key && value) {
        acc[key] = value;
      }
      return acc;
    }, {} as Record<string, string>);
    
    log('📋 All cookies', cookies);
    const cookieValue = cookies[COOKIE_NAME];
    log(`🔍 Mobile cookie value for ${COOKIE_NAME}:`, cookieValue);
    
    if (!cookieValue) {
      log('⚠️ No mobile cookie found, returning default data');
      return DEFAULT_MOBILE_DATA;
    }
    
    const data = JSON.parse(decodeURIComponent(cookieValue));
    const result = {
      ...DEFAULT_MOBILE_DATA,
      ...data,
    };
    log('✅ Parsed mobile cookie data', result);
    return result;
  } catch (error) {
    log('❌ Failed to parse mobile cookie', error);
    console.warn('Failed to parse mobile cookie:', error);
    return DEFAULT_MOBILE_DATA;
  }
};

export const setMobileDataClient = (data: Partial<MobileData>): void => {
  log('💾 setMobileDataClient called', data);
  if (typeof window === 'undefined') {
    log('⚠️ Window undefined, skipping cookie set');
    return;
  }
  
  try {
    const currentData = getMobileDataClient();
    const newData = { ...currentData, ...data };
    log('📝 Setting new mobile data', { currentData, newData });
    
    const cookieValue = encodeURIComponent(JSON.stringify(newData));
    const maxAge = MOBILE_CONSTANTS.MOBILE_COOKIE_MAX_AGE;
    
    const cookieString = `${COOKIE_NAME}=${cookieValue}; path=/; max-age=${maxAge}; SameSite=Strict`;
    log('🍪 Setting cookie', cookieString);
    document.cookie = cookieString;
  } catch (error) {
    log('❌ Failed to set mobile cookie', error);
    console.warn('Failed to set mobile cookie:', error);
  }
};

export const clearMobileDataClient = (): void => {
  if (typeof window === 'undefined') return;
  
  document.cookie = `${COOKIE_NAME}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
};