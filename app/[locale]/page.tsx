import { getTranslations } from 'next-intl/server';
import { Link } from '../../i18n/routing';
import ProductCard from '../../components/ProductCard';
import { Product } from '../../types/product';
import { buttonVariants } from '../../components/ui/Button';
import { ArrowRight, Rocket, Tv, Shirt, Home, Watch, Footprints, Package, Flame } from 'lucide-react';

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  electronics: Tv,
  apparel: Shirt,
  home: Home,
  accessories: Watch,
  footwear: Footprints,
};

const CATEGORY_COLORS: Record<string, string> = {
  electronics: 'bg-blue-50 text-blue-600',
  apparel: 'bg-pink-50 text-pink-600',
  home: 'bg-green-50 text-green-600',
  accessories: 'bg-amber-50 text-amber-600',
  footwear: 'bg-purple-50 text-purple-600',
};

async function getProducts(): Promise<Product[]> {
  try {
    const res = await fetch(process.env.NEXT_PUBLIC_APP_URL ? `${process.env.NEXT_PUBLIC_APP_URL}/api/products` : 'http://localhost:3000/api/products', { cache: 'no-store' });
    if (!res.ok) throw new Error('API down');
    return res.json();
  } catch (e) {
    return require('../../data/products.json');
  }
}

async function getCategories(): Promise<string[]> {
  try {
    const res = await fetch(process.env.NEXT_PUBLIC_APP_URL ? `${process.env.NEXT_PUBLIC_APP_URL}/api/categories` : 'http://localhost:3000/api/categories', { cache: 'no-store' });
    if (!res.ok) throw new Error();
    return res.json();
  } catch {
    const products: Product[] = require('../../data/products.json');
    return Array.from(new Set(products.map(p => p.category)));
  }
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Home' });
  const tc = await getTranslations({ locale, namespace: 'Categories' });
  const [products, categories] = await Promise.all([getProducts(), getCategories()]);

  const featuredProducts = products.slice(0, 4);
  const offerProducts = products.filter(p => p.originalPrice && p.originalPrice > p.price);

  return (
    <>
      <section className="relative overflow-hidden bg-slate-950 py-24 sm:py-32 min-h-[85vh] flex items-center justify-center">
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 opacity-60">
          <div className="w-[500px] h-[500px] bg-indigo-600/30 rounded-full blur-[120px] mix-blend-screen animate-pulse duration-1000" />
        </div>
        <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 opacity-60">
          <div className="w-[600px] h-[600px] bg-rose-500/20 rounded-full blur-[120px] mix-blend-screen" />
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg h-[400px] bg-blue-500/10 rounded-full blur-[150px] pointer-events-none" />

        <div className="container relative z-10 mx-auto px-4 text-center mt-12 mb-20 lg:mb-32">
          <span className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-sm font-bold tracking-wide mb-8 backdrop-blur-md shadow-[0_0_20px_rgba(99,102,241,0.2)]">
            <Rocket className="w-4 h-4 text-indigo-400" /> {t('newCollection')}
          </span>
          <h1 className="text-6xl md:text-8xl font-black mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-100 to-indigo-300 tracking-tight leading-[1.1] drop-shadow-sm">
            {t('title')}
          </h1>
          <p className="text-xl md:text-2xl mb-12 text-slate-300 max-w-2xl mx-auto font-medium leading-relaxed drop-shadow-sm">
            {t('description')}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
            <Link href="/category/all" className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white bg-indigo-600 rounded-2xl hover:bg-indigo-500 hover:scale-105 hover:-translate-y-1 transition-all duration-300 shadow-[0_10px_40px_-10px_rgba(79,70,229,0.7)] group">
              {t('shopNow')} <ArrowRight className="w-5 h-5 ml-3 rtl:mr-3 rtl:ml-0 rtl:rotate-180 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
            </Link>
            <Link href="/about" className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 backdrop-blur-md transition-all duration-300">
              {t('learnMore')}
            </Link>
          </div>
        </div>

      </section>

      {offerProducts.length > 0 && (
        <section className="relative w-full py-12 border-b border-slate-800 bg-slate-900 z-20 shadow-2xl">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-6 py-2 rounded-full bg-slate-950 border border-slate-800 text-white text-sm font-bold shadow-xl flex items-center gap-2.5 z-30 whitespace-nowrap">
            <Flame className="w-4 h-4 text-rose-500 animate-pulse" />
            {locale === 'ar' ? 'عروض حصرية لفترة محدودة' : 'Limited Time Offers'}
          </div>
          <div className="overflow-hidden w-full">
            <div className={`flex w-max mt-4 ${locale === 'ar' ? 'animate-marquee-rtl' : 'animate-marquee'} hover:[animation-play-state:paused] group`}>
              {[...offerProducts, ...offerProducts, ...offerProducts, ...offerProducts, ...offerProducts, ...offerProducts].map((product, i) => (
                <div key={`${product.id}-${i}`} className="w-[280px] sm:w-[340px] shrink-0 mx-4 transition-opacity duration-300 group-hover:opacity-40 hover:!opacity-100">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-20 bg-slate-50 border-b border-slate-100 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#4f46e5 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>

        <div className="container relative z-10 mx-auto px-4 max-w-7xl">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-2">{t('featuredCategories')}</h2>
              <div className="h-1.5 w-12 bg-indigo-600 rounded-full"></div>
            </div>
            <Link href="/category/all" className="text-sm md:text-base font-bold text-indigo-600 hover:text-indigo-700 hover:tracking-wide flex items-center gap-1.5 transition-all group">
              {t('viewAll')} <ArrowRight className="w-4 h-4 rtl:rotate-180 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-5 gap-6">
            {categories.map((slug) => {
              const Icon = CATEGORY_ICONS[slug] ?? Package;
              const color = CATEGORY_COLORS[slug] ?? 'bg-slate-100 text-slate-600';
              return (
                <Link
                  key={slug}
                  href={`/category/${slug}`}
                  className="flex flex-col items-center gap-4 p-8 rounded-3xl border border-slate-100 bg-white shadow-sm hover:shadow-[0_12px_30px_rgb(0,0,0,0.06)] hover:-translate-y-2 transition-all duration-300 group"
                >
                  <div className={`w-16 h-16 rounded-2xl ${color} flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white group-hover:shadow-lg group-hover:shadow-indigo-500/30 transition-all duration-300 group-hover:rotate-3`}>
                    <Icon className="w-8 h-8 group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <span className="font-bold text-slate-800 text-base md:text-lg text-center group-hover:text-indigo-600 transition-colors">{tc(slug as any)}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-24 bg-white flex-grow">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-2">{t('featuredProducts')}</h2>
              <div className="h-1.5 w-12 bg-rose-500 rounded-full"></div>
            </div>
            <Link href="/category/all" className="text-sm md:text-base font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1.5 hover:tracking-wide transition-all group">
              {t('viewAll')} <ArrowRight className="w-4 h-4 rtl:rotate-180 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
