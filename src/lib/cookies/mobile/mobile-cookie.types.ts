// Mobile Cookie Types
export interface MobileData {
  isMobile: boolean;
  breakpoint: number;
  userAgent?: string;
}

export interface MobileConstants {
  MOBILE_BREAKPOINT: number;
  MOBILE_MEDIA_QUERY: string;
  MOBILE_COOKIE_MAX_AGE: number;
}

export const MOBILE_CONSTANTS: MobileConstants = {
  MOBILE_BREAKPOINT: 768,
  MOBILE_MEDIA_QUERY: '(max-width: 767px)',
  MOBILE_COOKIE_MAX_AGE: 60 * 60 * 24 * 7, // 7 days
};