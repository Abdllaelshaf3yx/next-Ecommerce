'use client';

import { Product } from '../../../../types/product';
import { Button } from '../../../../components/ui/Button';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../../../store/slices/cartSlice';
import { toggleWishlist } from '../../../../store/slices/wishlistSlice';
import { ShoppingCart, Heart } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { toast } from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../store/store';

export default function ProductActions({ product }: { product: Product }) {
    const t = useTranslations('Product');
    const dispatch = useDispatch();
    const { isAuthenticated } = useSelector((state: RootState) => state.auth as any);

    return (
        <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-6">
            <Button
                size="lg"
                className="flex-1 flex gap-3 h-14 text-lg font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-lg shadow-indigo-500/30 transition-all hover:-translate-y-0.5"
                onClick={() => {
                    dispatch(addToCart(product));
                    toast.success(t('addedToCart'));
                }}
                disabled={!product.inStock}
            >
                <ShoppingCart className="w-6 h-6" />
                {t('addToCart')}
            </Button>
            <Button
                size="lg"
                variant="outline"
                className="flex gap-3 h-14 text-lg font-bold text-slate-700 border-slate-200 hover:bg-slate-50 rounded-xl transition-all"
                onClick={() => {
                    if (!isAuthenticated) {
                        toast.error(t('loginRequired'));
                        return;
                    }
                    dispatch(toggleWishlist(product));
                    toast.success(t('addedToWishlist'));
                }}
            >
                <Heart className="w-6 h-6 text-rose-500" />
                {t('addToWishlist')}
            </Button>
        </div>
    );
}
