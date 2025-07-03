import { useTranslations } from 'next-intl';

export default function HomePage() {
    const t = useTranslations('routes');

    return (
        <div >

            <h1 className="text-3xl font-bold">{t('dashboard.title')}</h1>
            <p className="text-lg text-muted-foreground">{t('dashboard.description')}</p>

        </div>
    );
}
