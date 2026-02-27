'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '../i18n/routing';

export default function LanguageSwitcher() {
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();

    const toggleLanguage = () => {
        const nextLocale = locale === 'en' ? 'ar' : 'en';
        router.replace(pathname, { locale: nextLocale });
    };

    return (
        <button
            onClick={toggleLanguage}
            className="text-sm font-medium px-3 py-2 rounded-md hover:bg-gray-100 transition-colors cursor-pointer"
        >
            {locale === 'en' ? 'العربية' : 'English'}
        </button>
    );
}
