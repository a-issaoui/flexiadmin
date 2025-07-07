// src/components/features/navbar/app-navbar.tsx
"use client";

import React, { createContext, useContext, useState } from 'react';
import NavTrigger from '@/components/navigation/vertical-navigation/nav-trigger';
import { Separator } from '@/components/ui/separator';
import NavbarSearch from '@/components/features/navbar/navbar-search';
import { NavbarUser } from '@/components/features/navbar/navbar-user';
import { ThemeSwitcher } from '@/components/common/theme-switcher';
import NavbarSms from '@/components/features/navbar/navbar-sms';
import NavbarNotification from '@/components/features/navbar/navbar-notification';
import LanguageSelector from '@/components/common/language-selector';
import { UserData } from '@/data/user-data';
import { useRTL } from '@/providers/rtl-provider';

// Define allowed dropdown types or null
type DropdownType = 'user' | null;

interface NavbarContextType {
    isSearchOpen: boolean;
    activeDropdown: DropdownType;
    setActiveDropdown: React.Dispatch<React.SetStateAction<DropdownType>>;
    setSearchOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

// Create context with a default value (or throw if used without provider)
const NavbarContext = createContext<NavbarContextType | undefined>(undefined);

export const useNavbar = (): NavbarContextType => {
    const context = useContext(NavbarContext);
    if (!context) {
        throw new Error('useNavbar must be used within a NavbarContext.Provider');
    }
    return context;
};

interface AppNavbarProps {
    isMobileSSR?: boolean;
}

export function AppNavbar({ isMobileSSR }: AppNavbarProps) {
    const [activeDropdown, setActiveDropdown] = useState<DropdownType>(null);
    const [isSearchOpen, setSearchOpen] = useState(false);

    // Automatically detect RTL - no props needed!
    const { isRTL, direction } = useRTL();

    return (
        <NavbarContext.Provider
            value={{
                isSearchOpen,
                activeDropdown,
                setActiveDropdown,
                setSearchOpen,
            }}
        >
            <nav
                className="flex h-14 shrink-0 items-center justify-between gap-2 transition-all duration-300 ease-in-out backdrop-blur-sm bg-background/95"
                role="navigation"
                aria-label="Main navigation"
                dir={direction} // Set direction for proper RTL behavior
            >
                <div className={`flex items-center gap-2 sm:gap-3`}>
                    {/* NavTrigger automatically detects RTL */}
                    <NavTrigger
                        isMobileSSR={isMobileSSR}
                        className={isRTL ? "translate-x-4" : "-translate-x-4"}
                    />
                    <Separator orientation="vertical" className="h-4 opacity-60 me-2" />
                </div>

                <div className={`flex items-center gap-1 sm:gap-1.5`}>
                    {/* Search - Hidden on mobile, shown in responsive order */}
                    <div className="flex items-center gap-1 order-2 sm:order-1">
                        <div className="hidden sm:flex">
                            <NavbarSearch />
                        </div>
                    </div>

                    {/* Component controls - Priority order for mobile */}
                    <div className="flex items-center gap-1 order-1 sm:order-2">
                        <LanguageSelector />
                        <ThemeSwitcher />
                        <NavbarSms />
                        <NavbarNotification />
                        <NavbarUser user={UserData} />
                    </div>
                </div>
            </nav>
        </NavbarContext.Provider>
    );
}