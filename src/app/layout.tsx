// src/app/layout.tsx
import type {Metadata, Viewport} from "next";
import {Geist, Geist_Mono} from "next/font/google";
import {NextIntlClientProvider} from 'next-intl';
import {getMessages} from 'next-intl/server';
import {ThemeProvider} from "@/providers/theme-provider";
import ProgressBar from "@/components/common/progress-bar";
import {getLocaleDataSSR} from "@/lib/cookies/locale/locale-cookie.server";
import LocaleHydrator from "@/components/hydration/locale-hydrator";
import {RTLProvider} from "@/providers/rtl-provider";
import {LocaleProvider} from "@/providers/locale-provider";
import {ErrorBoundary, AsyncErrorBoundary} from "@/components/common/error-boundary";

import "./globals.css";

interface RootLayoutProps {
    children: React.ReactNode;
}

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
    display: 'swap',
    preload: true,
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
    display: 'swap',
});

export const metadata: Metadata = {
    title: "FlexiAdmin",
    description: "Modern admin dashboard with internationalization support",
};

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
};

export default async function RootLayout({children}: RootLayoutProps) {
    // Get initial locale data from cookie
    const {locale, direction} = await getLocaleDataSSR();

    // Get SSR messages for the current locale
    const messages = await getMessages();

    console.log(`🚀 SSR Layout - Locale: ${locale}, Direction: ${direction}, Messages: ${Object.keys(messages).length} keys`);

    return (
        <html lang={locale} dir={direction} suppressHydrationWarning>
        <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-background text-foreground`}>
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