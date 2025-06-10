// src/app/page.tsx
import { useTranslations } from 'next-intl';
import { LocaleSwitcher } from '@/components/shared/locale-switcher';

export default function HomePage() {
    const t = useTranslations('HomePage');

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

            <div className="mt-8 p-4 bg-muted rounded-lg">
                <h2 className="text-lg font-semibold mb-2">Project Status</h2>
                <p className="text-sm text-muted-foreground">
                    ✅ Fixed React suspense error<br/>
                    ✅ Internationalization working<br/>
                    ✅ Theme switching enabled<br/>
                    🔧 Ready for development
                </p>
            </div>
        </div>
    );
}