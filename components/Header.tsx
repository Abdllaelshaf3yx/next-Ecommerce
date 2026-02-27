'use client';

import { useTranslations } from 'next-intl';
import { Link } from '../i18n/routing';
import LanguageSwitcher from './LanguageSwitcher';
import CartIcon from './CartIcon';
import { Store, User, LogOut, ChevronDown, Menu, X, Heart } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { logout } from '../store/slices/authSlice';
import { useState, useRef, useEffect } from 'react';

export default function Header() {
    const t = useTranslations('Navigation');
    const dispatch = useDispatch();
    const { isAuthenticated, user } = useSelector((state: RootState) => state.auth as any);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setDropdownOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const navLinks = [
        { href: '/', label: t('home') },
        { href: '/category/all', label: t('products') },
        { href: '/about', label: t('about') },
        { href: '/contact', label: t('contact') },
    ] as const;

    return (
        <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-lg shadow-[0_4px_30px_rgb(0,0,0,0.03)] border-b border-slate-200/50 transition-all duration-300">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2.5 text-xl font-bold hover:scale-105 transition-transform group">
                    <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-md shadow-indigo-500/30 group-hover:bg-indigo-700 transition-colors">
                        <Store className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-black text-slate-900 tracking-tight">MiniShop<span className="text-indigo-600">.</span></span>
                </Link>

                <nav className="hidden md:flex items-center gap-8">
                    {navLinks.map(({ href, label }) => (
                        <Link key={href} href={href} className="relative text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors py-2 group">
                            {label}
                            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 scale-x-0 group-hover:scale-x-100 transition-transform origin-left rounded-full"></span>
                        </Link>
                    ))}
                </nav>

                <div className="flex items-center gap-4">
                    <div className="hidden md:block"><LanguageSwitcher /></div>

                    <Link href="/wishlist" className="p-2 text-slate-600 hover:text-rose-500 hover:bg-rose-50 rounded-full transition-all cursor-pointer relative" aria-label={t('wishlist')}>
                        <Heart className="w-5 h-5" />
                    </Link>

                    <CartIcon />

                    {isAuthenticated && user ? (
                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={() => setDropdownOpen(prev => !prev)}
                                className="flex items-center gap-2 p-1 pl-1.5 pr-3 rounded-full hover:bg-slate-100 transition-all cursor-pointer border border-transparent hover:border-slate-200"
                                aria-label={t('account')}
                            >
                                <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm font-bold shadow-sm">
                                    {user.name?.charAt(0).toUpperCase()}
                                </div>
                                <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform duration-300 ${dropdownOpen ? 'rotate-180' : ''}`} />
                            </button>
                            {dropdownOpen && (
                                <div className="absolute end-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 py-1 z-50">
                                    <div className="px-4 py-2 border-b border-slate-100">
                                        <p className="text-sm text-slate-900 truncate">{user.email}</p>
                                    </div>
                                    <button
                                        onClick={() => { dispatch(logout()); setDropdownOpen(false); }}
                                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        {t('logout')}
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <Link href="/login" className="p-2 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-all cursor-pointer" aria-label={t('login')}>
                            <User className="w-5 h-5" />
                        </Link>
                    )}

                    <button
                        className="md:hidden p-2 text-slate-600 hover:text-indigo-600 transition-colors cursor-pointer"
                        onClick={() => setMobileOpen(prev => !prev)}
                        aria-label="Toggle menu"
                    >
                        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>
            </div>

            {mobileOpen && (
                <div className="md:hidden bg-white border-t border-slate-100 px-4 py-4 space-y-3 shadow-lg">
                    {navLinks.map(({ href, label }) => (
                        <Link
                            key={href}
                            href={href}
                            className="block text-sm font-semibold text-slate-600 hover:text-indigo-600 py-2 border-b border-slate-50 transition-colors"
                            onClick={() => setMobileOpen(false)}
                        >
                            {label}
                        </Link>
                    ))}
                    <div className="pt-2">
                        <LanguageSwitcher />
                    </div>
                </div>
            )}
        </header>
    );
}
