import { useTranslations } from 'next-intl';

export default function HomePage() {
    const t = useTranslations('sidebar.route');

    return (
        <div className="container mx-auto ">
     <h1 className="text-3xl font-bold">{t('permissions.title')}</h1>


            <p className="text-lg text-muted-foreground">{t('permissions.description')}</p>

        </div>
    );
}
