import { useTranslations } from 'next-intl';

// Force dynamic rendering for admin dashboard
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function HomePage() {
    const t = useTranslations('common');

    return (
        <div className="container mx-auto ">
                <h1 className="text-3xl font-bold">{t('home')}</h1>

            <p className="text-lg text-muted-foreground">Welcome to FlexiAdmin</p>

        </div>
    );
}
