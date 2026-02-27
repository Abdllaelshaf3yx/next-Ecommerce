'use client';

import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { toast } from 'react-hot-toast';
import { MapPin, Phone, Mail, Send } from 'lucide-react';
import { useMemo } from 'react';

export default function ContactPage() {
    const t = useTranslations('Contact');
    const v = useTranslations('Validation');

    const contactSchema = useMemo(() => z.object({
        name: z.string().min(2, v('nameRequired')).max(100),
        email: z.string().min(1, v('invalidEmail')).email(v('invalidEmail')),
        message: z.string().min(10, v('messageMin')).max(1000),
    }), [v]);

    type ContactFormValues = z.infer<typeof contactSchema>;

    const { register, handleSubmit, reset, formState: { errors } } = useForm<ContactFormValues>({
        resolver: zodResolver(contactSchema),
    });

    const onSubmit = (data: ContactFormValues) => {
        toast.success(t('successMessage'));
        reset();
    };

    return (
        <div className="bg-slate-50 min-h-screen py-16 md:py-24">
            <div className="container mx-auto px-4 max-w-6xl">
                <div className="text-center mb-16 md:mb-24 max-w-2xl mx-auto">
                    <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 tracking-tight">{t('title')}</h1>
                    <p className="text-lg md:text-xl text-slate-600">{t('description')}</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-8 items-start">
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-xl shadow-slate-200/40 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex items-start gap-5 group">
                            <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300 group-hover:bg-indigo-600 group-hover:text-white">
                                <Mail className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-900 mb-1">{t('email').split(':')[0] || 'Email'}</h3>
                                <a href="mailto:abdullah.mahmoud.abdelrahman@gmail.com" className="text-slate-600 hover:text-indigo-600 transition-colors break-all font-medium">
                                    {t('email').split(':')[1]?.trim() || 'abdullah.mahmoud.abdelrahman@gmail.com'}
                                </a>
                            </div>
                        </div>

                        <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-xl shadow-slate-200/40 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex items-start gap-5 group">
                            <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300 group-hover:bg-rose-500 group-hover:text-white">
                                <Phone className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-900 mb-1">{t('phone').split(':')[0] || 'Phone'}</h3>
                                <a href="tel:+201033347073" className="text-slate-600 hover:text-rose-500 transition-colors font-medium">
                                    +201033347073
                                </a>
                            </div>
                        </div>

                        <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-xl shadow-slate-200/40 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex items-start gap-5 group">
                            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300 group-hover:bg-emerald-600 group-hover:text-white">
                                <MapPin className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-900 mb-1">{t('address')}</h3>
                                <p className="text-slate-600 font-medium leading-relaxed">{t('addressText')}</p>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-3">
                        <div className="bg-white rounded-3xl p-8 md:p-12 border border-slate-100 shadow-2xl shadow-indigo-500/5">
                            <h2 className="text-3xl font-bold text-slate-900 mb-8">{t('sendMessage')}</h2>
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 flex flex-col">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-700 ml-1 block">{t('yourName')}</label>
                                        <Input
                                            placeholder="John Doe"
                                            className="h-14 rounded-xl bg-slate-50 border-transparent focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-medium text-slate-900"
                                            {...register('name')}
                                            error={errors.name?.message}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-700 ml-1 block">{t('yourEmail')}</label>
                                        <Input
                                            type="email"
                                            placeholder="john@example.com"
                                            className="h-14 rounded-xl bg-slate-50 border-transparent focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-medium text-slate-900"
                                            {...register('email')}
                                            error={errors.email?.message}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 ml-1 block">{t('howCanWeHelp')}</label>
                                    <textarea
                                        className={`flex w-full rounded-xl bg-slate-50 border ${errors.message ? 'border-red-500 focus:ring-red-500/20' : 'border-transparent focus:border-indigo-500'} px-4 py-3 text-base placeholder:text-slate-400 focus:outline-none focus:bg-white focus:ring-4 focus:ring-indigo-500/10 transition-all min-h-[160px] resize-y font-medium text-slate-900`}
                                        placeholder={t('howCanWeHelp')}
                                        {...register('message')}
                                    />
                                    {errors.message && <p className="mt-1.5 text-sm font-bold text-red-500 ml-1">{errors.message.message}</p>}
                                </div>
                                <Button type="submit" size="lg" className="h-14 rounded-xl text-lg font-bold bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-500/30 hover:-translate-y-0.5 transition-all text-white flex items-center justify-center gap-2 mt-4 cursor-pointer">
                                    <Send className="w-5 h-5" />
                                    {t('submit')}
                                </Button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
