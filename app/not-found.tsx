'use client';

import Link from 'next/link';

export default function RootNotFound() {
    return (
        <html lang="en">
            <body style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'system-ui', textAlign: 'center', padding: '2rem' }}>
                <div>
                    <h1 style={{ fontSize: '5rem', fontWeight: 800, color: '#1e293b', marginBottom: '1rem' }}>404</h1>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#475569', marginBottom: '1rem' }}>Page Not Found</h2>
                    <p style={{ color: '#94a3b8', marginBottom: '2rem' }}>This page does not exist. Try visiting the store.</p>
                    <Link href="/en" style={{ padding: '0.75rem 1.5rem', background: '#4f46e5', color: '#fff', borderRadius: '0.5rem', textDecoration: 'none', fontWeight: 600 }}>
                        Go to MiniShop
                    </Link>
                </div>
            </body>
        </html>
    );
}
