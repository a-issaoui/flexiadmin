// src/components/common/page-header.tsx

'use client';

import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import { getPageInfo } from '@/lib/navigation/navigation-utils';

interface PageHeaderProps {
    title?: string;
    description?: string;
    className?: string;
    rtl?: boolean;
    showBreadcrumb?: boolean;
    hidden?: boolean;
}

/**
 * Page header component that automatically generates titles and breadcrumbs
 * based on the current URL path.
 *
 * This is much simpler than the old route-based system because we use
 * direct path-to-content mapping instead of complex route resolution.
 */
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

    // Get page information using simple path-based lookup
    const { title: pathTitle, description: pathDescription } = getPageInfo(pathname, t);

    // Use custom values if provided, otherwise use path-based values
    const title = customTitle || pathTitle;
    const description = customDescription || pathDescription;

    const getBreadcrumb = () => {
        if (!showBreadcrumb) return null;

        const segments = pathname.split('/').filter(Boolean);
        const breadcrumbItems = segments.map((segment, index) => {
            const path = '/' + segments.slice(0, index + 1).join('/');
            const { title } = getPageInfo(path, t);

            return {
                label: title,
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
                {/* Home link */}
           <a
                href="/"
                className="hover:text-foreground transition-colors"
                >
                {t('common.home')}
            </a>

        {/* Dynamic breadcrumb items */}
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