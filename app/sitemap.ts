import { MetadataRoute } from 'next';
import { routing } from '../i18n/routing';
import productsData from '../data/products.json';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const { locales } = routing;

    function buildEntry(path: string, priority: number = 0.8, changeFrequency: 'daily' | 'weekly' | 'monthly' = 'daily') {
        const languages: Record<string, string> = {};
        locales.forEach(locale => {
            languages[locale] = `${baseUrl}/${locale}${path}`;
        });
        languages['x-default'] = `${baseUrl}/en${path}`;

        return {
            url: `${baseUrl}/en${path}`,
            lastModified: new Date(),
            changeFrequency,
            priority,
            alternates: { languages }
        };
    }

    const staticRoutes = [
        { path: '', priority: 1.0 },
        { path: '/about', priority: 0.7, freq: 'monthly' as const },
        { path: '/contact', priority: 0.7, freq: 'monthly' as const },
        { path: '/login', priority: 0.5, freq: 'monthly' as const },
        { path: '/signup', priority: 0.5, freq: 'monthly' as const },
        { path: '/cart', priority: 0.3, freq: 'weekly' as const },
        { path: '/checkout', priority: 0.3, freq: 'weekly' as const },
        { path: '/category/all', priority: 0.9 },
    ];

    const uniqueCategories = Array.from(new Set(productsData.map(p => p.category)));
    const categoryEntries = uniqueCategories.map(cat => buildEntry(`/category/${cat}`, 0.85));

    const productEntries = productsData.map(p => buildEntry(`/product/${p.id}`, 0.9));

    return [
        ...staticRoutes.map(r => buildEntry(r.path, r.priority, r.freq ?? 'daily')),
        ...categoryEntries,
        ...productEntries,
    ];
}
