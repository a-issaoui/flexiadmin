import { useTranslations } from 'next-intl';


export default function HomePage() {
    const t = useTranslations('routes');

    return (
        <div className="container mx-auto ">
                <h1 className="text-3xl font-bold">{t('home.title')}</h1>

            <p className="text-lg text-muted-foreground">{t('home.description')}</p>

        </div>
    );
}
