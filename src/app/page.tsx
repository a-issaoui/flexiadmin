import { useTranslations } from 'next-intl';
import { LocaleSwitcher } from '@/components/shared/locale-switcher';
import { ThemeToggle } from '@/components/shared/theme-toggle';

export default function HomePage() {
    const t = useTranslations('sidebarData.route');

    return (
        <div className="container mx-auto ">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">{t('home.title')}</h1>
                <div className="flex items-center gap-1">
                    <LocaleSwitcher />
                    <ThemeToggle />
                </div>
            </div>

            <p className="text-lg text-muted-foreground">{t('home.description')}</p>

        </div>
    );
}
