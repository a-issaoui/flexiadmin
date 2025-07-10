// src/components/hydration/sidebar-hydrator.tsx
'use client';

import { useEffect } from 'react';
import { useSidebar } from '@/stores/sidebar.store';
import { getSidebarDataClient } from '@/lib/cookies/sidebar';
import { appConfig } from '@/config/app.config';

interface SidebarHydratorProps {
  initialData?: {
    open: boolean;
    openMobile: boolean;
    side: 'left' | 'right';
    variant: 'sidebar' | 'floating' | 'inset';
    collapsible: 'offcanvas' | 'icon' | 'none';
  };
}

export function SidebarHydrator({ initialData }: SidebarHydratorProps) {
  const {
    setOpen,
    setOpenMobile,
    setSide,
    setVariant,
    setCollapsible,
  } = useSidebar();

  useEffect(() => {
    if (!appConfig.ui.sidebar.enablePersistence) return;

    // Use client-side data first, fallback to server-side initial data
    const clientData = getSidebarDataClient();
    const dataToUse = initialData || clientData;

    // Hydrate the store with the correct data - only run once
    setOpen(dataToUse.open);
    setOpenMobile(dataToUse.openMobile);
    setSide(dataToUse.side);
    setVariant(dataToUse.variant);
    setCollapsible(dataToUse.collapsible);
  }, [initialData, setOpen, setOpenMobile, setSide, setVariant, setCollapsible]); // Include dependencies

  return null;
}