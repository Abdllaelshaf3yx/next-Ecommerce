import { getTranslations } from 'next-intl/server';
import { ReactNode } from 'react';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'Auth' });
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    return {
        title: `${t('signupTitle')} | MiniShop`,
        alternates: {
            canonical: `${baseUrl}/${locale}/signup`,
            languages: {
                'en': `${baseUrl}/en/signup`,
                'ar': `${baseUrl}/ar/signup`,
                'x-default': `${baseUrl}/en/signup`
            }
        }
    };
}

export default function SignupLayout({ children }: { children: ReactNode }) {
    return children;
}
