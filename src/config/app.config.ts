// config/app.config.ts
import { sidebarConfig } from './sidebar.config';

export const appConfig = {
    name: 'FlexiAdmin',
    description: 'Modern admin dashboard',
    version: '2.1.0',

    // URLs
    urls: {
        base: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3180',
        api: process.env.NEXT_PUBLIC_API_URL || '/api',
    },

    // Cookie names
    cookies: {
        sidebar: 'flexiadmin-sidebar',
        theme: 'flexiadmin-theme',
        language: 'flexiadmin-language',
        session: 'flexiadmin-session',
        mobile: 'flexiadmin-mobile',
    },

    // UI Configuration
    ui: {
        sidebar: {
            defaultOpen: sidebarConfig.defaultOpen,
            defaultOpenMobile: sidebarConfig.defaultOpenMobile,
            defaultSide: sidebarConfig.defaultSide,
            defaultVariant: sidebarConfig.defaultVariant,
            defaultCollapsible: sidebarConfig.defaultCollapsible,
            enablePersistence: sidebarConfig.enablePersistence,
        },
        theme: {
            defaultTheme: 'system' as const,
        },
    },

    // Development
    development: {
        enableDebugMode: process.env.NODE_ENV === 'development',
    },
} as const;

// Type exports for better TypeScript support
export type AppConfig = typeof appConfig;
export type CookieNames = typeof appConfig.cookies;
export type UIConfig = typeof appConfig.ui;