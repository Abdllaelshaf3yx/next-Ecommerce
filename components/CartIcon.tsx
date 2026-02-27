'use client';

import { useTranslations } from 'next-intl';
import { Link } from '../i18n/routing';
import { ShoppingCart } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { useEffect, useState } from 'react';

export default function CartIcon() {
    const t = useTranslations('Navigation');
    const items = useSelector((state: RootState) => state.cart.items);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <Link href="/cart" className="relative p-2 text-gray-700 hover:text-blue-600 transition-colors cursor-pointer" aria-label={t('cart')}>
            <ShoppingCart className="w-6 h-6" />
            {mounted && totalItems > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-600 rounded-full">
                    {totalItems}
                </span>
            )}
        </Link>
    );
}
