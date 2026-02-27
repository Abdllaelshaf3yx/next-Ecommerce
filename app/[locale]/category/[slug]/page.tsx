import { getTranslations } from 'next-intl/server';
import { Product } from '../../../../types/product';
import ProductCard from '../../../../components/ProductCard';
import { notFound } from 'next/navigation';
import { Sparkles, LayoutGrid, List } from 'lucide-react';
import { Link } from '../../../../i18n/routing';

async function getProducts(): Promise<Product[]> {
    try {
        const res = await fetch(process.env.NEXT_PUBLIC_APP_URL ? `${process.env.NEXT_PUBLIC_APP_URL}/api/products` : 'http://localhost:3000/api/products', { cache: 'no-store' });
        if (!res.ok) throw new Error('API down');
        return res.json();
    } catch (e) {
        return require('../../../../data/products.json');
    }
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string, slug: string }> }) {
    const { slug, locale } = await params;
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const tCategory = await getTranslations({ locale, namespace: 'Categories' });
    const categoryName = slug === 'all' ? (locale === 'ar' ? 'جميع المنتجات' : 'All Products') : tCategory(slug as any);
    const title = locale === 'ar' ? `${categoryName} | ميني شوب` : `${categoryName} | MiniShop`;
    return {
        title,
        alternates: {
            canonical: `${baseUrl}/${locale}/category/${slug}`,
            languages: {
                'en': `${baseUrl}/en/category/${slug}`,
                'ar': `${baseUrl}/ar/category/${slug}`,
                'x-default': `${baseUrl}/en/category/${slug}`,
            }
        }
    };
}

export default async function CategoryPage({
    params,
    searchParams
}: {
    params: Promise<{ locale: string, slug: string }>;
    searchParams: Promise<{ sort?: string, view?: string }>;
}) {
    const { slug, locale } = await params;
    const { sort, view = 'grid' } = await searchParams;
    const tNav = await getTranslations({ locale, namespace: 'Navigation' });
    const tCategory = await getTranslations({ locale, namespace: 'Category' });
    const tCategories = await getTranslations({ locale, namespace: 'Categories' });

    const allProducts = await getProducts();
    let products = slug === 'all'
        ? allProducts
        : allProducts.filter(p => p.category.toLowerCase() === slug.toLowerCase());

    if (products.length === 0 && slug !== 'all') {
        notFound();
    }

    if (sort === 'asc') {
        products.sort((a, b) => a.price - b.price);
    } else if (sort === 'desc') {
        products.sort((a, b) => b.price - a.price);
    }

    const CATEGORY_SLUGS = ['all', 'apparel', 'accessories', 'electronics', 'footwear', 'home'];

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col lg:flex-row gap-8">
                <aside className="w-full lg:w-64 shrink-0">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 sticky top-24">
                        <h2 className="text-xl font-bold mb-4 text-slate-900">{tNav('products')}</h2>
                        <ul className="space-y-2">
                            {CATEGORY_SLUGS.map((cat) => (
                                <li key={cat}>
                                    <Link
                                        href={`/category/${cat}?sort=${sort || ''}&view=${view}`}
                                        className={`block px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${slug === cat ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50 hover:text-indigo-600'}`}
                                    >
                                        {tCategories(cat as any)}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </aside>

                <div className="flex-1">
                    <div className="flex flex-col md:flex-row justify-between items-center mb-8 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                        <h1 className="text-3xl font-extrabold text-slate-900 capitalize flex items-center gap-3">
                            <span className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center text-sm"><Sparkles className="w-5 h-5" /></span>
                            {slug === 'all' ? tCategories('all') : tCategories(slug as any)}
                        </h1>

                        <div className="mt-4 md:mt-0 flex items-center gap-3">
                            <div className="flex items-center gap-2 border-r border-slate-200 pr-4 mr-1">
                                <Link href={`?sort=${sort || ''}&view=grid`} className={`p-2 rounded-lg transition-colors ${view !== 'list' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-400 hover:bg-slate-50'}`} aria-label="Grid View">
                                    <LayoutGrid className="w-5 h-5" />
                                </Link>
                                <Link href={`?sort=${sort || ''}&view=list`} className={`p-2 rounded-lg transition-colors ${view === 'list' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-400 hover:bg-slate-50'}`} aria-label="List View">
                                    <List className="w-5 h-5" />
                                </Link>
                            </div>

                            <span className="text-slate-500 text-sm font-medium">{tCategory('sortBy')}</span>
                            <div className="flex gap-2">
                                <Link href={`?sort=asc&view=${view}`} className={`px-4 py-2 text-sm font-medium rounded-xl transition-all duration-300 ${sort === 'asc' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20' : 'bg-slate-50 text-slate-700 hover:bg-slate-100'}`}>
                                    {tCategory('priceLowToHigh')}
                                </Link>
                                <Link href={`?sort=desc&view=${view}`} className={`px-4 py-2 text-sm font-medium rounded-xl transition-all duration-300 ${sort === 'desc' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20' : 'bg-slate-50 text-slate-700 hover:bg-slate-100'}`}>
                                    {tCategory('priceHighToLow')}
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className={view === 'list' ? "flex flex-col gap-6" : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"}>
                        {products.map((product) => (
                            <ProductCard key={product.id} product={product} view={view as any} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
