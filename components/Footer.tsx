import { getTranslations } from 'next-intl/server';
import { getLocale } from 'next-intl/server';
import { Link } from '../i18n/routing';
import { MapPin, Phone, Mail, Store } from 'lucide-react';

export default async function Footer() {
    const locale = await getLocale();
    const t = await getTranslations({ locale, namespace: 'Navigation' });
    const tf = await getTranslations({ locale, namespace: 'Footer' });

    return (
        <footer className="bg-slate-950 border-t border-slate-900 mt-auto text-slate-400">
            <div className="container mx-auto px-4 pt-16 pb-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 mb-12">
                    <div className="md:col-span-2">
                        <Link href="/" className="inline-flex items-center gap-2.5 text-xl font-bold mb-6 hover:opacity-90 transition-opacity">
                            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-md shadow-indigo-500/30">
                                <Store className="w-5 h-5 text-white" />
                            </div>
                            <span className="font-black text-white tracking-tight">MiniShop<span className="text-indigo-500">.</span></span>
                        </Link>
                        <p className="text-slate-400 mb-6 text-sm leading-relaxed max-w-sm">
                            {tf('description')}
                        </p>
                    </div>
                    <div>
                        <h4 className="font-bold mb-6 text-white tracking-wide uppercase text-sm">{tf('quickLinks')}</h4>
                        <ul className="space-y-3 text-sm text-slate-400">
                            <li><Link href="/" className="hover:text-indigo-400 transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-indigo-500/0 hover:bg-indigo-500 transition-colors"></span>{t('home')}</Link></li>
                            <li><Link href="/about" className="hover:text-indigo-400 transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-indigo-500/0 hover:bg-indigo-500 transition-colors"></span>{t('about')}</Link></li>
                            <li><Link href="/contact" className="hover:text-indigo-400 transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-indigo-500/0 hover:bg-indigo-500 transition-colors"></span>{t('contact')}</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold mb-6 text-white tracking-wide uppercase text-sm">{tf('contactUs')}</h4>
                        <address className="not-italic text-sm text-slate-400 space-y-4">
                            <p className="flex items-start gap-3"><MapPin className="w-5 h-5 shrink-0 text-indigo-400" /> <span>{tf('addressLine1')}</span></p>
                            <p className="flex items-start gap-3"><Phone className="w-5 h-5 shrink-0 text-indigo-400" /> <span>{tf('addressLine2')}</span></p>
                            <p className="flex items-start gap-3"><Mail className="w-5 h-5 shrink-0 text-indigo-400" /> <span className="break-all">{tf('email')}</span></p>
                        </address>
                    </div>
                </div>
                <div className="pt-8 border-t border-slate-800/50 flex flex-col md:flex-row items-center justify-between text-sm text-slate-500">
                    <p>&copy; {new Date().getFullYear()} MiniShop. {tf('rights')}</p>
                    <div className="flex items-center gap-4 mt-4 md:mt-0">
                    </div>
                </div>
            </div>
        </footer>
    );
}
