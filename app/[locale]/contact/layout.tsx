import { getTranslations } from 'next-intl/server';
import { ReactNode } from 'react';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'Contact' });
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    return {
        title: `${t('title')} | MiniShop`,
        description: t('description'),
        alternates: {
            canonical: `${baseUrl}/${locale}/contact`,
            languages: {
                'en': `${baseUrl}/en/contact`,
                'ar': `${baseUrl}/ar/contact`,
                'x-default': `${baseUrl}/en/contact`
            }
        }
    };
}

export default function ContactLayout({ children }: { children: ReactNode }) {
    return children;
}
