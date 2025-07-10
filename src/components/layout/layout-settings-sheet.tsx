// src/components/layout/layout-settings-sheet.tsx
'use client';

import { useState } from 'react';
import { GearIcon } from '@phosphor-icons/react/dist/ssr';
import { Button } from '@/components/ui/button';
import { 
  Sheet, 
  SheetContent, 
  SheetDescription, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from '@/components/ui/sheet';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { useSidebar } from '@/stores/sidebar.store';
import { useNavigationStore } from '@/stores/navigation.store';
import { 
  type SidebarSide, 
  type SidebarVariant, 
  type SidebarCollapsible 
} from '@/config/sidebar.config';

export function LayoutSettingsSheet() {
  const [open, setOpen] = useState(false);
  const {
    open: sidebarOpen,
    openMobile: sidebarOpenMobile,
    side,
    variant,
    collapsible,
    setOpen: setSidebarOpen,
    setOpenMobile: setSidebarOpenMobile,
    setSide,
    setVariant,
    setCollapsible,
    reset,
  } = useSidebar();
  
  const { reset: resetNavigation } = useNavigationStore();

  const handleSideChange = (value: SidebarSide) => {
    setSide(value);
  };

  const handleVariantChange = (value: SidebarVariant) => {
    setVariant(value);
  };

  const handleCollapsibleChange = (value: SidebarCollapsible) => {
    setCollapsible(value);
  };

  const handleReset = () => {
    reset();
    resetNavigation();
  };

  return (
    <Sheet open={open} onOpenChange={setOpen} >
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="fixed top-1/2 end-4 z-50 h-10 w-10 rounded-full shadow-lg border-2 hover:shadow-xl transition-all duration-200 flex items-center justify-center -translate-y-1/2"
          title="Layout Settings"
        >
          <GearIcon className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      
      <SheetContent className="w-[420px] sm:w-[480px] p-5 overflow-y-auto">
        <SheetHeader className="pb-6 border-b">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <GearIcon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <SheetTitle className="text-xl font-semibold">Layout Settings</SheetTitle>
              <SheetDescription className="text-sm text-muted-foreground">
                Customize your dashboard layout and appearance
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>
        
        <div className="space-y-8 py-6">
          {/* Sidebar State */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-2 w-2 rounded-full bg-blue-500"></div>
              <h3 className="text-lg font-semibold text-foreground">Sidebar State</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="space-y-0.5">
                  <Label htmlFor="sidebar-open" className="text-sm font-medium">
                    Desktop Sidebar
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Show sidebar on desktop screens
                  </p>
                </div>
                <Switch
                  id="sidebar-open"
                  checked={sidebarOpen}
                  onCheckedChange={setSidebarOpen}
                />
              </div>
              
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="space-y-0.5">
                  <Label htmlFor="sidebar-mobile" className="text-sm font-medium">
                    Mobile Sidebar
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Show sidebar on mobile screens
                  </p>
                </div>
                <Switch
                  id="sidebar-mobile"
                  checked={sidebarOpenMobile}
                  onCheckedChange={setSidebarOpenMobile}
                />
              </div>
            </div>
          </div>
          
          <Separator />
          
          {/* Sidebar Layout */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-2 w-2 rounded-full bg-green-500"></div>
              <h3 className="text-lg font-semibold text-foreground">Layout Configuration</h3>
            </div>
            
            <div className="grid gap-4">
              <div className="space-y-3 p-4 rounded-lg border bg-card">
                <Label htmlFor="sidebar-side" className="text-sm font-medium flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary"></span>
                  Position
                </Label>
                <Select value={side} onValueChange={handleSideChange}>
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Select position" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="left" className="flex items-center gap-2">
                      <span>📍 Left Side</span>
                    </SelectItem>
                    <SelectItem value="right" className="flex items-center gap-2">
                      <span>📍 Right Side</span>
                    </SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">Choose which side to display the sidebar</p>
              </div>
              
              <div className="space-y-3 p-4 rounded-lg border bg-card">
                <Label htmlFor="sidebar-variant" className="text-sm font-medium flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary"></span>
                  Style
                </Label>
                <Select value={variant} onValueChange={handleVariantChange}>
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Select style" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sidebar">🔳 Standard</SelectItem>
                    <SelectItem value="floating">🎈 Floating</SelectItem>
                    <SelectItem value="inset">📦 Inset</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">Choose the visual style of the sidebar</p>
              </div>
              
              <div className="space-y-3 p-4 rounded-lg border bg-card">
                <Label htmlFor="sidebar-collapsible" className="text-sm font-medium flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary"></span>
                  Behavior
                </Label>
                <Select value={collapsible} onValueChange={handleCollapsibleChange}>
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Select behavior" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="offcanvas">📱 Off Canvas</SelectItem>
                    <SelectItem value="icon">🔘 Icon Only</SelectItem>
                    <SelectItem value="none">🚫 Fixed</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">How the sidebar behaves when collapsed</p>
              </div>
            </div>
          </div>
          
          <Separator />
          
          {/* Actions */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-2 w-2 rounded-full bg-orange-500"></div>
              <h3 className="text-lg font-semibold text-foreground">Quick Actions</h3>
            </div>
            
            <div className="space-y-3">
              <Button 
                variant="outline" 
                onClick={handleReset}
                className="w-full h-11 font-medium hover:bg-destructive hover:text-destructive-foreground transition-colors"
              >
                <span className="mr-2">🔄</span>
                Reset to Defaults
              </Button>
              
              <div className="p-3 rounded-lg bg-muted/30 border border-dashed">
                <p className="text-xs text-muted-foreground text-center">
                  Changes are saved automatically and persist across sessions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}