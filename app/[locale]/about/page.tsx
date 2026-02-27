import { getTranslations } from 'next-intl/server';
import { Store, Heart, ShieldCheck, Zap } from 'lucide-react';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'About' });
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    return {
        title: `${t('title')} | MiniShop`,
        alternates: {
            canonical: `${baseUrl}/${locale}/about`,
            languages: { 'en': `${baseUrl}/en/about`, 'ar': `${baseUrl}/ar/about`, 'x-default': `${baseUrl}/en/about` }
        }
    };
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'About' });

    return (
        <div className="bg-slate-50 min-h-screen pb-20">
            <div className="bg-slate-950 text-white py-24 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/40 to-slate-950 z-0"></div>
                <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3"></div>

                <div className="container mx-auto px-4 relative z-10 text-center max-w-3xl">
                    <div className="w-16 h-16 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/20 flex items-center justify-center mx-auto mb-8 shadow-2xl">
                        <Store className="w-8 h-8 text-indigo-400" />
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">{t('title')}</h1>
                    <p className="text-xl md:text-2xl text-slate-300 leading-relaxed font-medium">
                        {t('p1')}
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 max-w-5xl -mt-16 relative z-20 mb-20">
                <div className="bg-white rounded-3xl p-8 md:p-12 shadow-2xl shadow-slate-200/50 border border-slate-100 prose prose-lg md:prose-xl max-w-none text-slate-600 leading-relaxed text-center">
                    <p className="text-lg md:text-xl font-medium text-slate-700 leading-relaxed mb-0">{t('p2')}</p>
                </div>
            </div>

            <div className="container mx-auto px-4 max-w-6xl">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-4">{t('valuesTitle')}</h2>
                    <div className="w-24 h-1.5 bg-indigo-600 mx-auto rounded-full"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-xl shadow-slate-200/40 hover:-translate-y-2 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300">
                        <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center mb-6 text-indigo-600">
                            <ShieldCheck className="w-7 h-7" />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 mb-4">{t('quality')}</h3>
                        <p className="text-slate-600 leading-relaxed">{t('qualityDesc')}</p>
                    </div>
                    <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-xl shadow-slate-200/40 hover:-translate-y-2 hover:shadow-2xl hover:shadow-rose-500/10 transition-all duration-300">
                        <div className="w-14 h-14 bg-rose-50 rounded-2xl flex items-center justify-center mb-6 text-rose-500">
                            <Heart className="w-7 h-7" />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 mb-4">{t('customerFirst')}</h3>
                        <p className="text-slate-600 leading-relaxed">{t('customerFirstDesc')}</p>
                    </div>
                    <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-xl shadow-slate-200/40 hover:-translate-y-2 hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-300">
                        <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mb-6 text-emerald-600">
                            <Zap className="w-7 h-7" />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 mb-4">{t('integrity')}</h3>
                        <p className="text-slate-600 leading-relaxed">{t('integrityDesc')}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
