import { getTranslations } from 'next-intl/server';
import { ReactNode } from 'react';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'Auth' });
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    return {
        title: `${t('loginTitle')} | MiniShop`,
        alternates: {
            canonical: `${baseUrl}/${locale}/login`,
            languages: {
                'en': `${baseUrl}/en/login`,
                'ar': `${baseUrl}/ar/login`,
                'x-default': `${baseUrl}/en/login`
            }
        }
    };
}

export default function LoginLayout({ children }: { children: ReactNode }) {
    return children;
}
