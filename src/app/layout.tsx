// src/app/layout.tsx
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/providers/theme-provider";
import ProgressBar from "@/components/common/progress-bar";
import { getLocaleDataSSR } from "@/lib/cookies/locale/locale-cookie.server";
import LocaleHydrator from "@/components/common/hydration/locale-hydrator";
import { LocaleProvider } from "@/providers/locale-provider";

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

export default async function RootLayout({ children }: RootLayoutProps) {
    // Get initial locale data from cookie for hydration
    const { locale, direction } = await getLocaleDataSSR();

    return (
        <html lang={locale} dir={direction} suppressHydrationWarning>
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-background text-foreground`}>
        <ProgressBar />
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
            storageKey="flexiadmin-theme"
        >
            {/* ✨ Replace NextIntlClientProvider with DynamicLocaleProvider */}
            <LocaleProvider>
                <LocaleHydrator initialLocale={locale} initialDirection={direction} />
                {children}
            </LocaleProvider>
        </ThemeProvider>
        </body>
        </html>
    );
}