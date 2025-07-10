'use client'

import * as React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from '@/components/ui/sidebar'
import type { TypeOrganisationData } from '@/types/organization.types'

interface OrgSidebarProps {
    organisation: TypeOrganisationData
}

export function NavOrganization({ organisation }: OrgSidebarProps) {
    const { state } = useSidebar()
    const initials = React.useMemo(() => {
        return organisation.name
            .split(' ')
            .filter(Boolean)
            .slice(0, 2)
            .map((word) => word[0]?.toUpperCase() || '')
            .join('')
    }, [organisation.name])

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <SidebarMenuButton 
                    size="lg" 
                    className="gap-2"
                    tooltip={state === 'collapsed' ? organisation.name : undefined}
                >
                    <Avatar className="h-8 w-8 rounded-md">
                        {organisation.imageUrl && (
                            <AvatarImage src={organisation.imageUrl} alt={organisation.name} />
                        )}
                        <AvatarFallback className="rounded-md bg-primary text-primary-foreground font-semibold">
                            {initials}
                        </AvatarFallback>
                    </Avatar>
                    {state === 'expanded' && (
                        <div className="flex flex-col leading-none text-start">
                            <span className="font-semibold text-sm truncate" title={organisation.name}>
                                {organisation.name}
                            </span>
                            {organisation.academicYear && (
                                <span className="text-xs text-muted-foreground truncate" title={organisation.academicYear}>
                                    {organisation.academicYear}
                                </span>
                            )}
                        </div>
                    )}
                </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
    )
}
