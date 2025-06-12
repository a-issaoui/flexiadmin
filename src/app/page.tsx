import { useTranslations } from 'next-intl';
import { LocaleSwitcher } from '@/components/shared/locale-switcher';
import { ThemeToggle } from '@/components/shared/theme-toggle';

export default function HomePage() {
    const t = useTranslations('HomePage');

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">
                    {t('title')}
                </h1>
                <div className="flex items-center gap-4">
                    <LocaleSwitcher />
                    <ThemeToggle />
                </div>
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
                    ✅ Fixed configuration issues<br/>
                    🔧 Ready for development
                </p>
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="p-6 bg-card rounded-lg border">
                    <h3 className="text-lg font-semibold mb-2">Modern Stack</h3>
                    <p className="text-sm text-muted-foreground">
                        Built with Next.js 15, React 19, and Tailwind CSS v4
                    </p>
                </div>
                <div className="p-6 bg-card rounded-lg border">
                    <h3 className="text-lg font-semibold mb-2">Internationalization</h3>
                    <p className="text-sm text-muted-foreground">
                        Multi-language support with next-intl and RTL support
                    </p>
                </div>
                <div className="p-6 bg-card rounded-lg border">
                    <h3 className="text-lg font-semibold mb-2">Theme Support</h3>
                    <p className="text-sm text-muted-foreground">
                        Dark/light mode with system preference detection
                    </p>
                </div>
            </div>
        </div>
    );
}