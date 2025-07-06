'use client';

import React from 'react';
import { useLayoutStore } from '@/stores/layout.store';
import { Button } from "@/components/ui/button";

export default function HomePage() {
    const setSidebarVariant = useLayoutStore(state => state.setSidebarVariant);

    return (
        <div className="p-4">
            <h1 className="text-3xl font-bold">Test Title</h1>
            <p className="text-lg text-muted-foreground">Description page</p>

            <div className="mt-4 space-x-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSidebarVariant('floating')}
                >
                    Floating Sidebar
                </Button>

                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSidebarVariant('sidebar')}
                >
                    Default Sidebar
                </Button>

                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSidebarVariant('inset')}
                >
                    Inset Sidebar
                </Button>
            </div>
        </div>
    );
}