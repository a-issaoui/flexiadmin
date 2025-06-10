// app/page.tsx
import { useTranslations } from 'next-intl';
import { LocaleSwitcher } from '@/components/shared/locale-switcher';
import { getUserLocale } from '@/store/locale-store';

export default async function HomePage() {
    const t = useTranslations('HomePage');
    const { lang: currentLocale } = await getUserLocale();

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">
                    {t('title')}
                </h1>
                <LocaleSwitcher />
            </div>

            <p className="text-lg text-muted-foreground">
                {t('description')}
            </p>

            <div className="mt-8">
                <p>Current locale: {currentLocale}</p>
                <p className="text-sm text-muted-foreground mt-2">
                    Language is determined by cookies, not URL routes.
                </p>
            </div>
        </div>
    );
}