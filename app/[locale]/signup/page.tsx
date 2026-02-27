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

export default function SignupPage() {
    const t = useTranslations('Auth');
    const v = useTranslations('Validation');
    const dispatch = useDispatch();
    const router = useRouter();

    const signupSchema = useMemo(() => z.object({
        name: z.string().min(2, v('nameRequired')).max(50),
        email: z.string().min(1, v('invalidEmail')).email(v('invalidEmail')),
        password: z.string()
            .min(8, v('passwordMin'))
            .regex(/[A-Z]/, v('passwordUppercase'))
            .regex(/[a-z]/, v('passwordLowercase'))
            .regex(/[0-9]/, v('passwordNumber')),
    }), [v]);

    type SignupFormValues = z.infer<typeof signupSchema>;

    const { register, handleSubmit, formState: { errors } } = useForm<SignupFormValues>({
        resolver: zodResolver(signupSchema),
    });

    const onSubmit = (data: SignupFormValues) => {
        dispatch(login({ id: 'u' + Date.now().toString(), email: data.email, name: data.name }));
        router.push('/');
    };

    return (
        <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-[70vh]">
            <div className="w-full max-w-md bg-white p-8 rounded-xl border shadow-sm">
                <h1 className="text-3xl font-bold mb-8 text-center text-gray-900">{t('signupTitle')}</h1>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <Input
                        placeholder={t('fullName')}
                        {...register('name')}
                        error={errors.name?.message}
                    />
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
                    {t('alreadyHaveAccount')} <Link href="/login" className="text-blue-600 hover:underline">{t('logInLink')}</Link>
                </p>
            </div>
        </div>
    );
}
