// src/components/features/navbar/app-navbar.tsx
"use client";

import React, { createContext, useContext, useState } from 'react';
import { Separator } from '@/components/ui/separator';
import NavbarSearch from '@/components/features/navbar/navbar-search';
import { NavbarUser } from '@/components/features/navbar/navbar-user';
import { ThemeSwitcher } from '@/components/common/theme-switcher';
import NavbarSms from '@/components/features/navbar/navbar-sms';
import NavbarNotification from '@/components/features/navbar/navbar-notification';
import LanguageSelector from '@/components/common/language-selector';
import NavTrigger from "@/components/navigation/vertical-navigation/nav-trigger";
import { UserData } from '@/data/user-data';
import { useRTL } from '@/providers/rtl-provider';

// Define allowed dropdown types or null
type DropdownType = 'user' | 'notifications' | null;

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
    // No props needed - mobile state is now global
    className?: string;
}

export function AppNavbar({}: AppNavbarProps = {}) {
    const [activeDropdown, setActiveDropdown] = useState<DropdownType>(null);
    const [isSearchOpen, setSearchOpen] = useState(false);

    // Automatically detect RTL - no props needed!
    const { direction } = useRTL();

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
                className="relative flex h-14 items-center justify-between px-2 backdrop-blur-sm bg-background/95"
                role="navigation"
                aria-label="Main navigation"
                dir={direction}
            >
                {/* Start: NavTrigger */}
                <div className="flex items-center z-10">
                    <NavTrigger/>
                    <Separator orientation="vertical" className="h-4 opacity-60 me-2"/>
                </div>


                {/* End: Controls */}
                <div className="flex items-center gap-1 sm:gap-1.5 z-10">
                    <div className="pointer-events-auto hidden sm:flex">
                        <NavbarSearch/>
                    </div>
                    <LanguageSelector/>
                    <ThemeSwitcher/>
                    <NavbarSms/>
                    <NavbarNotification/>
                    <NavbarUser user={UserData}/>
                </div>
            </nav>

        </NavbarContext.Provider>
    );
}