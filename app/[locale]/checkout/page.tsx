'use client';

import { useTranslations, useLocale } from 'next-intl';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../store/store';
import { clearCart } from '../../../store/slices/cartSlice';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Input } from '../../../components/ui/Input';
import { Button, buttonVariants } from '../../../components/ui/Button';
import { useState } from 'react';
import { Link } from '../../../i18n/routing';
import { CheckCircle } from 'lucide-react';

import { useMemo } from 'react';

export default function CheckoutPage() {
    const t = useTranslations('Checkout');
    const cartLocale = useTranslations('Cart');
    const v = useTranslations('Validation');
    const nav = useTranslations('Navigation');
    const dispatch = useDispatch();
    const items = useSelector((state: RootState) => state.cart.items);
    const isAuthenticated = useSelector((state: any) => state.auth?.isAuthenticated);
    const locale = useLocale();

    const shippingSchema = useMemo(() => z.object({
        fullName: z.string().min(2, v('nameRequired')).max(100),
        email: z.string().min(1, v('invalidEmail')).email(v('invalidEmail')),
        address: z.string().min(5, v('addressRequired')).max(200),
        city: z.string().min(2, v('cityRequired')).max(50),
        zipCode: z.string().regex(/^\d{5}$/, v('zipCodeRequired')),
    }), [v]);

    type ShippingFormValues = z.infer<typeof shippingSchema>;

    const [step, setStep] = useState<1 | 2 | 3>(1);
    const [shippingData, setShippingData] = useState<ShippingFormValues | null>(null);

    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const { register, handleSubmit, formState: { errors } } = useForm<ShippingFormValues>({
        resolver: zodResolver(shippingSchema),
    });

    const onShippingSubmit = (data: ShippingFormValues) => {
        setShippingData(data);
        setStep(2);
    };

    const handlePlaceOrder = () => {
        dispatch(clearCart());
        setStep(3);
    };

    if (items.length === 0 && step !== 3) {
        return (
            <div className="container mx-auto px-4 py-16 text-center">
                <h1 className="text-3xl font-bold mb-4">{cartLocale('empty')}</h1>
                <Link href="/" className={`${buttonVariants({ variant: 'primary' })} cursor-pointer`}>{cartLocale('continueShopping')}</Link>
            </div>
        );
    }

    if (step === 3) {
        return (
            <div className="container mx-auto px-4 py-16 text-center flex flex-col items-center justify-center min-h-[50vh]">
                <CheckCircle className="w-20 h-20 text-green-500 mb-6" />
                <h1 className="text-4xl font-bold mb-4 text-gray-900">{t('successTitle')}</h1>
                <p className="text-xl text-gray-600 mb-8">{t('successMessage')}</p>
                <Link href="/" className={`${buttonVariants({ size: 'lg' })} cursor-pointer`}>{cartLocale('continueShopping')}</Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-12 max-w-5xl">
            <h1 className="text-4xl font-extrabold mb-10 text-slate-900 tracking-tight">{t('title')}</h1>

            {!isAuthenticated && (
                <div className="mb-8 p-4 bg-blue-50 text-blue-800 rounded-lg flex items-center justify-between">
                    <p>{t('logInPrompt')}</p>
                    <Link href="/login" className={`${buttonVariants({ variant: 'outline', size: 'sm' })} cursor-pointer`}>{nav('login')}</Link>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2">
                    {step === 1 && (
                        <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/50">
                            <h2 className="text-2xl font-bold mb-8 text-slate-800 flex items-center gap-3">
                                <span className="bg-indigo-100 text-indigo-600 w-8 h-8 rounded-full flex items-center justify-center text-sm">1</span>
                                {t('shipping')}
                            </h2>
                            <form onSubmit={handleSubmit(onShippingSubmit)} className="space-y-4">
                                <Input
                                    placeholder={t('fullName')}
                                    {...register('fullName')}
                                    error={errors.fullName?.message}
                                />
                                <Input
                                    type="email"
                                    placeholder={t('emailAddress')}
                                    {...register('email')}
                                    error={errors.email?.message}
                                />
                                <Input
                                    placeholder={t('shippingAddress')}
                                    {...register('address')}
                                    error={errors.address?.message}
                                />
                                <div className="grid grid-cols-2 gap-4">
                                    <Input
                                        placeholder={t('city')}
                                        {...register('city')}
                                        error={errors.city?.message}
                                    />
                                    <Input
                                        placeholder={t('zipCode')}
                                        {...register('zipCode')}
                                        error={errors.zipCode?.message}
                                    />
                                </div>
                                <Button type="submit" size="lg" className="w-full mt-8 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-md h-12 text-lg cursor-pointer">{t('review')}</Button>
                            </form>
                        </div>
                    )}

                    {step === 2 && shippingData && (
                        <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/50">
                            <h2 className="text-2xl font-bold mb-8 text-slate-800 flex items-center gap-3">
                                <span className="bg-indigo-100 text-indigo-600 w-8 h-8 rounded-full flex items-center justify-center text-sm">2</span>
                                {t('review')}
                            </h2>

                            <div className="mb-8 p-6 bg-slate-50 border border-slate-100 rounded-xl">
                                <h3 className="font-bold mb-4 text-slate-800 border-b border-slate-200 pb-2">{t('shippingTo')}</h3>
                                <div className="text-slate-600 space-y-1">
                                    <p className="font-medium text-slate-900">{shippingData.fullName}</p>
                                    <p>{shippingData.address}</p>
                                    <p>{shippingData.city}, {shippingData.zipCode}</p>
                                </div>
                                <button
                                    onClick={() => setStep(1)}
                                    className="text-sm text-indigo-600 mt-4 font-medium hover:underline flex items-center gap-1 cursor-pointer"
                                >
                                    {t('editInformation')}
                                </button>
                            </div>

                            <Button onClick={handlePlaceOrder} size="lg" className="w-full bg-slate-900 hover:bg-slate-800 text-white rounded-xl shadow-md h-14 text-lg font-bold cursor-pointer">
                                {t('placeOrder')}
                            </Button>
                        </div>
                    )}
                </div>

                <div className="md:col-span-1">
                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/50 sticky top-28">
                        <h2 className="text-xl font-bold mb-6 border-b border-slate-100 pb-4 text-slate-900">{cartLocale('orderSummary')}</h2>
                        <div className="space-y-4 mb-6">
                            {items.map(item => (
                                <div key={item.id} className="flex justify-between text-sm">
                                    <span className="text-gray-600 truncate mr-2">
                                        {item.quantity}x {locale === 'ar' ? item.name_ar : item.name_en}
                                    </span>
                                    <span className="font-medium">{(item.price * item.quantity).toFixed(2)} EGP</span>
                                </div>
                            ))}
                        </div>

                        <div className="border-t border-gray-200 pt-4 mb-2">
                            <div className="flex justify-between text-gray-600">
                                <span>{cartLocale('subtotal')}</span>
                                <span>{subtotal.toFixed(2)} EGP</span>
                            </div>
                        </div>
                        <div className="flex justify-between text-gray-600 mb-4">
                            <span>{t('shippingFee')}</span>
                            <span>{t('free')}</span>
                        </div>
                        <div className="border-t border-gray-200 pt-4">
                            <div className="flex justify-between text-lg font-bold">
                                <span>{cartLocale('total')}</span>
                                <span>{subtotal.toFixed(2)} EGP</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
