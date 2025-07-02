// config/app.config.ts
export const appConfig = {
    name: 'FlexiAdmin',
    description: 'Modern admin dashboard with internationalization support',
    version: '1.0.0',

    // URLs
    urls: {
        base: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3180',
        api: process.env.NEXT_PUBLIC_API_URL || '/api',
    },

    // Features
    features: {
        auth: {
            sessionTimeout: 30 * 60 * 1000, // 30 minutes
            rememberMeDuration: 30 * 24 * 60 * 60 * 1000, // 30 days
        },
        notifications: {
            pollingInterval: 30 * 1000, // 30 seconds
            maxItems: 50,
        },
    },

    // UI Configuration
    ui: {
        sidebar: {
            defaultOpen: true,
            mobileBreakpoint: 768,
            width: {
                expanded: '16rem',
                collapsed: '3rem',
                mobile: '18rem',
            },
        },
        theme: {
            defaultTheme: 'system' as const,
            storageKey: 'flexiadmin-theme',
        },
    },
} as const;