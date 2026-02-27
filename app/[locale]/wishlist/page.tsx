'use client';

import { useTranslations, useLocale } from 'next-intl';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../store/store';
import { toggleWishlist } from '../../../store/slices/wishlistSlice';
import { Link } from '../../../i18n/routing';
import { buttonVariants } from '../../../components/ui/Button';
import ProductCard from '../../../components/ProductCard';
import { Heart } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

export default function WishlistPage() {
    const t = useTranslations('Wishlist');
    const { items } = useSelector((state: RootState) => state.wishlist);
    const { isAuthenticated } = useSelector((state: RootState) => state.auth as any);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (mounted && !isAuthenticated) {
        return (
            <div className="container mx-auto px-4 py-32 text-center h-full flex flex-col items-center justify-center min-h-[50vh]">
                <Heart className="w-16 h-16 text-slate-300 mb-6" />
                <h1 className="text-3xl font-bold mb-4 text-slate-900">{t('loginRequired')}</h1>
                <Link href="/login" className={buttonVariants({ variant: 'primary', size: 'lg' })}>
                    Log In
                </Link>
            </div>
        );
    }

    if (!mounted) return null;

    if (items.length === 0) {
        return (
            <div className="container mx-auto px-4 py-32 text-center h-full flex flex-col items-center justify-center min-h-[50vh]">
                <Heart className="w-16 h-16 text-slate-300 mb-6" />
                <h1 className="text-3xl font-bold mb-4 text-slate-900">{t('title')}</h1>
                <p className="text-xl text-slate-600 mb-8">{t('empty')}</p>
                <Link href="/category/all" className={buttonVariants({ variant: 'primary', size: 'lg' })}>
                    {t('continueShopping')}
                </Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-12 md:py-20 min-h-screen">
            <h1 className="text-4xl font-extrabold mb-10 text-slate-900 inline-flex items-center gap-4">
                <Heart className="w-10 h-10 text-rose-500" />
                {t('title')}
            </h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {items.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </div>
    );
}
