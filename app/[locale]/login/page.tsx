'use client';

import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { useDispatch } from 'react-redux';
import { login } from '../../../store/slices/authSlice';
import { useRouter } from '../../../i18n/routing';
import { Link } from '../../../i18n/routing';

import { useMemo } from 'react';

export default function LoginPage() {
    const t = useTranslations('Auth');
    const v = useTranslations('Validation');
    const dispatch = useDispatch();
    const router = useRouter();

    const loginSchema = useMemo(() => z.object({
        email: z.string().min(1, v('invalidEmail')).email(v('invalidEmail')),
        password: z.string().min(8, v('passwordMin')),
    }), [v]);

    type LoginFormValues = z.infer<typeof loginSchema>;

    const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = (data: LoginFormValues) => {
        dispatch(login({ id: 'u1', email: data.email, name: 'John Doe' }));
        router.push('/');
    };

    return (
        <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-[70vh]">
            <div className="w-full max-w-md bg-white p-8 rounded-xl border shadow-sm">
                <h1 className="text-3xl font-bold mb-8 text-center text-gray-900">{t('loginTitle')}</h1>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <Input
                        type="email"
                        placeholder={t('email')}
                        {...register('email')}
                        error={errors.email?.message}
                    />
                    <Input
                        type="password"
                        placeholder={t('password')}
                        {...register('password')}
                        error={errors.password?.message}
                    />
                    <Button type="submit" size="lg" className="w-full">{t('submit')}</Button>
                </form>
                <p className="mt-6 text-center text-gray-600">
                    {t('dontHaveAccount')} <Link href="/signup" className="text-blue-600 hover:underline">{t('signUpLink')}</Link>
                </p>
            </div>
        </div>
    );
}
