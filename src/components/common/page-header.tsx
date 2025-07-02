// src/components/common/page-header.tsx
'use client';

import {usePathname} from 'next/navigation';
import {useTranslations} from 'next-intl';
import {cn} from '@/lib/utils';
import {getBaseRouteIdByPath, getRouteByPath} from '@/config/routes/helpers';
import {createContext, useContext} from 'react';

// Page Header Context for controlling from child pages
interface PageHeaderContextType {
    setHeaderConfig: (config: Partial<PageHeaderProps>) => void;
}

const PageHeaderContext = createContext<PageHeaderContextType | null>(null);

export const usePageHeader = () => {
    const context = useContext(PageHeaderContext);
    if (!context) {
        throw new Error('usePageHeader must be used within a PageHeaderProvider');
    }
    return context;
};

interface PageHeaderProps {
    /**
     * Optional custom title - if provided, will override route-based title
     */
    title?: string;
    /**
     * Optional custom description - if provided, will override route-based description
     */
    description?: string;
    /**
     * Additional CSS classes
     */
    className?: string;
    /**
     * RTL support
     */
    rtl?: boolean;
    /**
     * Hide the entire header
     */
    /**
     * Show breadcrumb navigation
     */
    showBreadcrumb?: boolean;
    /**
     * Hide the entire header
     */
    hidden?: boolean;
}

export function PageHeader({
                               title: customTitle,
                               description: customDescription,
                               className,
                               rtl = false,
                               showBreadcrumb = true,
                               hidden = false,
                           }: PageHeaderProps) {
    const pathname = usePathname();
    const t = useTranslations();

    // Get current route information
    const currentRoute = getRouteByPath(pathname);
    const baseRouteId = getBaseRouteIdByPath(pathname); // This gives you the ID without role
    console.log(currentRoute)
    console.log(baseRouteId)
    // Determine title and description
    const getTitle = (): string => {

            // Try to get translation for base route title (without role)
            const titleKey = `sidebar.route.${baseRouteId}.title`;
           return  t(titleKey);
    };

    const getDescription = (): string => {
        if (customDescription) return customDescription;

            // Try to get translation for base route description (without role)
            const descriptionKey = `sidebar.route.${baseRouteId}.description`;
             return t(descriptionKey);

    };

    const getBreadcrumb = () => {
        if (!showBreadcrumb) return null;

        const segments = pathname.split('/').filter(Boolean);
        const breadcrumbItems = segments.map((segment, index) => {
            const path = '/' + segments.slice(0, index + 1).join('/');
            const route = getRouteByPath(path);

            const label = route?.id
                ? t(`routes.${route.id}.title`, { fallback: segment.replace(/-/g, ' ') })
                : segment.replace(/-/g, ' ');

            return {
                label: label.replace(/^./, str => str.toUpperCase()),
                path,
                isLast: index === segments.length - 1
            };
        });

        return (
            <nav
                className={cn(
                    "flex items-center space-x-1 text-sm text-muted-foreground mb-2",
                    rtl && "space-x-reverse"
                )}
                aria-label={t('common.breadcrumb')}
            >
                <a
                    href="/"
                    className="hover:text-foreground transition-colors"
                >
                    {t('common.home')}
                </a>
                {breadcrumbItems.map((item, index) => (
                    <div key={item.path} className="flex items-center">
            <span className={cn("mx-2", rtl && "rotate-180")}>
              /
            </span>
                        {item.isLast ? (
                            <span className="text-foreground font-medium">
                {item.label}
              </span>
                        ) : (
                            <a
                                href={item.path}
                                className="hover:text-foreground transition-colors"
                            >
                                {item.label}
                            </a>
                        )}
                    </div>
                ))}
            </nav>
        );
    };

    const title = getTitle();
    const description = getDescription();

    // Don't render if hidden
    if (hidden) {
        return null;
    }

    return (
        <div
            className={cn(
                "pb-4",
                rtl && "text-right",
                className
            )}
            dir={rtl ? 'rtl' : 'ltr'}
        >
            {getBreadcrumb()}

            <h1
                className={cn(
                    "text-2xl sm:text-3xl font-bold tracking-tight text-foreground",
                    "leading-tight"
                )}
            >
                {title}
            </h1>

            {description && (
                <p
                    className={cn(
                        "text-base text-muted-foreground leading-relaxed",
                        "max-w-3xl"
                    )}
                >
                    {description}
                </p>
            )}
        </div>
    );
}