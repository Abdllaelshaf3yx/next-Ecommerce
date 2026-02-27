'use client';

import { useTranslations } from 'next-intl';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../store/store';
import { updateQuantity, removeFromCart } from '../../../store/slices/cartSlice';
import { Link } from '../../../i18n/routing';
import { toast } from 'react-hot-toast';
import { Button, buttonVariants } from '../../../components/ui/Button';
import Image from 'next/image';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { useLocale } from 'next-intl';

export default function CartPage() {
    const t = useTranslations('Cart');
    const tc = useTranslations('Categories');
    const locale = useLocale();
    const dispatch = useDispatch();
    const items = useSelector((state: RootState) => state.cart.items);
    const isArabic = locale === 'ar';

    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    if (items.length === 0) {
        return (
            <div className="container mx-auto px-4 py-16 text-center h-full flex flex-col items-center justify-center min-h-[50vh]">
                <h1 className="text-3xl font-bold mb-6 text-gray-900">{t('title')}</h1>
                <p className="text-xl text-gray-600 mb-8">{t('empty')}</p>
                <Link href="/category/all" className={buttonVariants({ variant: 'primary' })}>{t('continueShopping')}</Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-5xl">
            <h1 className="text-3xl font-bold mb-8 text-gray-900">{t('title')}</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-4">
                    {items.map((item) => {
                        const name = isArabic ? item.name_ar : item.name_en;
                        return (
                            <div key={item.id} className="flex gap-6 border border-slate-100 rounded-2xl p-5 bg-white shadow-sm hover:shadow-md transition-shadow">
                                <div className="relative w-28 h-28 bg-slate-50 rounded-xl overflow-hidden shrink-0 border border-slate-100">
                                    <Image src={item.image} alt={name} fill className="object-cover" />
                                </div>
                                <div className="flex-1 flex flex-col justify-between">
                                    <div className="flex justify-between">
                                        <div>
                                            <h3 className="font-semibold text-gray-900">{name}</h3>
                                            <p className="text-sm text-gray-500 capitalize">{tc(item.category as any)}</p>
                                        </div>
                                        <p className="font-bold text-gray-900">{(item.price * item.quantity).toFixed(2)} EGP</p>
                                    </div>
                                    <div className="flex justify-between items-end mt-4">
                                        <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                                            <button
                                                onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity - 1 }))}
                                                className="p-2.5 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                                disabled={item.quantity <= 1}
                                            >
                                                <Minus className="w-4 h-4" />
                                            </button>
                                            <span className="w-12 text-center font-bold text-slate-700 select-none">{item.quantity}</span>
                                            <button
                                                onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity + 1 }))}
                                                className="p-2.5 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
                                            >
                                                <Plus className="w-4 h-4" />
                                            </button>
                                        </div>
                                        <button
                                            onClick={() => {
                                                dispatch(removeFromCart(item.id));
                                                toast.success(t('removedFromCart'));
                                            }}
                                            className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                                        >
                                            <Trash2 className="w-4.5 h-4.5" />
                                            <span className="text-sm font-medium">{t('remove')}</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="lg:col-span-1">
                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/50 sticky top-24">
                        <h2 className="text-xl font-bold mb-6 text-slate-900 border-b border-slate-100 pb-4">{t('orderSummary')}</h2>
                        <div className="flex justify-between mb-4 text-gray-600">
                            <span>{t('subtotal')}</span>
                            <span className="font-semibold text-gray-900">{subtotal.toFixed(2)} EGP</span>
                        </div>
                        <div className="border-t border-gray-200 pt-4 mb-6">
                            <div className="flex justify-between text-lg font-bold text-gray-900">
                                <span>{t('total')}</span>
                                <span>{subtotal.toFixed(2)} EGP</span>
                            </div>
                        </div>
                        <Link href="/checkout" className={buttonVariants({ size: 'lg', className: 'w-full text-lg bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-md' })}>{t('checkout')}</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
