"use client";
import React, { createContext, useContext, useState } from 'react';
import SidebarTrigger from '@/components/layout/admin/navbar/SidebarTrigger';
import { Separator } from '@/components/ui/separator';
import SearchInput from '@/components/layout/admin/navbar/SearchInput';
import { NavUser } from '@/components/layout/admin/navbar/nav-user';
import { ThemeToggle } from '@/components/shared/theme-toggle';
import AppSms from '@/components/layout/admin/navbar/app-sms';
import AppNotification from '@/components/layout/admin/navbar/app-notification';
import LocaleSwitcher from '@/components/shared/locale-switcher';
import { UserData } from '@/data/user-data';

interface AppNavbarProps {
    rtl: boolean;
    isMobileSSR?: boolean; // Added mobile SSR state
}

// Navbar Context for managing dropdown states
const NavbarContext = createContext({
    isSearchOpen: false,
    activeDropdown: null,
    setActiveDropdown: () => {},
    setSearchOpen: () => {},
});

export const useNavbar = () => useContext(NavbarContext);

export function AppNavbar({ rtl, isMobileSSR }: AppNavbarProps) {
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [isSearchOpen, setSearchOpen] = useState(false);

    return (
        <NavbarContext.Provider
            value={{
                isSearchOpen,
                activeDropdown,
                setActiveDropdown,
                setSearchOpen
            }}
        >
            <nav
                className='flex h-14 shrink-0 items-center justify-between gap-2 transition-all duration-300 ease-in-out  backdrop-blur-sm bg-background/95'
                role="navigation"
                aria-label="Main navigation"
            >
                <div className='flex items-center gap-2 sm:gap-3'>
                    <SidebarTrigger rtl={rtl} isMobileSSR={isMobileSSR} />
                    <Separator orientation='vertical' className='me-2 h-4 opacity-60'/>
                </div>

                <div className='flex items-center gap-1 sm:gap-1.5'>
                    {/* Search - Hidden on mobile, shown in responsive order */}
                    <div className='flex items-center gap-1 order-2 sm:order-1'>
                        <div className='hidden sm:flex'>
                            <SearchInput/>
                        </div>
                    </div>

                    {/* Component controls - Priority order for mobile */}
                    <div className='flex items-center gap-1 order-1 sm:order-2'>
                        <LocaleSwitcher />
                        <ThemeToggle/>
                        <AppSms/>
                        <AppNotification/>
                        <NavUser user={UserData}/>
                    </div>
                </div>
            </nav>
        </NavbarContext.Provider>
    );
}