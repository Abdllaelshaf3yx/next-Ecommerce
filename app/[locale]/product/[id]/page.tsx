import { getTranslations } from 'next-intl/server';
import { Product as ProductType } from '../../../../types/product';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import ProductCard from '../../../../components/ProductCard';
import ProductActions from './ProductActions';
import { Metadata } from 'next';
import { Flame, ChevronRight, Home as HomeIcon } from 'lucide-react';
import { Link } from '../../../../i18n/routing';

async function getProduct(id: string): Promise<ProductType | null> {
    try {
        const products: ProductType[] = require('../../../../data/products.json');
        return products.find(p => p.id === id) || null;
    } catch (e) {
        return null;
    }
}

async function getRelatedProducts(category: string, currentId: string): Promise<ProductType[]> {
    try {
        const products: ProductType[] = require('../../../../data/products.json');
        return products.filter(p => p.category === category && p.id !== currentId).slice(0, 4);
    } catch (e) {
        return [];
    }
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string, id: string }> }): Promise<Metadata> {
    const { id, locale } = await params;
    const product = await getProduct(id);
    if (!product) return {};

    const title = locale === 'ar' ? product.name_ar : product.name_en;
    const description = locale === 'ar' ? product.description_ar : product.description_en;
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    return {
        title: `${title} | MiniShop`,
        description,
        openGraph: {
            title,
            description,
            images: [product.image]
        },
        twitter: {
            card: 'summary_large_image' as const,
            title,
            description,
            images: [product.image],
        },
        alternates: {
            canonical: `${baseUrl}/${locale}/product/${id}`,
            languages: {
                'en': `${baseUrl}/en/product/${id}`,
                'ar': `${baseUrl}/ar/product/${id}`,
                'x-default': `${baseUrl}/en/product/${id}`,
            }
        }
    };
}

export default async function ProductPage({
    params
}: {
    params: Promise<{ locale: string, id: string }>;
}) {
    const { id, locale } = await params;
    const t = await getTranslations({ locale, namespace: 'Product' });
    const tc = await getTranslations({ locale, namespace: 'Categories' });
    const product = await getProduct(id);

    if (!product) {
        notFound();
    }

    const relatedProducts = await getRelatedProducts(product.category, product.id);
    const isArabic = locale === 'ar';

    const name = isArabic ? product.name_ar : product.name_en;
    const description = isArabic ? product.description_ar : product.description_en;

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name,
        image: product.image,
        description,
        offers: {
            '@type': 'Offer',
            price: product.price,
            priceCurrency: 'USD',
            availability: product.inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock'
        }
    };

    const breadcrumbLd = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            { '@type': 'ListItem', position: 1, name: isArabic ? 'الرئيسية' : 'Home', item: `${baseUrl}/${locale}` },
            { '@type': 'ListItem', position: 2, name: isArabic ? 'الفئات' : 'Categories', item: `${baseUrl}/${locale}/category/${product.category}` },
            { '@type': 'ListItem', position: 3, name, item: `${baseUrl}/${locale}/product/${product.id}` },
        ]
    };

    return (
        <div className="container mx-auto px-4 py-12 max-w-6xl">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
            />

            <nav aria-label="Breadcrumb" className="mb-8 overflow-x-auto whitespace-nowrap pb-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                <ol className="flex items-center gap-2 text-sm md:text-base font-medium text-slate-500">
                    <li>
                        <Link href="/" className="flex items-center gap-1.5 hover:text-indigo-600 transition-colors">
                            <HomeIcon className="w-4 h-4" />
                            {isArabic ? 'الرئيسية' : 'Home'}
                        </Link>
                    </li>
                    <li>
                        <ChevronRight className="w-4 h-4 rtl:rotate-180 text-slate-300" />
                    </li>
                    <li>
                        <Link href={`/category/${product.category}`} className="hover:text-indigo-600 transition-colors capitalize">
                            {tc(product.category as any)}
                        </Link>
                    </li>
                    <li>
                        <ChevronRight className="w-4 h-4 rtl:rotate-180 text-slate-300" />
                    </li>
                    <li aria-current="page" className="text-slate-900 font-bold truncate max-w-[150px] sm:max-w-[300px] md:max-w-[500px]">
                        {name}
                    </li>
                </ol>
            </nav>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20 lg:items-start">
                <div className="relative aspect-[4/5] bg-slate-50 rounded-3xl overflow-hidden border border-slate-100 shadow-xl shadow-slate-200/50 group">
                    <Image
                        key={product.image}
                        src={product.image}
                        alt={name}
                        fill
                        className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                        priority
                        sizes="(min-width: 1024px) 50vw, 100vw"
                    />
                </div>

                <div className="flex flex-col justify-center lg:sticky lg:top-32">
                    <div className="mb-6 flex items-center gap-3 flex-wrap">
                        <div className="text-sm text-indigo-700 font-extrabold uppercase tracking-widest bg-indigo-50 border border-indigo-100 px-4 py-1.5 rounded-full shadow-sm">
                            {tc(product.category as any)}
                        </div>
                        {product.originalPrice && product.originalPrice > product.price && (
                            <div className="text-sm text-rose-700 font-extrabold uppercase tracking-widest bg-rose-50 border border-rose-100 px-4 py-1.5 rounded-full shadow-sm flex items-center gap-1.5">
                                <Flame className="w-4 h-4" />
                                {locale === 'ar' ? 'خصم خاص' : 'Special Offer'}
                            </div>
                        )}
                    </div>

                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 mb-6 leading-[1.15] tracking-tight">{name}</h1>

                    <div className="flex flex-wrap items-end gap-5 mb-8">
                        <p className="text-4xl md:text-5xl font-black text-indigo-600">{product.price.toFixed(2)} EGP</p>
                        {product.originalPrice && product.originalPrice > product.price && (
                            <div className="flex flex-col mb-1.5">
                                <span className="text-xl font-bold text-slate-400 line-through decoration-2 decoration-rose-500/40">{product.originalPrice.toFixed(2)} EGP</span>
                                <span className="text-sm font-bold text-rose-500 tracking-wide">
                                    {locale === 'ar' ? `وفّر ${Math.abs(product.originalPrice - product.price).toFixed(2)} ج.م` : `Save ${Math.abs(product.originalPrice - product.price).toFixed(2)} EGP`}
                                </span>
                            </div>
                        )}
                    </div>

                    <div className="prose prose-slate prose-lg max-w-none text-slate-600 border-y border-slate-100 py-8 mb-8">
                        <p className="leading-relaxed text-lg">{description}</p>
                    </div>

                    <div className="mb-8 flex items-center gap-4">
                        {product.inStock ? (
                            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold bg-green-50 text-green-700 border border-green-200 shadow-sm">
                                <span className="relative flex h-3 w-3">
                                    <span className="animate-[ping_1.5s_cubic-bezier(0,0,0.2,1)_infinite] absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                                </span>
                                {t('inStock')}
                            </span>
                        ) : (
                            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold bg-rose-50 text-rose-700 border border-rose-200 shadow-sm">
                                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)]"></span>
                                {t('outOfStock')}
                            </span>
                        )}
                    </div>

                    <ProductActions product={product} />

                    <div className="mt-10 grid grid-cols-2 gap-4 pt-8 border-t border-slate-100">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                            <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            </div>
                            <span className="font-bold text-slate-700 text-sm">{locale === 'ar' ? 'جودة مضمونة ١٠٠٪' : '100% Authentic Quality'}</span>
                        </div>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                            <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                            </div>
                            <span className="font-bold text-slate-700 text-sm">{locale === 'ar' ? 'شحن فائق السرعة' : 'Lightning Fast Shipping'}</span>
                        </div>
                    </div>
                </div>
            </div>

            {relatedProducts.length > 0 && (
                <div className="border-t border-slate-100 pt-20 mt-10">
                    <h2 className="text-3xl font-extrabold text-slate-900 mb-10 text-center flex justify-center items-center gap-3">
                        <span className="bg-indigo-100 text-indigo-600 w-10 h-10 rounded-xl flex items-center justify-center text-xl"><Flame className="w-6 h-6" /></span>
                        {t('relatedProducts')}
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {relatedProducts.map((p) => (
                            <ProductCard key={p.id} product={p} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
