// src/app/layout.tsx
import type {Metadata, Viewport} from "next";
import {NextIntlClientProvider} from 'next-intl';
import {getMessages} from 'next-intl/server';
import {ThemeProvider} from "@/providers/theme-provider";
import ProgressBar from "@/components/common/progress-bar";
import {getLocaleDataSSR} from "@/lib/cookies/locale/locale-cookie.server";
import {getMobileDataSSR} from "@/lib/cookies/mobile/mobile-cookie.server";
import LocaleHydrator from "@/components/hydration/locale-hydrator";
import {MobileHydrator} from "@/components/hydration/mobile-hydrator";
import {RTLProvider} from "@/providers/rtl-provider";
import {LocaleProvider} from "@/providers/locale-provider";
import {ErrorBoundary, AsyncErrorBoundary} from "@/components/common/error-boundary";

import "./globals.css";

interface RootLayoutProps {
    children: React.ReactNode;
}

export const metadata: Metadata = {
    title: "FlexiAdmin",
    description: "Modern admin dashboard with internationalization support",
};

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
};

// Force dynamic rendering for admin dashboard
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function RootLayout({children}: RootLayoutProps) {
    // Get initial locale data from cookie
    const {locale, direction} = await getLocaleDataSSR();

    // Get initial mobile data from cookie
    const mobileData = await getMobileDataSSR();

    // Get SSR messages for the current locale
    const messages = await getMessages();

    if (process.env.NODE_ENV === 'development') {
        console.log(`🚀 SSR Layout - Locale: ${locale}, Direction: ${direction}, Messages: ${Object.keys(messages).length} keys`);
    }

    return (
        <html lang={locale} dir={direction} suppressHydrationWarning>
        <body
            className="antialiased min-h-screen bg-background text-foreground font-sans">
        <ProgressBar/>
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
            storageKey="flexiadmin-theme"
        >
            {/* Provide SSR messages immediately */}
            <NextIntlClientProvider
                locale={locale}
                messages={messages}
                timeZone="UTC"
                now={new Date()}
            >
                <RTLProvider
                    direction={direction}
                    locale={locale}
                >
                    <LocaleHydrator initialLocale={locale} initialDirection={direction}/>
                    <MobileHydrator initialData={mobileData} />

                    {/* Enhanced provider that won't show skeleton for SSR content */}
                    <LocaleProvider>
                        <ErrorBoundary>
                            <AsyncErrorBoundary>
                                <div
                                    className="rtl-hydrating"
                                    data-testid="app-content"
                                >
                                    {children}
                                </div>
                            </AsyncErrorBoundary>
                        </ErrorBoundary>
                    </LocaleProvider>
                </RTLProvider>
            </NextIntlClientProvider>
        </ThemeProvider>
        <script
            dangerouslySetInnerHTML={{
                __html: `
                            // Show content after hydration starts
                            document.addEventListener('DOMContentLoaded', function() {
                                const content = document.querySelector('[data-testid="app-content"]');
                                if (content) {
                                    content.classList.remove('rtl-hydrating');
                                    content.classList.add('rtl-hydrated');
                                }
                            });
                        `
            }}
        />
        </body>
        </html>
    );
}