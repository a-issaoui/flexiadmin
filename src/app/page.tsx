import { useTranslations } from 'next-intl';
import { LocaleSwitcher } from '@/components/shared/locale-switcher';
import { ThemeToggle } from '@/components/shared/theme-toggle';

export default function HomePage() {
    const t = useTranslations('HomePage');

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">{t('title')}</h1>
                <div className="flex items-center gap-4">
                    <LocaleSwitcher />
                    <ThemeToggle />
                </div>
            </div>

            <p className="text-lg text-muted-foreground">{t('description')}</p>

            <div className="mt-8 p-4 bg-muted rounded-lg">
                <h2 className="text-lg font-semibold mb-2">{t('projectStatus.title')}</h2>
                <p className="text-sm text-muted-foreground whitespace-pre-line">
                    {t('projectStatus.items')}
                </p>
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="p-6 bg-card rounded-lg border">
                    <h3 className="text-lg font-semibold mb-2">{t('cards.modernStack.title')}</h3>
                    <p className="text-sm text-muted-foreground">{t('cards.modernStack.description')}</p>
                </div>
                <div className="p-6 bg-card rounded-lg border">
                    <h3 className="text-lg font-semibold mb-2">{t('cards.internationalization.title')}</h3>
                    <p className="text-sm text-muted-foreground">{t('cards.internationalization.description')}</p>
                </div>
                <div className="p-6 bg-card rounded-lg border">
                    <h3 className="text-lg font-semibold mb-2">{t('cards.themeSupport.title')}</h3>
                    <p className="text-sm text-muted-foreground">{t('cards.themeSupport.description')}</p>
                </div>
            </div>
        </div>
    );
}
