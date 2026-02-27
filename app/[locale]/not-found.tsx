'use client';

import { useTranslations } from 'next-intl';
import { Link } from '../../i18n/routing';
import { buttonVariants } from '../../components/ui/Button';

export default function NotFound() {
    const t = useTranslations('NotFound');
    return (
        <div className="min-h-[60vh] flex items-center justify-center container mx-auto px-4 py-16 text-center">
            <div>
                <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
                <h2 className="text-3xl font-semibold text-gray-800 mb-6">{t('heading')}</h2>
                <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">{t('description')}</p>
                <Link href="/" className={buttonVariants({ size: 'lg' })}>{t('backHome')}</Link>
            </div>
        </div>
    );
}
