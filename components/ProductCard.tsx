'use client';

import { useTranslations, useLocale } from 'next-intl';
import Image from 'next/image';
import { Link } from '../i18n/routing';
import { Product } from '../types/product';
import { Button } from './ui/Button';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../store/slices/cartSlice';
import { toggleWishlist } from '../store/slices/wishlistSlice';
import { Heart, Package, ShoppingCart } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { RootState } from '../store/store';

interface ProductCardProps {
    product: Product;
    view?: 'grid' | 'list';
}

export default function ProductCard({ product, view = 'grid' }: ProductCardProps) {
    const t = useTranslations('Product');
    const tc = useTranslations('Categories');
    const locale = useLocale();
    const dispatch = useDispatch();
    const { isAuthenticated } = useSelector((state: RootState) => state.auth as any);
    const { items: wishlistItems } = useSelector((state: RootState) => state.wishlist);
    const isArabic = locale === 'ar';
    const [imgError, setImgError] = useState(false);

    const name = isArabic ? product.name_ar : product.name_en;
    const isInWishlist = wishlistItems.some(item => item.id === product.id);
    const description = isArabic ? product.description_ar : product.description_en;

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        dispatch(addToCart(product));
        toast.success(t('addedToCart'));
    };

    const handleWishlist = (e: React.MouseEvent) => {
        e.preventDefault();
        if (!isAuthenticated) {
            toast.error(t('loginRequired'));
            return;
        }
        dispatch(toggleWishlist(product));
        if (isInWishlist) {
            toast.success(t('removedFromWishlist'));
        } else {
            toast.success(t('addedToWishlist'));
        }
    };

    return (
        <div className={`group relative overflow-hidden rounded-3xl bg-white border border-slate-100 transition-all duration-500 hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-2 flex flex-col h-full ${view === 'list' ? 'sm:flex-row p-4 gap-6' : ''}`}>
            <div className={`relative bg-slate-50/50 overflow-hidden shrink-0 group-hover:bg-indigo-50/30 transition-colors ${view === 'list' ? 'w-40 sm:w-64 h-full min-h-[14rem] rounded-2xl' : 'aspect-[4/3] w-full rounded-t-3xl'}`}>
                <Link href={`/product/${product.id}`} className="absolute inset-0 z-10" aria-label={name} />

                {imgError ? (
                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-300 gap-2">
                        <Package className="w-12 h-12" />
                        <span className="text-xs">{name}</span>
                    </div>
                ) : (
                    <Image
                        key={product.image}
                        src={product.image}
                        alt={name}
                        fill
                        className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-110"
                        sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
                        onError={() => setImgError(true)}
                    />
                )}

                <div className="absolute top-4 left-4 flex flex-col gap-2 z-20 pointer-events-none">
                    {!product.inStock && (
                        <span className="bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm backdrop-blur-md">
                            {t('outOfStock')}
                        </span>
                    )}
                    {product.originalPrice && product.originalPrice > product.price && (
                        <span className="bg-rose-500 text-white text-xs font-black px-3 py-1.5 rounded-lg shadow-sm shadow-rose-500/30">
                            -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                        </span>
                    )}
                </div>

                <button
                    onClick={handleWishlist}
                    className={`absolute top-4 right-4 p-3 bg-white/90 backdrop-blur shadow-sm rounded-full transition-all duration-300 z-30 hover:scale-110 active:scale-95 cursor-pointer ${isInWishlist
                        ? 'text-rose-500 opacity-100 translate-y-0'
                        : 'text-slate-400 hover:text-rose-500 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0'
                        }`}
                    aria-label={t('addToWishlist')}
                >
                    <Heart className={`w-5 h-5 ${isInWishlist ? 'fill-current' : ''}`} />
                </button>
            </div>

            <div className={`p-6 flex flex-col gap-4 flex-1 z-20 bg-white ${view === 'list' ? 'justify-between py-2 px-0 bg-transparent' : ''}`}>
                <div>
                    <h3 className={`font-bold text-slate-800 hover:text-indigo-600 transition-colors ${view === 'list' ? 'text-xl mb-1' : 'text-lg line-clamp-1'}`}>
                        <Link href={`/product/${product.id}`}>{name}</Link>
                    </h3>
                    <p className="text-sm font-medium text-slate-500 capitalize">{tc(product.category as any)}</p>
                </div>

                {view === 'list' && (
                    <p className="text-sm text-slate-600 line-clamp-2 md:line-clamp-3 leading-relaxed">{description}</p>
                )}

                <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between gap-4">
                    <div className="flex flex-col">
                        <span className="text-xl font-black text-indigo-600">{product.price.toFixed(2)} EGP</span>
                        {product.originalPrice && product.originalPrice > product.price && (
                            <span className="text-sm font-medium text-slate-400 line-through">{product.originalPrice.toFixed(2)} EGP</span>
                        )}
                    </div>
                    <Button
                        onClick={handleAddToCart}
                        size="sm"
                        className="rounded-xl bg-slate-900 hover:bg-slate-800 text-white shadow-lg hover:shadow-slate-500/30 transition-all hover:scale-105 active:scale-95 px-5 py-2.5 group/btn cursor-pointer z-30"
                        disabled={!product.inStock}
                        aria-label={t('addToCart')}
                    >
                        <ShoppingCart className="w-4 h-4 rtl:ml-2 ltr:mr-2 hidden sm:inline-block group-hover/btn:-rotate-12 transition-transform" />
                        {view === 'list' ? t('addToCart') : ''}
                        <span className={`${view === 'grid' ? 'sm:hidden' : 'hidden'}`}><ShoppingCart className="w-4 h-4" /></span>
                    </Button>
                </div>
            </div>
        </div>
    );
}
