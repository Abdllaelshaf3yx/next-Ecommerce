import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '../../i18n/routing';
import StoreProvider from '../../components/StoreProvider';
import { Inter, Cairo } from 'next/font/google';
import './globals.css';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { Toaster } from 'react-hot-toast';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

const cairo = Cairo({
  variable: '--font-cairo',
  subsets: ['arabic', 'latin'],
});

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Home' });
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  return {
    metadataBase: new URL(baseUrl),
    title: {
      default: `MiniShop - ${t('title')}`,
      template: '%s | MiniShop'
    },
    description: t('description'),
    openGraph: {
      title: `MiniShop - ${t('title')}`,
      description: t('description'),
      siteName: 'MiniShop',
      locale: locale === 'ar' ? 'ar_SA' : 'en_US',
      type: 'website',
      url: `${baseUrl}/${locale}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: `MiniShop - ${t('title')}`,
      description: t('description'),
    },
    alternates: {
      canonical: `${baseUrl}/${locale}`,
      languages: {
        'en': `${baseUrl}/en`,
        'ar': `${baseUrl}/ar`,
        'x-default': `${baseUrl}/en`,
      }
    }
  };
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const resolvedParams = await params;
  const locale = resolvedParams.locale;

  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages();

  const isRTL = locale === 'ar';

  return (
    <html lang={locale} dir={isRTL ? 'rtl' : 'ltr'}>
      <body className={`${isRTL ? cairo.variable : inter.variable} font-sans antialiased flex flex-col min-h-screen bg-slate-50 text-slate-900`}>
        <StoreProvider>
          <NextIntlClientProvider messages={messages}>
            <Header />
            <main className="flex-grow flex flex-col">
              {children}
            </main>
            <Footer />
            <Toaster position={isRTL ? 'bottom-left' : 'bottom-right'} />
          </NextIntlClientProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
