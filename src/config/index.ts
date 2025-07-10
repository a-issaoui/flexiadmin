// Centralized Configuration Index
// Single point of access for all FlexiAdmin configurations

// Main app configuration
export { appConfig } from './app.config';
export type { AppConfig, CookieNames, UIConfig } from './app.config';

// Sidebar configuration
export { sidebarConfig } from './sidebar.config';
export type { 
  SidebarConfig, 
  SidebarSide, 
  SidebarVariant, 
  SidebarCollapsible 
} from './sidebar.config';
export {
  SIDEBAR_WIDTH,
  SIDEBAR_WIDTH_MOBILE,
  SIDEBAR_WIDTH_ICON,
  SIDEBAR_MOBILE_BREAKPOINT,
  SIDEBAR_ANIMATION_DURATION,
  getSidebarWidth,
  getSidebarClasses,
} from './sidebar.config';

// Locales configuration
export * from './locales.config';

// Mobile configuration
export { MOBILE_CONSTANTS } from '../lib/cookies/mobile';
export type { MobileData, MobileConstants } from '../lib/cookies/mobile';

// Import configs for utility functions
import { appConfig } from './app.config';
import { sidebarConfig } from './sidebar.config';
import { MOBILE_CONSTANTS } from '../lib/cookies/mobile';

// Configuration utilities
export const getCookieName = (key: keyof typeof appConfig.cookies) => {
  return appConfig.cookies[key];
};

// Environment checks
export const isDevelopment = appConfig.development.enableDebugMode;
export const isProduction = !isDevelopment;

// Quick access to common configurations
export const cookieNames = appConfig.cookies;
export const uiConfig = appConfig.ui;

// Breakpoints (centralized)
export const breakpoints = {
  mobile: MOBILE_CONSTANTS.MOBILE_BREAKPOINT,
  sidebar: sidebarConfig.mobileBreakpoint,
} as const;

// Default export for convenience
const config = {
  app: appConfig,
  sidebar: sidebarConfig,
  mobile: MOBILE_CONSTANTS,
  cookies: cookieNames,
  ui: uiConfig,
  breakpoints,
  utils: {
    getCookieName,
  },
  env: {
    isDevelopment,
    isProduction,
  },
};

export default config;